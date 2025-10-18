
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeFirebaseAdmin } from '@/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import getRawBody from 'raw-body';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// Initialize Firebase Admin for server-side operations
initializeFirebaseAdmin();
const firestore = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await getRawBody(req.body!);
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      
      case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.mode === 'subscription') {
              // This is handled by the subscription events
          } else if (session.mode === 'payment') {
              // Handle one-time payment, e.g., for an NFC card order
              await handleOneTimePayment(session);
          }
          break;
          
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 });
  }
}


async function handleSubscriptionChange(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const user = await findUserByStripeCustomerId(customerId);

    if (!user) {
        console.error(`User not found for Stripe customer ID: ${customerId}`);
        return;
    }

    const subscriptionData = {
        id: subscription.id,
        status: subscription.status,
        planId: subscription.items.data[0].price.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
    };
    
    // Get the plan's role from your products collection
    const priceId = subscription.items.data[0].price.id;
    const planRole = await getRoleForPrice(priceId);


    // Update subscription in Firestore
    const subDocRef = doc(firestore, `stripe_customers/${user.uid}/subscriptions`, subscription.id);
    await setDoc(subDocRef, subscriptionData, { merge: true });

    // Update user's plan and role in Firestore
    const userDocRef = doc(firestore, `users`, user.uid);
    await setDoc(userDocRef, {
        plan: planRole || 'free', // Fallback to 'free' if no role found
        stripeCustomerId: customerId,
    }, { merge: true });
    
    // Set custom claims for role-based access
     if (planRole) {
        const auth = getAuth();
        await auth.setCustomUserClaims(user.uid, { role: planRole });
    }
}

async function handleOneTimePayment(session: Stripe.Checkout.Session) {
    const customerId = session.customer as string;
    const user = await findUserByStripeCustomerId(customerId);

    if (!user) {
        console.error(`User not found for Stripe customer ID: ${customerId}`);
        return;
    }
    
     // Retrieve line items to see what was purchased
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const orderItems = lineItems.data.map(item => ({
        priceId: item.price?.id,
        productId: item.price?.product,
        quantity: item.quantity,
    }));

    const orderData = {
        id: session.id,
        userId: user.uid,
        amount: session.amount_total,
        currency: session.currency,
        items: orderItems,
        status: 'completed',
        createdAt: new Date().toISOString(),
    };

    const orderDocRef = doc(firestore, `users/${user.uid}/orders`, session.id);
    await setDoc(orderDocRef, orderData);

    console.log(`Order ${session.id} for user ${user.uid} created.`);
}


async function findUserByStripeCustomerId(customerId: string) {
    // This is a simplified lookup. In a real app, you would query the 'users' collection
    // where stripeCustomerId === customerId. This requires an index.
    // For this example, we assume the customer object in Stripe's event has the user's email or UID in metadata.
    // Let's assume you've set 'firebase_uid' in the customer metadata when creating them.
    
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const firebaseUid = customer.metadata.firebase_uid;
    
    if (!firebaseUid) return null;

    const auth = getAuth();
    return await auth.getUser(firebaseUid);
}

async function getRoleForPrice(priceId: string): Promise<string | null> {
    // This function would query your 'products' collection in Firestore
    // to find which product/plan corresponds to the given Stripe price ID
    // and return the associated role.
    // This is a placeholder implementation.
    
    // Example:
    if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return 'premium';
    if (priceId === process.env.STRIPE_BASIC_PRICE_ID) return 'basic';
    
    return null;
}
