export enum ProposalCategory {
  Environment = 'Environnement',
  Culture = 'Culture & Patrimoine',
  Infrastructure = 'Infrastructure',
  Education = 'Éducation',
  Sports = 'Sports & Loisirs',
  Other = 'Autre'
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  votes: number;
  category: ProposalCategory;
  aiAnalysis?: AIAnalysis;
}

export interface AIAnalysis {
  impact: string;
  feasibility: string; // 'High', 'Medium', 'Low'
  estimatedCost: string; // e.g. "€€"
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export interface ForumReply {
  id: string;
  author: string;
  content: string;
  date: string;
  isModerated?: boolean;
}

export interface ForumTopic {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  replies: ForumReply[];
  views: number;
}

export type ViewState = 'home' | 'proposals' | 'events' | 'forum';