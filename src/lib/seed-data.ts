
import { collection, writeBatch, getDocs, Firestore, doc } from 'firebase/firestore';
import type { NFCCard } from './types';

const nfcProducts: Omit<NFCCard, 'id'>[] = [
    {
        name: "GalaxisLink Card",
        price: 19.99,
        description: "The official GalaxisLink NFC card. Order now and after receiving it, simply log in to activate it and link it to your digital profile.",
        features: [
            "Official GalaxisLink branding",
            "NFC NTAG216 Chip",
            "Durable PVC material",
            "Activate in your dashboard after purchase"
        ],
        imageUrl: "https://picsum.photos/seed/galaxiscard/600/600",
        imageHint: "branded nfc card",
        isPrimary: false,
        action: "Order Now",
        href: "/dashboard/activate",
        order: -1,
    },
    {
        name: "VibeCard Luxury",
        price: 99.99,
        description: "The ultimate statement. Fully customizable with your logo or monogram on a premium textured finish.",
        features: [
            "Your custom design front and center",
            "High-end textured material",
            "NFC NTAG216 Chip",
            "The pinnacle of personal branding"
        ],
        imageUrl: "https://picsum.photos/seed/nfccard4/600/600",
        imageHint: "luxury pattern",
        isPrimary: true,
        action: "Customize Now",
        href: "/designer",
        order: 0,
    },
    {
        name: "VibeCard Metal",
        price: 49.99,
        description: "Pure elegance. Made from high-grade stainless steel with a matte black finish.",
        features: [
            "Laser engraved logo & QR code",
            "NFC NTAG216 Chip",
            "Durable and impressive",
            "Comes in a premium gift box"
        ],
        imageUrl: "https://picsum.photos/seed/nfccard1/600/600",
        imageHint: "metal business card",
        action: "Order Now",
        href: "/dashboard/activate",
        order: 1,
    },
    {
        name: "VibeCard Wood",
        price: 39.99,
        description: "Sustainable and unique. Crafted from sustainably sourced cherry wood.",
        features: [
            "Engraved details",
            "NFC NTAG216 Chip",
            "Natural, warm feel",
            "Eco-friendly choice"
        ],
        imageUrl: "https://picsum.photos/seed/nfccard2/600/600",
        imageHint: "wood business card",
        action: "Order Now",
        href: "/dashboard/activate",
        order: 2,
    },
    {
        name: "VibeCard Plastic",
        price: 24.99,
        description: "Versatile and customizable. High-quality PVC with full-color printing.",
        features: [
            "Your design, your colors",
            "NFC NTAG216 Chip",
            "Waterproof and flexible",
            "Perfect for teams"
        ],
        imageUrl: "https://picsum.photos/seed/nfccard3/600/600",
        imageHint: "plastic business card",
        action: "Design Now",
        href: "/designer",
        order: 3,
    }
];


export async function seedNfcCardData(db: Firestore) {
  // This function is intentionally left empty to prevent a server restart loop.
  // The logic was moved to a one-time script or should be handled by a proper backend seeding mechanism.
}
