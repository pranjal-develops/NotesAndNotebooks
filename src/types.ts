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
  drawing?: boolean;
}

export interface PageSummary {
  id: number;
  title: string;
  pageOrder: number;
}

export interface Notebook {
  id: number;
  name: string;
  description: string;
  color: string;
  logo?: string;
  pages: PageSummary[];
}

export interface PageDetail {
  id: number;
  title: string;
  contentHtml: string;
  notebook_id: number;
  drawings?: string[];
  codeBlocks?: { language: string; code: string }[];
}

export type BlockType = 'text' | 'image' | 'drawing' | 'code' | 'chart';

export interface Block {
  id: string;
  type: BlockType;
  content: any; // Can be HTML string, code, or chart data
  metadata?: {
    language?: string;
    width?: number;
    config?: any; // For chart configurations
  };
}

export interface PageDTO {
  id?: number;
  title?: string;
  contentHtml?: string;
  drawings?: string[];
  charts?: any[];
  codeBlocks?: { language: string; code: string }[];
  images?: string[];
  pageOrder?: number;
  createdDate?: string;
  updatedDate?: string;
  notebook_id?: number;
}

// export interface HomeContext {
// notes: Note[],
// loading: boolean,
// setEditingnote: React.Dispatch<React.SetStateAction<note | null>>;
// }

export interface DrawingDto {
  id: number,
  createdDate?: string;
  updatedDate?: string;
  drawingData?: string;
  color?: string;
  pinned?: boolean;
  tags?: string[];
  drawing?: boolean;
}


export interface User {
  id: number;
  username: string;
  pfp: string | null;
}