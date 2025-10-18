
'use server';

/**
 * @fileOverview Generates a digital wallet pass for a user's business card.
 * This implementation generates a JWT for Google Wallet and simulates an Apple Wallet pass.
 *
 * - createWalletPass - A function that creates a wallet pass.
 * - CreateWalletPassInput - The input type for the createWalletPass function.
 * - CreateWalletPassOutput - The return type for the createWalletPass function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { BusinessCard, UserProfile } from '@/lib/types';
import { getString } from '@/lib/utils';
import jwt from 'jsonwebtoken';


const CreateWalletPassInputSchema = z.object({
  businessCard: z.custom<Partial<BusinessCard>>().describe("The user's business card data."),
  userProfile: z.custom<Partial<UserProfile>>().describe("The user's profile data, for fallback information."),
});
export type CreateWalletPassInput = z.infer<typeof CreateWalletPassInputSchema>;


const CreateWalletPassOutputSchema = z.object({
  googleWalletUrl: z.string().url().describe('The URL to the generated Google Wallet pass.'),
  appleWalletPass: z.string().describe('The Base64 encoded Apple Wallet pass data.'),
});
export type CreateWalletPassOutput = z.infer<typeof CreateWalletPassOutputSchema>;


export async function createWalletPass(
  input: CreateWalletPassInput
): Promise<CreateWalletPassOutput> {
  return createWalletPassFlow(input);
}


const createWalletPassFlow = ai.defineFlow(
  {
    name: 'createWalletPassFlow',
    inputSchema: CreateWalletPassInputSchema,
    outputSchema: CreateWalletPassOutputSchema,
  },
  async (input) => {
    
    const { businessCard, userProfile } = input;
    if (!businessCard || !userProfile) {
        throw new Error('BusinessCard and UserProfile data are required.');
    }

    // --- Google Wallet JWT Generation ---
    
    // In a real implementation, these would come from your Google Cloud project settings and environment variables.
    const issuerId = process.env.GOOGLE_ISSUER_ID || "3388000000022212222"; // FAKE - Replace with your Google Wallet Issuer ID
    const passClassSuffix = process.env.GOOGLE_PASS_CLASS_SUFFIX || "galaxieslink-business-card-class"; // FAKE - Replace with your Pass Class suffix
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "google-wallet-signer@studio-7568947177-2be23.iam.gserviceaccount.com";
    
    // Sanitize and prepare data for the pass
    const cardHolderName = businessCard.name || userProfile.displayName || 'N/A';
    const jobTitle = getString(businessCard.jobTitle, 'en') || '';
    const organization = businessCard.company || 'GalaxiesLink User';
    const passId = `${issuerId}.${userProfile.id || 'user'}-${businessCard.id || 'card'}-${Date.now()}`;

    // Construct the payload for the Google Wallet pass
    const googlePassPayload = {
      iss: serviceAccountEmail,
      aud: "google",
      typ: "savetowallet",
      iat: Math.floor(Date.now() / 1000),
      origins: ["https://www.galaxislink.com"], // Replace with your app's domain, e.g. ["https://your-domain.com"]
      payload: {
        genericObjects: [
          {
            id: passId,
            classId: `${issuerId}.${passClassSuffix}`,
            genericType: "GENERIC_TYPE_BUSINESS_CARD",
            hexBackgroundColor: "#A084CF", // This should match your theme color
            logo: {
              sourceUri: {
                uri: userProfile.avatarUrl || "https://www.galaxislink.com/logo.png" // Replace with a default logo
              },
              contentDescription: {
                defaultValue: { language: "en", value: `${cardHolderName}'s Logo` }
              }
            },
            cardTitle: {
              defaultValue: { language: "en", value: cardHolderName }
            },
            subheader: {
              defaultValue: { language: "en", value: jobTitle }
            },
            header: {
              defaultValue: { language: "en", value: organization }
            },
            barcode: {
              type: "QR_CODE",
              value: `https://www.galaxislink.com/${userProfile.username}`, // URL to the user's public profile
              alternateText: `VCARD for ${cardHolderName}`
            },
            heroImage: businessCard.coverPhotoUrl ? {
              sourceUri: { uri: businessCard.coverPhotoUrl }
            } : undefined,
            textModulesData: [
              {
                id: "contact_info",
                header: "CONTACT",
                body: `Email: ${businessCard.email || ''}\nPhone: ${businessCard.phone || ''}`
              },
               {
                id: "links",
                header: "LINKS",
                body: "View all links on GalaxiesLink profile.",
              }
            ],
          }
        ]
      }
    };
    
    // --- CRITICAL STEP: JWT Signing ---
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!privateKey) {
        // Private key is not set. Throw an error with a helpful message for developers.
        // This creates a special URL that opens the Google Wallet documentation with the JWT pre-filled.
        const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify(googlePassPayload));
        const devUrl = `https://pay.google.com/gp/v/object/new?jwt=${header}.${payload}.`;
        throw new Error(`GOOGLE_PRIVATE_KEY is not set. To test, open this developer URL: ${devUrl}`);
    }

    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
    const token = jwt.sign(googlePassPayload, formattedPrivateKey, { algorithm: 'RS256'});
    const googleWalletJwt = token;


    // --- Apple Wallet Pass Generation (DEMO) ---
    // This part simulates creating and Base64 encoding an Apple .pkpass file.
    // A real implementation requires creating a pass template, signing it with a
    // Pass Type ID certificate from an Apple Developer account, and bundling it.
    const applePassContent = {
        formatVersion: 1,
        passTypeIdentifier: "pass.com.example.your-pass-type-id", // FAKE - Replace with your Pass Type ID
        serialNumber: `${passId}`,
        teamIdentifier: "YOUR_APPLE_TEAM_ID", // FAKE - Replace with your Apple Team ID
        organizationName: organization,
        description: "GalaxiesLink Digital Business Card",
        logoText: cardHolderName,
        foregroundColor: "rgb(255, 255, 255)",
        backgroundColor: "rgb(160, 132, 207)", // Soft Purple
        generic: {
            primaryFields: [{ key: "name", label: "Name", value: cardHolderName }],
            secondaryFields: [{ key: "title", label: "Title", value: jobTitle }],
            auxiliaryFields: [{ key: "company", label: "Company", value: organization }]
        },
    };
    const appleWalletPassBase64 = Buffer.from(JSON.stringify(applePassContent)).toString('base64');
    
    console.log(`Generated Wallet Pass for: ${cardHolderName}`);

    // Return the dummy data for UI development.
    return {
      googleWalletUrl: `https://pay.google.com/gp/v/save/${googleWalletJwt}`,
      appleWalletPass: appleWalletPassBase64,
    };
  }
);
