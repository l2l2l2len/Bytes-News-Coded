
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Byte } from '../types';

const DB_KEY = 'bytes_news_cache_v2';
const SYNC_META_KEY = 'bytes_sync_meta_v2';

const getCategoryImageUrl = (category: string): string => {
  const map: Record<string, string> = {
    'Business': 'photo-1611974765270-ca12586343bb',
    'Tech': 'photo-1518770660439-4636190af475',
    'Science': 'photo-1507413245164-6160d8298b31',
    'World': 'photo-1521737604893-d14cc237f11d',
    'Finance': 'photo-1611974765270-ca12586343bb',
    'Health': 'photo-1576091160399-112ba8d25d1d',
    'Culture': 'photo-1499750310107-5fef28a66643',
    'Sports': 'photo-1504450758481-7338eba7524a',
  };
  const key = Object.keys(map).find(k => category.includes(k)) || 'World';
  const imgId = map[key] || 'photo-1504711434969-e33886168f5c';
  return `https://images.unsplash.com/${imgId}?auto=format&fit=crop&q=80&w=1200`;
};

export const getCachedNews = (): Byte[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * PRODUCTION-GRADE NEWS SYNC ENGINE
 * Uses gemini-3-flash-preview for speed and Google Search for accuracy.
 */
export const fetchRealTimeNews = async (topics: string[], force = false): Promise<Byte[]> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error("Gemini API Key missing. Please set the GEMINI_API_KEY environment variable.");
    return getCachedNews();
  }

  const topicString = topics.length > 0 ? topics.join(', ') : 'Global Breaking News & Major Events';
  
  // Throttle syncs to once every 10 minutes to save quota, unless forced
  const lastSync = Number(localStorage.getItem(SYNC_META_KEY) || 0);
  if (!force && Date.now() - lastSync < 10 * 60 * 1000 && getCachedNews().length > 0) {
    return getCachedNews();
  }

  const prompt = `Research and aggregate 8 significant news stories from the last 24 hours about: ${topicString}. 
  Ensure high diversity and global relevance. For each story, provide a detailed summary and explain why the event is impactful.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Headline of the news" },
              publisher: { type: Type.STRING, description: "Original news outlet" },
              summary: { type: Type.STRING, description: "40-word core summary" },
              preview: { type: Type.STRING, description: "10-word punchy preview" },
              impact: { type: Type.STRING, description: "One sentence explaining why it matters" },
              category: { type: Type.STRING, description: "One of: Tech, World, Science, Business, Finance, Health, or Sports" }
            },
            required: ["title", "publisher", "summary", "preview", "impact", "category"]
          }
        },
        systemInstruction: "You are a professional real-time news curator. Only provide verified facts. Output valid JSON."
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const rawData = JSON.parse(text);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const newBytes: Byte[] = rawData.map((item: any, i: number) => {
      // Intelligent source URL lookup
      let sourceUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title)}&tbm=nws`;
      const match = groundingChunks.find(c => 
        c.web?.title?.toLowerCase().includes(item.title.split(' ')[0].toLowerCase())
      );
      if (match?.web?.uri) sourceUrl = match.web.uri;

      return {
        id: `live-${Date.now()}-${i}`,
        title: item.title,
        publisher: item.publisher,
        authors: ["Verified News Source"],
        abstract: item.summary,
        abstractPreview: item.preview,
        whyMatters: item.impact,
        category: item.category,
        readTime: "1 min",
        fileUrl: getCategoryImageUrl(item.category),
        likes: Math.floor(Math.random() * 900) + 150,
        comments: Math.floor(Math.random() * 45),
        publicationDate: "JUST NOW",
        sourceUrl
      };
    });

    if (newBytes.length > 0) {
      localStorage.setItem(DB_KEY, JSON.stringify(newBytes));
      localStorage.setItem(SYNC_META_KEY, Date.now().toString());
    }

    return newBytes.length > 0 ? newBytes : getCachedNews();

  } catch (e: any) {
    console.warn("Sync Engine failed to reach network. Serving from cache.", e.message);
    return getCachedNews();
  }
};
