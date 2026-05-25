export interface Note {
  id: number;
  title: string;
  description: string;
  drawingData?: string | null; // Optional and can be null from the backend
  createdDate?: string;
  updatedDate?: string;
  color?: string;
  pinned?: boolean;
  tags?: string[];
}

export interface PageSummary {
  id: number;
  title: string;
  pageOrder: number;
}

export interface Notebook{
  id:number;
  name: string;
  description: string;
  color: string;
  pages: PageSummary[];
}

export interface PageDetail{
  id: number;
  title: string;
  content: string;
  notebookId: number;
}

export type BlockType = 'text' | 'image' | 'drawing' | 'code';

export interface Block{
  id: string;
  type: BlockType;
  content: string;
  language?: string;
  width?: number;
}