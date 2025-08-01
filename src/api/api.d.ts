export interface SendCode {
  /**
   * 手机号
   */
  phone: string;
  /**
   * 类型 1:注册 2:登录 3:编辑
   */
  type: number;
}

export interface LoginParams {
  /**
   * 手机号
   */
  phone: string;
  /**
   * 验证码
   */
  code: string;
}

export interface FileDetail {
  // type (string) 支持类型：图片 image（目前仅支持图片格式） 。
  // transfer_method (string) 传递方式:
  // remote_url: 图片地址。
  // local_file: 上传文件。
  // url 图片地址。（仅当传递方式为 remote_url 时）。
  // upload_file_id 上传文件 ID。（仅当传递方式为 local_file 时）。
  type?: string;
  transfer_method: string = "remote_url" | "local_file";
  url?: string;
  upload_file_id?: string;
}
export interface ChatAIQuery {
  query: string;
  // 会话id
  conversationId?: string;
  files?: File<FileDetail>[];
}

export interface MessageType {
  conversationId: string;
  limit?: number;
}
export interface ConversationsType {
  conversationId?: string;
  name?: string;
  limit?: number;
}
export interface FileType {
  file: File;
}
