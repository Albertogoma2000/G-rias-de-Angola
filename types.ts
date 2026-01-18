export type Category = 'Rua' | 'Juventude' | 'Música' | 'Humor' | 'Cotidiano' | 'Internet' | 'Família' | 'Todas';

export interface SlangItem {
  id: string;
  term: string;
  definition: string;
  example: string;
  category: Category;
  origin?: string; // Province or Region
  synonyms?: string[];
}

export interface UserProfile {
  isPremium: boolean;
  trialStartDate: string; // ISO Date string
  favorites: string[]; // List of Slang IDs
}

export enum ViewState {
  HOME = 'HOME',
  DICTIONARY = 'DICTIONARY',
  TRANSLATOR = 'TRANSLATOR', // AI Feature
  PREMIUM = 'PREMIUM',
  PROFILE = 'PROFILE'
}