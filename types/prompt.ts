// types/prompt.ts
export interface Prompt {
  id: number;
  text: string;
  fileName: string | null;
  timestamp: string;
}

export interface Folder {
  id: string;
  name: string;
  isDefault?: boolean;
  createdAt: string;
  prompts: Prompt[];
}

export interface PromptWithFolder extends Prompt {
  folderId: string;
  folderName: string;
}

export interface ExportData {
  version: string;
  folders: Folder[];
  exportDate: string;
}