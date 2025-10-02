// Core application types for Jarvis Leads
export type Screen = 'landing' | 'leadgen';

export type Theme = 'light' | 'dark';

// Lead Generation Form types
export interface LeadFormData {
  step: number;
  company?: string;
  industry?: string;
  targetAudience?: string;
  budget?: string;
  goals?: string;
  timeline?: string;
  contacts?: string;
  name?: string;
  phone?: string;
  email?: string;
  additionalInfo?: string;
}

// Application Settings
export interface AppSettings {
  theme: Theme;
  language: 'ru' | 'en';
  showOfferPopup: boolean;
  offerDismissed: boolean;
}

// Application State
export interface AppState {
  currentScreen: Screen;
  settings: AppSettings;
  loading: boolean;
  error?: string;
  leadFormData: LeadFormData;
}

// Events and Actions
export type AppEvent = 
  | { type: 'NAVIGATE_TO_SCREEN'; screen: Screen }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'UPDATE_LEAD_FORM'; data: Partial<LeadFormData> }
  | { type: 'RESET_LEAD_FORM' }
  | { type: 'SUBMIT_LEAD_FORM'; data: LeadFormData };