# Bytes - Intelligent News, Distilled

**Experience clarity in 9 seconds.** Bytes is an AI-powered news curation app that delivers personalized, bite-sized news summaries without requiring any login or account.

## Features

- **No Login Required** - Start reading immediately without creating an account
- **AI-Powered Curation** - Uses Google Gemini AI to find and summarize relevant news
- **Personalized Feed** - Choose your interests and get tailored content
- **Privacy-First** - All preferences stored locally in your browser
- **Beautiful UI** - Immersive full-screen news cards with smooth scrolling
- **Completely Free** - No premium tiers or hidden features

## Quick Start

### Prerequisites
- Node.js 18+
- Google Gemini API key (optional, works with fallback content)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/l2l2l2len/Bytes-News-Coded.git
   cd Bytes-News-Coded
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up your Gemini API key:
   Create a `.env.local` file in the root directory:
   ```
   API_KEY=your_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

This project is optimized for Vercel deployment:

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Set environment variable `API_KEY` to your Gemini API key
4. Deploy!

Or use the Vercel CLI:
```bash
npm install -g vercel
vercel
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Storage**: Browser localStorage

## Project Structure

```
├── App.tsx              # Main application with routing
├── components/
│   ├── About.tsx        # About page
│   ├── Privacy.tsx      # Privacy policy
│   ├── Terms.tsx        # Terms of service
│   ├── HowItWorks.tsx   # How it works guide
│   ├── Navbar.tsx       # Navigation bar
│   ├── NewsSlide.tsx    # News card component
│   ├── Onboarding.tsx   # Onboarding flow
│   ├── CurateDrawer.tsx # Settings drawer
│   └── InteractiveBackground.tsx
├── services/
│   └── geminiService.ts # AI news fetching
├── types.ts             # TypeScript interfaces
├── constants.ts         # Static data and categories
└── index.html           # Entry point with SEO
```

## Local Data Storage

Bytes stores the following in your browser's localStorage:
- `bytes_prefs`: User preferences (name, topics, reading style)
- `bytes_likes`: Liked articles
- `bytes_saves`: Saved articles

To clear your data, use the "Reset My Interests" option in the app or clear your browser data.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | Google Gemini API key | No (falls back to static content) |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

Apache-2.0
