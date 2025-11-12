export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface FormData {
  searchQuery: string;
  location: string;
  category: string;
  leadCount: number;
}

// FIX: Add Lead interface to define the shape of lead data. This resolves type errors in multiple components.
export interface Lead {
  name: string;
  place: string;
  no: string;
  contact: string;
  website_link: string;
  opening_time: string;
  rating: number;
  best_thing: string;
}

// FIX: Add GenerateLeadsOptions interface for the geminiService `generateLeads` function parameters.
export interface GenerateLeadsOptions {
  searchQuery: string;
  location: string;
  category: string;
  leadCount: number;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}
