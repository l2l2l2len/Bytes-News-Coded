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

/**
 * Fetches real-time news using Google Search Grounding.
 * Note: schema extraction is manual because googleSearch tool doesn't support responseSchema in the same request effectively for this specific payload structure in 2.5 flash.
 */
export const fetchRealTimeNews = async (topics: string[]): Promise<Byte[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found for live news");
    return [];
  }

  const topicString = topics.length > 0 ? topics.join(', ') : 'Global Breaking News';
  
  // Prompt optimized for maximum quantity (High Token Density)
  // We ask for 2000, but realistically the model will output as many as it can within token limits (approx 50-100 per call).
  const prompt = `
    Find as many real-time breaking news stories as possible (target 2000) regarding: ${topicString}.
    
    CRITICAL: List strictly valid JSON objects. No markdown.
    Fields:
    - "title": Headline (<10 words).
    - "publisher": Source name.
    - "abstract": Summary (20-30 words).
    - "category": Topic (e.g. World, Tech).
    - "sourceUrl": Link.
    
    Output strictly a JSON array. If you run out of tokens, close the array validly.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // We do not set maxOutputTokens here to let the model use its default maximum (usually 8k for Flash).
      },
    });

    let text = response.text || "";
    // Clean markdown if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Attempt to repair truncated JSON
    if (text.startsWith('[') && !text.endsWith(']')) {
       const lastClosingBrace = text.lastIndexOf('}');
       if (lastClosingBrace !== -1) {
          text = text.substring(0, lastClosingBrace + 1) + ']';
       }
    }

    const rawData = JSON.parse(text);
    
    if (!Array.isArray(rawData)) return [];

    // Map to Byte structure
    return rawData.map((item: any, index: number) => {
      const cat = item.category || "World";
      return {
        id: `live-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID for aggressive merging
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

  } catch (e) {
    console.error("Failed to fetch live news for topics:", topics, e);
    return [];
  }
};