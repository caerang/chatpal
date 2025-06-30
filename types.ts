
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  correction?: string | null;
  originalText?: string | null; // User's original text for the "Share a Tip" feature
  timestamp: Date;
}
