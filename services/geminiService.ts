
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
    return [
        {
            id: `fallback-${Date.now()}`,
            title: `Latest on ${topicString.split(',')[0]}`,
            publisher: "Volv Wire",
            authors: ["AI Curator"],
            abstract: "We are currently syncing with global sources. Live updates for this topic will resume shortly.",
            category: "World",
            readTime: "1 min",
            fileUrl: getCategoryImageUrl("World"),
            likes: 150,
            comments: 5,
            publicationDate: "Now",
            isLiked: false,
            isSaved: false,
            sourceUrl: `https://news.google.com/search?q=${encodeURIComponent(topicString)}`
        }
    ];
};

/**
 * Intelligent Deep-Link Matcher
 * Analyzes search results to find the specific article URL that matches the generated headline.
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

        // 1. Semantic Title Match (Headline words present in Source Title)
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

        // 3. Deep Link Structural Validation
        try {
            const url = new URL(chunk.web.uri);
            const path = url.pathname;
            // Reward paths that look like articles (e.g. /2024/05/title, /article/123)
            // Penalize root paths (e.g. /, /index.html)
            if (path.length > 1 && path.split('/').length > 2) {
                score += 30;
            }
            if (path === '/' || path === '' || path === '/index.html') {
                score -= 100;
            }
        } catch {
            score -= 50;
        }

        return { uri: chunk.web.uri, score };
    })
    .sort((a, b) => b.score - a.score);

  // Return the highest scoring result if it's a decent match
  return scoredResults[0] && scoredResults[0].score > 40 ? scoredResults[0].uri : null;
};

export const fetchRealTimeNews = async (topics: string[]): Promise<Byte[]> => {
  if (!process.env.API_KEY) return [];

  const topicString = topics.length > 0 ? topics.join(', ') : 'Global Breaking News';
  
  // Prompt optimized for extraction and precision
  const prompt = `
    Use Google Search to find 4 recent, specific breaking news stories about: ${topicString}.
    
    For each story, you MUST identify the direct article URL.
    RULES:
    1. The URL must be a "Deep Link" (e.g. site.com/article-title), NOT a homepage (site.com).
    2. If a specific link isn't found, skip that story.
    
    Output strictly as a JSON array:
    [
      {
        "title": "Exact headline",
        "publisher": "Source Name",
        "abstract": "Concise summary (max 30 words)",
        "category": "Topic",
        "sourceUrl": "The deep link found in search"
      }
    ]
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

    if (!Array.isArray(rawData)) return generateFallbackNews(topicString);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return rawData.map((item: any) => {
      const cat = item.category || "World";
      
      // 1. First, try to find a verified deep link from the actual search metadata
      let finalUrl = findBestVerifiedLink(item.title, item.publisher, groundingChunks);
      
      // 2. If no verified link found, check if the model provided a valid deep link manually
      if (!finalUrl && item.sourceUrl) {
          try {
              const u = new URL(item.sourceUrl);
              const path = u.pathname.replace(/\/$/, "");
              // Only accept if it looks like a deep link
              if (path.length > 5 && !path.includes('home')) {
                  finalUrl = item.sourceUrl;
              }
          } catch {}
      }

      // 3. Fallback: Create a specific Google News search link
      // This is better than a broken link or a generic homepage
      if (!finalUrl) {
          finalUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title)}&tbm=nws`;
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
