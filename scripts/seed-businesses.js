const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Firebase configuration (you'll need to replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Sample businesses data
const sampleBusinesses = [
  {
    name: "Maria's Bakery",
    description: "A family-owned bakery specializing in traditional pastries and fresh bread. We need funding to expand our kitchen and hire more staff to meet growing demand.",
    requestedAmount: 15000,
    paybackPercentage: 12,
    walletAddress: "0x1234567890123456789012345678901234567890",
    currentInvestment: 0,
    isVerified: true,
    category: "Food & Beverage",
    location: "Downtown District",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    businessPlan: "Expand kitchen capacity and hire 3 additional bakers",
    expectedROI: 15,
    paybackPeriod: 18
  },
  {
    name: "Tech Repair Hub",
    description: "Mobile phone and laptop repair service. Looking for investment to open a second location and purchase advanced diagnostic equipment.",
    requestedAmount: 25000,
    paybackPercentage: 15,
    walletAddress: "0x2345678901234567890123456789012345678901",
    currentInvestment: 0,
    isVerified: true,
    category: "Technology",
    location: "Tech District",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
    businessPlan: "Open second location and purchase diagnostic equipment",
    expectedROI: 18,
    paybackPeriod: 24
  },
  {
    name: "Green Garden Supplies",
    description: "Eco-friendly gardening supplies and plant nursery. Seeking funds to expand inventory and build greenhouse facilities for year-round growing.",
    requestedAmount: 20000,
    paybackPercentage: 10,
    walletAddress: "0x3456789012345678901234567890123456789012",
    currentInvestment: 0,
    isVerified: true,
    category: "Agriculture",
    location: "Garden District",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    businessPlan: "Build greenhouse and expand organic plant inventory",
    expectedROI: 12,
    paybackPeriod: 20
  },
  {
    name: "Artisan Coffee Roasters",
    description: "Small-batch coffee roasting business. Need investment for commercial roasting equipment and to establish wholesale partnerships with local cafes.",
    requestedAmount: 30000,
    paybackPercentage: 14,
    walletAddress: "0x4567890123456789012345678901234567890123",
    currentInvestment: 0,
    isVerified: true,
    category: "Food & Beverage",
    location: "Arts Quarter",
    imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400",
    businessPlan: "Purchase commercial roasting equipment and establish wholesale network",
    expectedROI: 16,
    paybackPeriod: 22
  },
  {
    name: "Local Fitness Studio",
    description: "Community fitness studio offering yoga, pilates, and strength training. Looking for funding to expand class offerings and purchase new equipment.",
    requestedAmount: 18000,
    paybackPercentage: 11,
    walletAddress: "0x5678901234567890123456789012345678901234",
    currentInvestment: 0,
    isVerified: true,
    category: "Health & Fitness",
    location: "Wellness District",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    businessPlan: "Expand class schedule and purchase modern fitness equipment",
    expectedROI: 13,
    paybackPeriod: 16
  },
  {
    name: "Handmade Jewelry Studio",
    description: "Artisan jewelry maker specializing in custom pieces. Need investment for better tools, materials, and an online store to reach more customers.",
    requestedAmount: 12000,
    paybackPercentage: 13,
    walletAddress: "0x6789012345678901234567890123456789012345",
    currentInvestment: 0,
    isVerified: true,
    category: "Arts & Crafts",
    location: "Creative Quarter",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    businessPlan: "Upgrade tools and launch e-commerce platform",
    expectedROI: 15,
    paybackPeriod: 15
  },
  {
    name: "Urban Farm Co-op",
    description: "Vertical farming initiative growing fresh produce in the city. Seeking investment for hydroponic systems and distribution infrastructure.",
    requestedAmount: 35000,
    paybackPercentage: 16,
    walletAddress: "0x7890123456789012345678901234567890123456",
    currentInvestment: 0,
    isVerified: true,
    category: "Agriculture",
    location: "Urban Center",
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400",
    businessPlan: "Install hydroponic systems and establish distribution network",
    expectedROI: 19,
    paybackPeriod: 26
  },
  {
    name: "Community Bookstore Cafe",
    description: "Independent bookstore with cafe. Looking for funds to renovate space, expand book inventory, and create a community event space.",
    requestedAmount: 22000,
    paybackPercentage: 9,
    walletAddress: "0x8901234567890123456789012345678901234567",
    currentInvestment: 0,
    isVerified: true,
    category: "Retail",
    location: "Literary District",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    businessPlan: "Renovate space and create community event area",
    expectedROI: 11,
    paybackPeriod: 24
  }
];

async function seedBusinesses() {
  try {
    console.log('Starting to seed businesses...');
    
    for (const business of sampleBusinesses) {
      const docRef = await addDoc(collection(db, 'businesses'), {
        ...business,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Added business: ${business.name} with ID: ${docRef.id}`);
    }
    
    console.log('\n🎉 Successfully seeded all businesses!');
    console.log(`Total businesses added: ${sampleBusinesses.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding businesses:', error);
  }
}

// Run the seeding function
seedBusinesses();