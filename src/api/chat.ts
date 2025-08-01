import http from "../util/request";
import type {
  SendCode,
  LoginParams,
  ChatAIQuery,
  MessageType,
  ConversationsType,
} from "./api";

// AI对话
export const queryAIChat = (params: ChatAIQuery) => {
  return http.fetch(
    `/intelligent-marketing-api/chat_messages/ai_chat/get`,
    params
  );
};
// 获取消息列表
export const getMessagesList = (params: MessageType) => {
  return http.get(
    `/intelligent-marketing-api/chat_messages/messages/get`,
    params
  );
};

// 获取会话列表
export const getConversations = (params: ConversationsType) => {
  return http.get(
    `/intelligent-marketing-api/chat_messages/conversations/get`,
    params
  );
};

// 上传文件
export const uploadContractFile = (formData: FormData) => {
  return http.post<string>(
    `/intelligent-marketing-api/chat_messages/files/upload/add`,
    formData
  );
};

// 删除指定会话
export const deleteConversation = (params: ConversationsType) => {
  return http.delete(
    `/intelligent-marketing-api/chat_messages/conversations/delete`,
    params
  );
};

//停止对话
export const stopChat = (conversationId: string) => {
  return http.post(
    `/intelligent-marketing-api/chat_messages/stop/${conversationId}/edit`
  );
};

//编辑会话名称
export const editConversation = (params: ConversationsType) => {
  return http.post(
    `/intelligent-marketing-api/chat_messages/conversations/name/edit`,
    params
  );
};
//下载pdf
export const downloadPdf = (params: ConversationsType) => {
  return http.download(
    `/intelligent-marketing-api/chat_messages/conversation/to/pdf/get`,
    params
  );
};
/**
 * 发送验证码
 */
export const sendSmsCode = (params: SendCode) => {
  return http.get(`/intelligent-marketing-api/chat_messages/send/get`, params);
};

/**
 * 登录
 */
export const loginByPhone = (params: LoginParams) => {
  return http.post(
    `/intelligent-marketing-api/chat_messages/by_phone/get`,
    params
  );
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return http.get(`/intelligent-marketing-api/common/login_info/get`);
};
