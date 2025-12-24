export type MessageRole = "user" | "assistant";
export enum RolesEnum {
  USER = "user",
  ASSISTANT = "assistant",
}
export interface Message {
  _id?: string;
  role: MessageRole;
  content: string;
  timestamp?: string;
  releveantChunks?: number[];
}

export type Messages = Message[];
