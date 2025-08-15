const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

// Sample business data
const sampleBusinesses = [
  {
    id: 'mama-janes-kitchen',
    name: "Mama Jane's Kitchen",
    description: "Authentic local cuisine with fresh ingredients sourced from local farmers. We're expanding our seating capacity and upgrading our kitchen equipment to serve more customers.",
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    requestedAmount: 5000,
    currentInvestment: 1250,
    paybackPercentage: 15,
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A',
    ownerWallet: 'fid:12345',
    isVerified: true,
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'tech-repair-shop',
    name: 'TechFix Pro',
    description: 'Professional electronics repair service specializing in smartphones, laptops, and tablets. Looking to expand our service offerings and hire additional technicians.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
    requestedAmount: 3000,
    currentInvestment: 750,
    paybackPercentage: 12,
    walletAddress: '0x8ba1f109551bD432803012645Hac136c30C67560',
    ownerWallet: 'fid:12346',
    isVerified: false,
    gallery: [
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'green-grocery',
    name: 'Green Valley Grocers',
    description: 'Organic grocery store committed to sustainable farming practices. We need funding to expand our refrigeration systems and stock more organic produce.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
    requestedAmount: 7500,
    currentInvestment: 2100,
    paybackPercentage: 18,
    walletAddress: '0x9C8ff314C9Bc7F6e59A9d9225Fb22946427eDC03',
    ownerWallet: 'fid:12347',
    isVerified: true,
    gallery: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'local-bakery',
    name: 'Sunrise Bakery',
    description: 'Family-owned bakery serving fresh bread, pastries, and custom cakes for over 10 years. We want to add a coffee bar and expand our catering services.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
    requestedAmount: 2500,
    currentInvestment: 800,
    paybackPercentage: 14,
    walletAddress: '0x1234567890123456789012345678901234567890',
    ownerWallet: 'fid:12348',
    isVerified: true,
    gallery: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'fitness-studio',
    name: 'FitLife Studio',
    description: 'Modern fitness studio offering personal training, group classes, and wellness coaching. Looking to purchase new equipment and expand class offerings.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    requestedAmount: 10000,
    currentInvestment: 3200,
    paybackPercentage: 20,
    walletAddress: '0x0987654321098765432109876543210987654321',
    ownerWallet: 'fid:12349',
    isVerified: false,
    gallery: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'the-book-nook',
    name: 'The Book Nook',
    description: 'A cozy independent bookstore for all ages. We want to host more community events and launch a local author spotlight program.',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=600&fit=crop',
    requestedAmount: 4000,
    currentInvestment: 1500,
    paybackPercentage: 16,
    walletAddress: '0x1111222233334444555566667777888899990000',
    ownerWallet: 'fid:12350',
    isVerified: true,
    gallery: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'artisanal-coffee-roasters',
    name: 'Artisanal Coffee Roasters',
    description: 'Small-batch coffee roastery sourcing single-origin beans. Seeking funds for a new, larger roaster to meet growing demand.',
    imageUrl: 'https://images.unsplash.com/photo-1511920183353-3c714b5742a1?w=800&h=600&fit=crop',
    requestedAmount: 6500,
    currentInvestment: 2200,
    paybackPercentage: 17,
    walletAddress: '0xAAAAABBBBBCCCCCDDDDDEEEEEFFFFFGGGGGHHHHH',
    ownerWallet: 'fid:12351',
    isVerified: true,
    gallery: [
      'https://images.unsplash.com/photo-1511920183353-3c714b5742a1?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'urban-garden-supply',
    name: 'Urban Garden Supply',
    description: 'Your one-stop shop for urban gardening needs. We want to add a workshop space for classes on container gardening and composting.',
    imageUrl: 'https://images.unsplash.com/photo-1585320811308-1748d05a04cb?w=800&h=600&fit=crop',
    requestedAmount: 3500,
    currentInvestment: 900,
    paybackPercentage: 13,
    walletAddress: '0xABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD',
    ownerWallet: 'fid:12352',
    isVerified: false,
    gallery: [
      'https://images.unsplash.com/photo-1585320811308-1748d05a04cb?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'handmade-pottery-studio',
    name: 'Clay Creations',
    description: 'A community pottery studio offering classes and selling handmade ceramics. We need to purchase a new kiln to increase our production capacity.',
    imageUrl: 'https://images.unsplash.com/photo-1565032153913-e674a3b53a4b?w=800&h=600&fit=crop',
    requestedAmount: 4800,
    currentInvestment: 1800,
    paybackPercentage: 19,
    walletAddress: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B',
    ownerWallet: 'fid:12353',
    isVerified: true,
    gallery: [
      'https://images.unsplash.com/photo-1565032153913-e674a3b53a4b?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'vintage-clothing-boutique',
    name: 'Retro Threads',
    description: 'Curated vintage and retro-style clothing. We want to expand our online store and improve our e-commerce photography setup.',
    imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop',
    requestedAmount: 2000,
    currentInvestment: 500,
    paybackPercentage: 11,
    walletAddress: '0xFEDCBA9876543210FEDCBA9876543210FEDCBA98',
    ownerWallet: 'fid:12354',
    isVerified: false,
    gallery: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'gourmet-pet-bakery',
    name: 'The Pawsitive Treat',
    description: 'Healthy, gourmet treats for dogs and cats, made with all-natural ingredients. We need funding for packaging and to expand our product line.',
    imageUrl: 'https://images.unsplash.com/photo-1559059699-085698eba08c?w=800&h=600&fit=crop',
    requestedAmount: 1500,
    currentInvestment: 600,
    paybackPercentage: 10,
    walletAddress: '0xABC123DEF456ABC123DEF456ABC123DEF456ABC1',
    ownerWallet: 'fid:12355',
    isVerified: true,
    gallery: [
      'https://images.unsplash.com/photo-1559059699-085698eba08c?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'mobile-bike-repair',
    name: 'Cycle-On-The-Go',
    description: 'A mobile bicycle repair service that comes to you. We need to upgrade our service van and stock more parts for on-the-spot repairs.',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop',
    requestedAmount: 5500,
    currentInvestment: 2000,
    paybackPercentage: 15,
    walletAddress: '0x123ABC456DEF789GHI012JKL345MNO678PQR901',
    ownerWallet: 'fid:12356',
    isVerified: true,
    gallery: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'local-honey-producer',
    name: 'Golden Bee Honey',
    description: 'Sustainably harvested, raw local honey. We want to increase our number of hives and create a dedicated processing facility.',
    imageUrl: 'https://images.unsplash.com/photo-1558349516-9b8678b4a6f7?w=800&h=600&fit=crop',
    requestedAmount: 3200,
    currentInvestment: 1100,
    paybackPercentage: 14,
    walletAddress: '0xBEBEBEBEBEBEBEBEBEBEBEBEBEBEBEBEBEBEBEBE',
    ownerWallet: 'fid:12357',
    isVerified: false,
    gallery: [
      'https://images.unsplash.com/photo-1558349516-9b8678b4a6f7?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'custom-woodworking',
    name: 'Oak & Anvil Woodworks',
    description: 'Handcrafted, custom furniture and home decor. We need to purchase a new lathe and other specialized tools to take on more complex projects.',
    imageUrl: 'https://images.unsplash.com/photo-1595609449399-9a8a7a1f0f2d?w=800&h=600&fit=crop',
    requestedAmount: 8000,
    currentInvestment: 3500,
    paybackPercentage: 22,
    walletAddress: '0x9876543210ABCDEF9876543210ABCDEF98765432',
    ownerWallet: 'fid:12358',
    isVerified: true,
    gallery: [
      'https://images.unsplash.com/photo-1595609449399-9a8a7a1f0f2d?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'language-tutoring-center',
    name: 'LinguaConnect',
    description: 'A language learning center for all ages. We want to develop an online learning platform to complement our in-person classes.',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c28e7481?w=800&h=600&fit=crop',
    requestedAmount: 4500,
    currentInvestment: 1300,
    paybackPercentage: 16,
    walletAddress: '0xCAFED00DBEEFCAFED00DBEEFCAFED00DBEEFCAFE',
    ownerWallet: 'fid:12359',
    isVerified: false,
    gallery: [
      'https://images.unsplash.com/photo-1521791136064-7986c28e7481?w=400&h=300&fit=crop'
    ],
    verificationImages: [],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  }
];

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');
  
  try {
    const batch = db.batch();
    
    // Add businesses
    sampleBusinesses.forEach((business) => {
      const docRef = db.collection('businesses').doc(business.id);
      batch.set(docRef, business);
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log('✅ Database seeded successfully!');
    console.log(`📊 Added ${sampleBusinesses.length} sample businesses`);
    
    // Print summary
    console.log('\n📋 Sample Businesses Added:');
    sampleBusinesses.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name} - $${business.requestedAmount.toLocaleString()} goal`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log('\n🎉 Database seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });