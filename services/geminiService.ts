
import { GoogleGenAI } from "@google/genai";
import { PAPERS } from '../constants';
import { Byte } from '../types';

const getCategoryImageUrl = (category: string): string => {
  const map: Record<string, string> = {
    'Business': 'photo-1611974765270-ca12586343bb',
    'Tech': 'photo-1518770660439-4636190af475',
    'Science': 'photo-1507413245164-6160d8298b31',
    'World': 'photo-1521737604893-d14cc237f11d',
    'Finance': 'photo-1611974765270-ca12586343bb',
    'Health': 'photo-1576091160399-112ba8d25d1d',
    'Culture': 'photo-1499750310107-5fef28a66643',
    'Politics': 'photo-1529101091760-61df6be5d187',
  };
  const key = Object.keys(map).find(k => category.includes(k)) || 'World';
  const imgId = map[key] || 'photo-1504711434969-e33886168f5c';
  return `https://images.unsplash.com/${imgId}?auto=format&fit=crop&q=80&w=1200`;
};

const generateFallbackNews = (topicString: string): Byte[] => {
    // Return a subset of high-quality static papers mixed with generated meta-stories
    return PAPERS.slice(0, 3).map((p, i) => ({
        ...p,
        id: `fallback-${Date.now()}-${i}`,
        title: i === 0 ? `Latest in ${topicString.split(',')[0]}` : p.title,
        publicationDate: "JUST NOW"
    }));
};

const findBestVerifiedLink = (headline: string, publisher: string, groundingChunks: any[]) => {
  if (!groundingChunks || groundingChunks.length === 0) return null;
  const hWords = headline.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  const scoredResults = groundingChunks
    .filter(chunk => chunk.web && chunk.web.uri)
    .map(chunk => {
        const cTitle = (chunk.web.title || "").toLowerCase();
        let matchCount = 0;
        hWords.forEach(w => { if (cTitle.includes(w)) matchCount++; });
        return { uri: chunk.web.uri, score: (matchCount / Math.max(1, hWords.length)) * 100 };
    })
    .sort((a, b) => b.score - a.score);
  return scoredResults[0] && scoredResults[0].score > 40 ? scoredResults[0].uri : null;
};

export const fetchRealTimeNews = async (topics: string[]): Promise<Byte[]> => {
  const topicString = topics.length > 0 ? topics.join(', ') : 'Breaking News';
  
  if (!process.env.API_KEY) return generateFallbackNews(topicString);

  const prompt = `Find 5 breaking news stories from the last 24 hours about: ${topicString}. Output strictly as valid JSON array: [{"title": "Headline", "publisher": "Source", "abstract": "Summary (30 words)", "category": "Topic"}]`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });

    let text = response.text || "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) text = jsonMatch[0];

    const rawData = JSON.parse(text);
    if (!Array.isArray(rawData) || rawData.length === 0) return generateFallbackNews(topicString);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return rawData.map((item: any, i: number) => {
      const cat = item.category || "World";
      let finalUrl = findBestVerifiedLink(item.title, item.publisher, groundingChunks);
      if (!finalUrl) finalUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title)}&tbm=nws`;

      return {
        id: `live-${Date.now()}-${i}`,
        title: item.title,
        publisher: item.publisher,
        authors: ["AI Curator"],
        abstract: item.abstract,
        category: cat,
        readTime: "1 min",
        fileUrl: getCategoryImageUrl(cat),
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 20),
        publicationDate: "NOW",
        sourceUrl: finalUrl
      } as Byte;
    });

  } catch (e) {
    console.warn("API Error (likely quota), using fallback.");
    return generateFallbackNews(topicString);
  }
};
