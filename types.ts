
import React from 'react';

/**
 * Byte interface representing a high-signal news item.
 */
export interface Byte {
  id: string;
  title: string;
  publisher: string;
  authors: string[];
  abstract: string;
  abstractPreview?: string; 
  whyMatters?: string;       
  publicationDate: string;
  category: string;
  readTime: string;
  fileUrl: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
  sourceUrl?: string;
  doi?: string;
}

export type Paper = Byte;

export interface JournalArticle {
  id: string;
  title: string;
  content: string;
  date: string;
  category?: string;
}

export interface UserPreferences {
  userName?: string;
  topics: string[];
  readingStyle: 'Ultra quick' | 'Brief summaries' | 'Deep dives';
  tone: 'Straight facts' | 'More explanation' | 'Context & opinion';
  constraints: {
    noClickbait: boolean;
    fewerCelebrity: boolean;
    expertSources: boolean;
    safeMode: boolean;
  };
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'settings' }
  | { type: 'library' }
  | { type: 'search' };
