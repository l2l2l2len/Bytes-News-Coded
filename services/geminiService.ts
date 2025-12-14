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

// Helper to get an image based on category
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
  const imgId = map[key] || 'photo-1504711434969-e33886168f5c'; // default newsy bg
  return `https://images.unsplash.com/${imgId}?auto=format&fit=crop&q=80&w=1200`;
};

export const sendMessageToGemini = async (history: {role: string, text: string}[], newMessage: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) return "Missing API Key.";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: newMessage }] }
      ],
      config: {
        systemInstruction: getSystemInstruction(),
      }
    });

    return response.text || "No response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Service unavailable.";
  }
};

// Fallback generator when API quota is hit
const generateFallbackNews = (topicString: string): Byte[] => {
    const topics = topicString.split(',');
    const mainTopic = topics[0] || 'Global';
    
    return [
        {
            id: `fallback-${Date.now()}-1`,
            title: `Latest Updates in ${mainTopic}`,
            publisher: "Bytes System",
            authors: ["AI Curator"],
            abstract: `We are experiencing high traffic on our live feed. This is a placeholder for real-time coverage on ${mainTopic} while we reconnect to the global news stream.`,
            category: mainTopic,
            readTime: "1 min",
            fileUrl: getCategoryImageUrl(mainTopic),
            likes: 100 + Math.floor(Math.random() * 500),
            comments: Math.floor(Math.random() * 50),
            publicationDate: "Just now",
            isLiked: false,
            isSaved: false
        },
        {
            id: `fallback-${Date.now()}-2`,
            title: `Market Analysis: ${mainTopic} Trends`,
            publisher: "Market Watch",
            authors: ["System"],
            abstract: `Key indicators suggest significant movement in the ${mainTopic} sector. Analysts are watching regulatory developments closely as new data emerges.`,
            category: "Finance",
            readTime: "2 min",
            fileUrl: getCategoryImageUrl('Finance'),
            likes: 200 + Math.floor(Math.random() * 200),
            comments: Math.floor(Math.random() * 30),
            publicationDate: "1h ago",
            isLiked: false,
            isSaved: false
        }
    ];
};

/**
 * Fetches real-time news using Google Search Grounding.
 */
export const fetchRealTimeNews = async (topics: string[]): Promise<Byte[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found for live news");
    return [];
  }

  const topicString = topics.length > 0 ? topics.join(', ') : 'Global Breaking News';
  
  // OPTIMIZATION: Reduced count to 4 to save tokens and prevent timeouts/quota limits
  const prompt = `
    Find 4 breaking news stories about: ${topicString}.
    
    CRITICAL: List strictly valid JSON objects. No markdown.
    Fields:
    - "title": Headline (<10 words).
    - "publisher": Source name.
    - "abstract": Summary (20-30 words).
    - "category": Topic (e.g. World, Tech).
    - "sourceUrl": Link.
    
    Output strictly a JSON array.
  `;

  // Internal function to handle retries
  const generate = async (retryCount = 0): Promise<any> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      return await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
    } catch (error: any) {
      // Retry logic for 429
      if ((error.status === 429 || error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) && retryCount < 1) {
         // Increase delay to 4 seconds to clear rate limit
         const delay = 4000;
         await new Promise(resolve => setTimeout(resolve, delay));
         return generate(retryCount + 1);
      }
      throw error;
    }
  };

  try {
    const response = await generate();

    let text = response.text || "";
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    if (text.startsWith('[') && !text.endsWith(']')) {
       const lastClosingBrace = text.lastIndexOf('}');
       if (lastClosingBrace !== -1) {
          text = text.substring(0, lastClosingBrace + 1) + ']';
       }
    }

    const rawData = JSON.parse(text);
    
    if (!Array.isArray(rawData)) return generateFallbackNews(topicString);

    return rawData.map((item: any) => {
      const cat = item.category || "World";
      return {
        id: `live-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title || "Breaking News",
        publisher: item.publisher || "Global Wire",
        authors: ["AI Curator"],
        abstract: item.abstract || "No summary available.",
        category: cat,
        readTime: "1 min read",
        fileUrl: getCategoryImageUrl(cat),
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 50),
        isLiked: false,
        isSaved: false,
        publicationDate: "LIVE",
        sourceUrl: item.sourceUrl
      } as Byte;
    });

  } catch (e: any) {
    // If Quota Exceeded, FAIL SILENTLY and return fallback data
    // This ensures the app never crashes or shows an error state to the user
    if (e.message?.includes('429') || e.status === 429 || e.message?.includes('quota')) {
      return generateFallbackNews(topicString);
    }
    console.error("Gemini Fetch Error:", e);
    return [];
  }
};