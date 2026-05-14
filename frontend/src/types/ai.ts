export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export interface ChatResponse {
  data: string;
}

export interface ChatHistoryResponse {
  data: ChatMessage[];
}
