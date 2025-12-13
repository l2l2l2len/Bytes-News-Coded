/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { GoogleGenAI } from "@google/genai";
import { PAPERS } from '../constants';

const getSystemInstruction = () => {
  const paperContext = PAPERS.map(p => 
    // Fixed: Accessing 'p.abstract' as 'abstractPreview' is not defined on the Byte interface.
    `- "${p.title}" (${p.publicationDate}). Section: ${p.category}. Lead: ${p.abstract}`
  ).join('\n');

  return `You are the Social Impact Editor for "The Philanthropy Times", a prestigious platform for humanitarian and nonprofit news. 
  Your tone is empathetic, knowledgeable, and solutions-oriented (like Stanford Social Innovation Review, The Chronicle of Philanthropy, or Devex).
  
  Here is our current content wire:
  ${paperContext}
  
  Answer user questions about these stories, global development trends, impact investing, or charitable strategies.
  If asked about topics not in the wire, provide general philanthropic expertise with a focus on effectiveness and ethical aid.
  Keep answers brief (under 3-4 sentences) and professional.`;
};

// Use export to expose functionality
export const sendMessageToGemini = async (history: {role: string, text: string}[], newMessage: string): Promise<string> => {
  try {
    // API key check. Direct access of process.env.API_KEY is preferred.
    if (!process.env.API_KEY) {
      return "I cannot access the Impact Archives at this moment. (Missing API Key)";
    }

    // Always use initialization as requested: new GoogleGenAI({ apiKey: ... })
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Fixed: Calling ai.models.generateContent directly with model and contents as per guidelines.
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

    // Fixed: Directly accessing the .text property (not a method) from the response object.
    return response.text || "The editor's desk is unable to comment at this time.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our news feed is currently undergoing maintenance. Please check back later.";
  }
};