import type { Business } from '@shared/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  businesses?: Business[];
  timestamp: number;
}
