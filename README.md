# Swipevest 🚀

**Swipe. Invest. Earn.** - A Tinder-like investment platform for local businesses built for Farcaster.

## Features

- 📱 **Mobile-First Design** - Optimized for Farcaster's mobile viewing area
- 💳 **Swipe to Invest** - Intuitive swipe interface for discovering businesses
- 🏆 **Leaderboard** - Track top investors and earnings
- 📊 **Investment History** - View your portfolio and returns
- 🏢 **Business Dashboard** - Business owners can create and manage their profiles
- ✅ **Community Verification** - Users can verify businesses by uploading photos
- 💬 **Comments** - Discuss businesses with other investors
- 🔥 **Firebase Integration** - Real-time data with Firestore and Storage
- 🎯 **Farcaster Native** - Built with Farcaster SDK and APIs

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase (Firestore, Storage, Auth)
- **Animations**: Framer Motion
- **Social**: Farcaster SDK
- **Deployment**: Vercel (recommended)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo>
cd swipevest
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Storage
4. Get your Firebase config from Project Settings
5. Update `.env` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Farcaster Setup

1. Register your app at [developers.farcaster.xyz](https://developers.farcaster.xyz)
2. Add your Farcaster App ID to `.env`:

```env
NEXT_PUBLIC_FARCASTER_APP_ID=your_farcaster_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## Firebase Collections

The app uses these Firestore collections:

- **businesses** - Business profiles and investment details
- **investments** - Individual investment records
- **users** - User profiles and stats
- **comments** - Business comments and discussions

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Custom Domain

Update the domain in:
- `src/app/layout.tsx` (OpenGraph URL)
- Firebase Auth settings (authorized domains)
- Farcaster app settings

## Key Features Explained

### Swipe Interface
- Swipe right to invest $10 (configurable)
- Swipe left to pass
- Smooth animations with Framer Motion

### Business Verification
- Users can upload photos to verify businesses
- Photos are stored in Firebase Storage
- Verification images become part of business gallery

### Investment Tracking
- Real-time investment amounts
- Expected returns calculation
- Leaderboard based on total investments

### Mobile-First Design
- Curved edges and modern UI
- Optimized for Farcaster's mobile viewport
- Touch-friendly interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for your own projects!

---

Built with ❤️ for the Farcaster ecosystem