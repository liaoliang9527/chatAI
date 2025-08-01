// oxlint-disable
export interface FileType {
  created_at: string;
  created_by: string;
  extension: string;
  id: string;
  mime_type: string;
  name: string;
  size: string;
  fileType?: string;
}
export interface MenuItem {
  id: string;
  name: string;
  showText?: boolean = true;
  index?: number | string;
}
export interface ChatMessage {
  avatar: string;
  name: string;
  role: string;
  content: string;
  reasoning?: string; // 逻辑推理
  conversation_id?: string;
  conversationId?: string;
  datetime?: string;
}

export interface UserInfo {
  fullName: string;
}
