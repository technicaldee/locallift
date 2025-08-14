import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const sampleBusinesses = [
  {
    name: "Local Coffee Roasters",
    description: "Artisanal coffee roasting business looking to expand our equipment and reach more customers. We source beans directly from farmers and focus on sustainable practices.",
    imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=600&fit=crop",
    ownerWallet: "0x1234567890123456789012345678901234567890",
    requestedAmount: 25000,
    paybackPercentage: 18,
    currentInvestment: 8500,
    isVerified: true,
    gallery: [],
    verificationImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Urban Vertical Farm",
    description: "Innovative vertical farming startup growing fresh produce in the city. We need funding for new hydroponic systems and LED lighting to increase our yield.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=600&fit=crop",
    ownerWallet: "0x2345678901234567890123456789012345678901",
    requestedAmount: 50000,
    paybackPercentage: 22,
    currentInvestment: 12000,
    isVerified: false,
    gallery: [],
    verificationImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Artisan Bakery",
    description: "Family-owned bakery specializing in sourdough and pastries. Looking to expand our storefront and add new ovens to meet growing demand.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=600&fit=crop",
    ownerWallet: "0x3456789012345678901234567890123456789012",
    requestedAmount: 15000,
    paybackPercentage: 15,
    currentInvestment: 5200,
    isVerified: true,
    gallery: [],
    verificationImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Tech Repair Shop",
    description: "Mobile device and computer repair service. Need funding for diagnostic equipment and inventory to serve more customers faster.",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=600&fit=crop",
    ownerWallet: "0x4567890123456789012345678901234567890123",
    requestedAmount: 20000,
    paybackPercentage: 20,
    currentInvestment: 3800,
    isVerified: false,
    gallery: [],
    verificationImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Fitness Studio",
    description: "Boutique fitness studio offering yoga and pilates classes. Looking to expand with new equipment and additional class space.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    ownerWallet: "0x5678901234567890123456789012345678901234",
    requestedAmount: 30000,
    paybackPercentage: 16,
    currentInvestment: 18500,
    isVerified: true,
    gallery: [],
    verificationImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function seedDatabase() {
  try {
    // Check if businesses already exist
    const businessesRef = collection(db, 'businesses');
    const snapshot = await getDocs(businessesRef);
    
    if (snapshot.empty) {
      console.log('Seeding database with sample businesses...');
      
      for (const business of sampleBusinesses) {
        await addDoc(businessesRef, business);
      }
      
      console.log('Database seeded successfully!');
    } else {
      console.log('Database already has data, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}