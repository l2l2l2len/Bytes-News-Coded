
import { Byte } from './types';

export const BRAND_NAME = 'Bytes';

export const DEFAULT_CATEGORIES = [
  { label: 'US News', icon: '🇺🇸' },
  { label: 'World', icon: '🌍' },
  { label: 'Business', icon: '💼' },
  { label: 'Technology', icon: '💻' },
  { label: 'Science', icon: '🧬' },
  { label: 'Health', icon: '🏥' },
  { label: 'Sports', icon: '⚽' },
  { label: 'Entertainment', icon: '🎬' },
  { label: 'Crypto', icon: '₿' },
];

export const PAPERS: Byte[] = [
  {
    id: "byte-001",
    title: "Musk would almost be an instant trillionaire from giant SpaceX IPO",
    publisher: "Bytes World",
    authors: ["Editorial Team"],
    abstract: "Elon Musk's fortune could soar to $952B if SpaceX goes public at a $1.5T valuation next year, more than doubling his current $460B wealth. His stake alone would jump from $136B to over $625B, rivaling the scale of Saudi Aramco's historic IPO. SpaceX is already exploring employee share sales at an $800B valuation, while Musk's xAI has hit $200B—another path toward becoming the world's first trillionaire.",
    publicationDate: "DEC 10",
    category: "Business",
    readTime: "1 min read",
    fileUrl: "https://images.unsplash.com/photo-1541873676946-840999ca402b?auto=format&fit=crop&q=80&w=1200",
    likes: 1300,
    comments: 42,
    sourceUrl: "https://www.bloomberg.com"
  },
  {
    id: "byte-002",
    title: "The Sovereign Fund Shift: Geopolitics as an Asset Class",
    publisher: "Markets Deep",
    authors: ["Julian Thorne"],
    abstract: "Sovereign wealth funds are increasingly pivoting away from passive indexing toward direct equity stakes in critical minerals and defense tech. This 'Strategic Alpha' is redefining risk profiles for 2026 as funds seek to secure national interests alongside financial returns. The shift is most visible in the Gulf and East Asian funds aggressively targeting semiconductor supply chains.",
    publicationDate: "DEC 11",
    category: "Finance",
    readTime: "3 min read",
    fileUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    likes: 640,
    comments: 8,
    sourceUrl: "https://www.ft.com"
  },
  {
    id: "byte-003",
    title: "Silicon Photonics: The next frontier in AI compute infrastructure",
    publisher: "Tech Brief",
    authors: ["Maya Chen"],
    abstract: "As traditional copper-based interconnects reach their physical bandwidth limits, the AI industry is pivoting towards silicon photonics. This technology uses light rather than electricity to transmit data between chips, promising a 10x increase in bandwidth density while reducing power consumption by 40%. Companies like NVIDIA and Broadcom are already integrating optical I/O.",
    publicationDate: "DEC 12",
    category: "AI & Tech",
    readTime: "2 min read",
    fileUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    likes: 850,
    comments: 12,
    sourceUrl: "https://www.theverge.com"
  },
  {
    id: "byte-004",
    title: "Apple Vision Pro 2: Massive weight reduction planned for 2025",
    publisher: "Gadget Labs",
    authors: ["Leo Varadkar"],
    abstract: "Leaks from Apple's supply chain suggest the next iteration of Vision Pro will focus almost exclusively on ergonomics. By moving more processing units to an external puck and using magnesium-alloy frames, weight is expected to drop by 30%, addressing the primary criticism of the first generation.",
    publicationDate: "DEC 13",
    category: "AI & Tech",
    readTime: "2 min read",
    fileUrl: "https://images.unsplash.com/photo-1707306355610-664878a87b37?auto=format&fit=crop&q=80&w=1200",
    likes: 2100,
    comments: 156,
    sourceUrl: "https://www.apple.com"
  },
  {
    id: "byte-005",
    title: "The Zero-Click Economy: AI's Search War on Publishers",
    publisher: "Digital Pulse",
    authors: ["Samira Khan"],
    abstract: "Generative search is keeping users on-page, starving the link-out economy that sustains the modern web. Google and OpenAI are fundamentally altering search traffic. As answers are synthesized in real-time, click-through rates to original sources have plummeted by 60% in early testing cohorts.",
    publicationDate: "DEC 14",
    category: "World",
    readTime: "2 min read",
    fileUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    likes: 933,
    comments: 21,
    sourceUrl: "https://www.wired.com"
  },
  {
    id: "byte-006",
    title: "India Overtakes China in iPhone Production Volume",
    publisher: "Global Trade",
    authors: ["Rajiv Menon"],
    abstract: "For the first time in history, India's iPhone assembly lines have surpassed the output of traditional hubs in Zhengzhou. This massive shift in the global supply chain highlights the growing 'China Plus One' strategy adopted by major tech conglomerates seeking to diversify manufacturing risk amid rising geopolitical tensions.",
    publicationDate: "DEC 15",
    category: "Business",
    readTime: "3 min read",
    fileUrl: "https://images.unsplash.com/photo-1512428559083-560dfc18b9c5?auto=format&fit=crop&q=80&w=1200",
    likes: 3400,
    comments: 88,
    sourceUrl: "https://www.reuters.com"
  },
  {
    id: "byte-007",
    title: "Modular Fusion: The Zero-Carbon High-Uptime Horizon",
    publisher: "Science Wire",
    authors: ["Liam Sterling"],
    abstract: "Breakthroughs in HTS (High-Temperature Superconducting) magnets allow for reactor designs 1/4th the size of previous prototypes. Compact tokamaks are proving more efficient than the massive ITER-style designs, aiming for grid integration by the late 2020s.",
    publicationDate: "DEC 16",
    category: "Science",
    readTime: "4 min read",
    fileUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    likes: 1205,
    comments: 54,
    sourceUrl: "https://www.nature.com"
  },
  {
    id: "byte-008",
    title: "The Rise of 'Deep Work' Retreats in Remote Tech",
    publisher: "Culture Today",
    authors: ["Emma Thorne"],
    abstract: "As digital fatigue reaches an all-time high, tech workers are flocking to offline-only coworking spaces. These 'monk-mode' retreats strictly prohibit smartphones and prioritize long-form concentration, signaling a backlash against the notification-driven culture of modern remote work.",
    publicationDate: "DEC 17",
    category: "Culture",
    readTime: "2 min read",
    fileUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200",
    likes: 770,
    comments: 14,
    sourceUrl: "https://www.newyorker.com"
  }
];
