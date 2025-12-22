
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from "@google/genai";
import { PAPERS } from '../constants';
import { Byte } from '../types';

const getSystemInstruction = () => {
  const paperContext = PAPERS.map(p => 
    `- "${p.title}" (${p.publicationDate}). Section: ${p.category}. Lead: ${p.abstract}`
  ).join('\n');

  return `You are the Social Impact Editor for "The Philanthropy Times". 
  Your tone is empathetic, knowledgeable, and solutions-oriented.
  
  Here is our current content wire:
  ${paperContext}
  
  Answer user questions about these stories, global development trends, impact investing, or charitable strategies.`;
};

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

export const sendMessageToGemini = async (history: {role: string, text: string}[], newMessage: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) return "Missing API Key.";
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: newMessage }] }
      ],
      config: { systemInstruction: getSystemInstruction() }
    });
    return response.text || "No response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Service unavailable.";
  }
};

const generateFallbackNews = (topicString: string): Byte[] => {
    // Generate fallback content so the user NEVER sees an empty screen
    return [1, 2, 3].map(i => ({
        id: `fallback-${Date.now()}-${i}`,
        title: `Latest Updates: ${topicString.split(',')[0]}`,
        publisher: "Bytes Wire",
        authors: ["AI Curator"],
        abstract: "We are currently syncing with global sources to bring you the most accurate real-time coverage. Please verify connection.",
        category: "Breaking",
        readTime: "1 min",
        fileUrl: getCategoryImageUrl("World"),
        likes: 150 + i * 10,
        comments: 5,
        publicationDate: "Now",
        isLiked: false,
        isSaved: false,
        sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(topicString)}&tbm=nws`
    }));
};

/**
 * Intelligent Deep-Link Matcher
 */
const findBestVerifiedLink = (headline: string, publisher: string, groundingChunks: any[]) => {
  if (!groundingChunks || groundingChunks.length === 0) return null;

  const hNorm = headline.toLowerCase().replace(/[^\w\s]/g, '');
  const pNorm = publisher.toLowerCase().replace(/[^\w\s]/g, '');
  const hWords = hNorm.split(/\s+/).filter(w => w.length > 3);

  const scoredResults = groundingChunks
    .filter(chunk => chunk.web && chunk.web.uri)
    .map(chunk => {
        const cTitle = (chunk.web.title || "").toLowerCase();
        const cUri = chunk.web.uri.toLowerCase();
        let score = 0;

        // 1. Semantic Title Match
        let matchCount = 0;
        hWords.forEach(w => {
            if (cTitle.includes(w)) matchCount++;
        });
        if (hWords.length > 0) {
            score += (matchCount / hWords.length) * 100;
        }

        // 2. Publisher Identity Match
        if (cTitle.includes(pNorm) || cUri.includes(pNorm.replace(/\s+/g, ''))) {
            score += 40;
        }

        return { uri: chunk.web.uri, score };
    })
    .sort((a, b) => b.score - a.score);

  return scoredResults[0] && scoredResults[0].score > 50 ? scoredResults[0].uri : null;
};

export const fetchRealTimeNews = async (topics: string[]): Promise<Byte[]> => {
  const topicString = topics.length > 0 ? topics.join(', ') : 'Global Breaking News';
  
  // IMMEDIATE FALLBACK if no API key is present.
  // This ensures the app is functional (demo mode) even without configuration.
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Returning fallback data.");
    // Return a mix of static papers + generated fallbacks to simulate a full feed
    if (topics.includes('Breaking News')) {
         return PAPERS; 
    }
    return generateFallbackNews(topicString);
  }

  const prompt = `
    Find 6 distinct, high-impact breaking news stories related to: ${topicString}.
    Events must be from the last 24 hours.
    Output strictly as a valid JSON array:
    [{"title": "Headline", "publisher": "Source", "abstract": "Summary (max 30 words)", "category": "Topic"}]
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text || "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) text = jsonMatch[0];

    let rawData;
    try {
        rawData = JSON.parse(text);
    } catch (e) {
        return generateFallbackNews(topicString);
    }

    if (!Array.isArray(rawData) || rawData.length === 0) return generateFallbackNews(topicString);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return rawData.map((item: any) => {
      const cat = item.category || "World";
      let finalUrl = findBestVerifiedLink(item.title, item.publisher, groundingChunks);
      
      if (!finalUrl) {
          finalUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title + " " + item.publisher)}&tbm=nws`;
      }

      return {
        id: `live-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: item.title || "News Update",
        publisher: item.publisher || "Global Wire",
        authors: ["AI Curator"],
        abstract: item.abstract || "Full details available at the source.",
        category: cat,
        readTime: "1 min read",
        fileUrl: getCategoryImageUrl(cat),
        likes: Math.floor(Math.random() * 500 + 100),
        comments: Math.floor(Math.random() * 50),
        isLiked: false,
        isSaved: false,
        publicationDate: "JUST NOW",
        sourceUrl: finalUrl
      } as Byte;
    });

  } catch (e) {
    console.error("Gemini Fetch Error:", e);
    return generateFallbackNews(topicString);
  }
};
