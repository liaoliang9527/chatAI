<template>
  <div class="main">
    <!-- <img class="expand pa" v-show="isExpand" src="@/assets/transaction_retract_icon.svg" alt="" @click="expand" /> -->
    <IndentLeftIcon v-show="isExpand" @click="expand" style="cursor: pointer;" class="expand pa" />
    <div class="seder-bar" ref="sederBar" v-show="!isExpand">
      <div class="logo" v-show="!isExpand">
        <div class="text" @click="goHome"> {{ BASE_TITLE }}</div>
        <IndentRightIcon @click="expand" class="expand " />
      </div>

      <div class="create-msg" @click="goHome" v-show="!isExpand">
        <img src="@/assets/conversation_left_icon.svg" alt="" />
        <div class="text">开启新对话</div>
      </div>
      <div class="menu">
        <div class="menu-item" :class="{ active: item.id === activeMenuId }" v-for="(item, index) in menuList"
          :key="item.id" @click="menuHandle(item)">
          <div v-if="item.showText" class="menu-item-title">{{ item.name }}</div>
          <t-input v-else v-model="chatName" clearable autofocus placeholder="请输入" @blur="inputBlur(item)"
            @keyup.enter="inputBlur(item)" ref="chatNameRef"></t-input>
          <t-popup placement="right" trigger="click" overlayClassName="box-item">
            <img src="@/assets/images/more_icon.png" width="16px" style="margin: 10px;" @click.stop></img>
            <!-- <EllipsisIcon @click.stop style="margin: 10px;" /> -->
            <template #content>
              <div class="popover-item" @click.stop="menuItemHandle('rename', item, index)">
                <Edit2Icon />
                <span>重命名</span>
              </div>
              <!-- <div class="popover-item" @click.stop="menuItemHandle('download', item, index)">
                <FilePdfIcon />
                <span>下载PDF</span>
              </div> -->
              <div class="popover-item" @click.stop="menuItemHandle('delete', item, index)">
                <!-- <img src="@/assets/images/delete_icon.png" width="16px" class="menu-item-submenu-item"></img> -->
                <DeleteIcon style="color: red" />
                <span>删除</span>
              </div>
            </template>
          </t-popup>
        </div>
      </div>
      <div class="login-status" v-show="!isExpand">
        <div class="left">
          <div class="login-status-avatar">
            <img src="@/assets/images/profilepicture_img.svg" alt="" />
          </div>
          <div class="login-status-name">{{ userInfo.fullName }}</div>
        </div>
        <div class="login-status-logout" @click="layoutVisible = true">
          <LogoutIcon />
        </div>
      </div>
    </div>
    <div class="chat-box" v-if="showChat">
      <t-chat ref="chatRef" :data="chatList" animation="skeleton" :text-loading="isStreamLoading" :clearHistory="false"
        @scroll="handleChatScroll" @clear="clearConfirm">
        <template #content="{ item }">
          <t-chat-content v-if="item.content.length > 0" :content="item.content" />
        </template>
        <template #actions="{ item, index }">
          <t-chat-action :content="item.content" :operation-btn="['copy']"
            @operation="(arg: any) => handleOperation(arg, item, index)" />
        </template>
        <template #footer>
          <!-- PDF -->
          <div class="pdf" v-if="isShowPdf">
            <img class="pdf-icon" src="@/assets/text_pdf_icon.svg" alt="" />
            <div class="pdf-title">商业IP内容智能体.pdf</div>
            <img class="pdf-download-icon" src="@/assets/text_download_icon.svg" alt="" @click="downloadPDFHandle" />
          </div>
          <!-- 附件列表 -->
          <div v-if="fileList.length > 0" class="file-list">
            <div v-for="(item, index) in fileList" :key="index" class="file-list-item">
              <div class="ds-icon" style="font-size: 32px; width: 32px; height: 32px">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21.4237 7H10.5763C8.04887 7 6 8.94521 6 11.3447V20.6544C6 23.054 8.04887 24.992 10.5763 24.992H21.4237C23.9511 24.992 26 23.054 26 20.6544V11.3447C26 8.94521 23.9511 7 21.4237 7Z"
                    fill="#9AD2EC"></path>
                  <path
                    d="M11.3448 14.2014C12.3922 14.2014 13.2413 13.3955 13.2413 12.4015C13.2413 11.4074 12.3922 10.6016 11.3448 10.6016C10.2974 10.6016 9.44824 11.4074 9.44824 12.4015C9.44824 13.3955 10.2974 14.2014 11.3448 14.2014Z"
                    fill="white"></path>
                  <path
                    d="M25.9989 15.4688L21.3278 19.2012C20.7752 19.6428 20.0993 19.9222 19.3825 20.0054C18.6656 20.0886 17.9387 19.972 17.2904 19.6699L13.5988 17.9489C13.0423 17.6896 12.4264 17.5663 11.8069 17.5902C11.1875 17.6141 10.5841 17.7845 10.0516 18.0859L6.00098 20.3788V20.6554C6.00089 21.226 6.11915 21.7909 6.34906 22.318C6.57896 22.8452 6.91598 23.3241 7.34087 23.7276C7.76576 24.131 8.27022 24.4511 8.82541 24.6694C9.38059 24.8878 9.97563 25.0002 10.5766 25.0002H21.4247C22.6381 24.998 23.8017 24.5419 24.6595 23.7271C25.5173 22.9123 25.991 21.8074 25.9989 20.6554V15.4688Z"
                    fill="#4579C7"></path>
                </svg>
              </div>
              <div class="file-list-item-right">
                <div class="file-list-item-name">{{ item.name }}</div>
                <div class="file-list-item-size">
                  {{ item.extension + getImageSize(Number(item.size)) }}
                </div>
              </div>
              <img src="@/assets/close_icon.svg" class="file-list-item-close" @click="removeFile(index)" />
            </div>
          </div>
          <t-chat-sender v-model="query" :textarea-props="{
            placeholder: '请输入，Enter键发送，Shift+Enter键换行',
          }" :loading="loading" @send="inputEnter" @stop="onStop">
            <!-- 自定义操作区域的内容，默认支持图片上传、附件上传和发送按钮 -->
            <template #suffix="{ renderPresets }">

              <t-popup placement="top" content="上传图片" show-arrow destroy-on-close>
                <img src="@/assets/images/add_file_icon.png" class="add-file-button" @click="handleAddFileClick"></img>
              </t-popup>

              <input ref="fileInput" accept="image/*" type="file" hidden @change="handleFileSelect" />
              <component :is="renderPresets([])" />
            </template>
          </t-chat-sender>
        </template>
      </t-chat>
      <t-button v-show="isShowToBottom" variant="text" class="bottomBtn" @click="backBottom">
        <div class="to-bottom">
          <ArrowDownIcon />
        </div>
      </t-button>
      <div class="loading" v-if="loadingMessage">
        <t-chat-loading animation="moving" />
      </div>
    </div>
    <div class="home" v-else>
      <home @sendMessage="sendMessage" @sendFile="sendFile" />
    </div>
  </div>
  <t-dialog v-model:visible="delVisible" top="15%" width="300px" style="padding: 20px;" theme="warning" header="确定删除对话？"
    body="删除后，聊天记录将不可恢复。" :close-btn="false" @confirm="delConversation">
  </t-dialog>
  <t-dialog v-model:visible="layoutVisible" top="15%" width="350px" style="padding: 20px;" theme="warning"
    header="确认退出登录？" body="退出登录不会丢失任何数据，你仍可以登录此账号。" :close-btn="false" @confirm="logout">
  </t-dialog>
</template>

<script setup lang="ts" name="ChatAI">
import { ref, onMounted, watch, reactive } from "vue";
import { ArrowDownIcon, DeleteIcon, Edit2Icon, IndentLeftIcon, IndentRightIcon, LogoutIcon } from "tdesign-icons-vue-next";
import { formatTime, getImageSize } from "../../util";
import {
  queryAIChat,
  getMessagesList, // 获取消息列表
  getConversations, // 获取对话列表
  uploadContractFile,
  deleteConversation,
  editConversation,
  stopChat,
  downloadPdf
} from "../../api/chat";

import UserIcon from "@/assets/images/avatar.jpg";
import ChatIcon from "@/assets/images/chat-avatar.png";


import { MessagePlugin } from 'tdesign-vue-next';
import home from "@/components/Home.vue";
import type { ChatAIQuery, MessageType } from "../../api/api.d";
import { useRouter, useRoute } from "vue-router";
import type { FileType, MenuItem, ChatMessage, UserInfo } from "./index.d";
const BASE_TITLE = ref<string>(import.meta.env.VITE_BASE_TITLE);
const chatNameRef = ref<HTMLInputElement[]>([]);
const query = ref<string>("");
const loading = ref<boolean>(false);
const loadingMessage = ref<boolean>(false);
const isStreamLoading = ref<boolean>(false);
const isExpand = ref<boolean>(false);
const delVisible = ref<boolean>(false);
const layoutVisible = ref<boolean>(false);
let currItem = reactive<MenuItem>({
  id: "",
  name: "",
  index: 0,
});
const chatName = ref<string>("");
const activeMenuId = ref<string>("");
let taskId: string = "";
let isFirst = false
const router = useRouter();
const route = useRoute();
const isShowPdf = ref<boolean>(false);
const menuList = ref<MenuItem[]>([]);
const fileList = ref<FileType[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const userInfo = ref<UserInfo>({
  fullName: "",
});
let inputValue: string = "";
let chatList = ref<ChatMessage[]>([]);
onMounted(() => {
  console.log("mounted");
  if (!isFirst) {
    isShowPdf.value = true;
    getConversationsList("");
    let id = route.params.id;
    if (id) {
      getMessages({
        conversationId: id + "",
        limit: 99,
      });
    }
    userInfo.value = JSON.parse(localStorage.getItem("userInfo") as string);
  }
});
const showChat = ref<boolean>(false);
const sendMessage = async (value: string) => {
  isShowPdf.value = false;
  showChat.value = true
  const conversation_id = await inputEnter(value)
  console.log('回答完毕', conversation_id);
  isShowPdf.value = true;
  chatList.value[0].conversationId = conversation_id as string;
  //路由
  router.replace({
    path: "/chat/" + conversation_id,
  });
  isFirst = true;
  //更新左侧列表
  setTimeout(() => {
    getConversationsList(value);
  }, 0);
};
// 左侧会话列表
async function getConversationsList(_value: string) {
  console.log(isFirst, 'isFirst');

  if (isFirst) {
    //更新会话name
    let id = route.params.id
    await editConversation({
      conversationId: id as string,
      name: _value.slice(0, 10),
    });
  }

  const res = await getConversations({
    limit: 99,
  });
  let data = res.data as any[];
  console.log(res);
  // showText默认值 = true;

  data.forEach((item: any, _index: number) => {
    item.showText = true;
    // item.name = `会话${index + 1}`;

  });
  // (data.find((item: any) => item.id == route.params.id)?.id)?.name 
  activeMenuId.value = data.find((item: any) => item.id == route.params.id)?.id || data[0]?.id;
  menuList.value = [...data];


  isFirst = false;
}
//获取会话记录
async function getMessages(params: MessageType) {
  showChat.value = true
  loadingMessage.value = true;
  chatList.value = [];
  const res = await getMessagesList(params);

  if (res.code != 500) {
    console.log(res, "getMessagesList");
    let data = res.data as [];
    //一条记录生成两条对话，一条是用户，一条是机器人
    let messList: ChatMessage[] = [];
    data.forEach((item: any) => {
      messList.push({
        avatar: UserIcon,
        name: "",
        role: "user",
        content: item.query,
        conversationId: item.conversation_id,
      });
      messList.push({
        avatar: ChatIcon,
        name: "",
        role: "assistant",
        content: item.answer,
        conversationId: item.conversation_id,
      });
    });

    messList.reverse();
    console.log(messList, "messList");
    chatList.value = messList;
  }
  loadingMessage.value = false;
}

//监听路由变化
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal) {
      console.log(newVal, "路有变化了", isFirst);
      if (!isFirst) {
        getMessages({
          conversationId: newVal + "",
          limit: 99,
        });
      }
    }
  }
);

function menuHandle(item: any) {
  console.log(item.id);
  activeMenuId.value = item.id;
  router.push({
    path: "/chat/" + item.id,
  });
}

const chatRef = ref<{
  scrollToBottom: (options?: { behavior?: string }) => void;
} | null>(null);
const isShowToBottom = ref<boolean>(false);
// 滚动到底部
const backBottom = () => {
  chatRef?.value?.scrollToBottom({
    behavior: "smooth",
  });
};

const sendFile = (file: File) => {
  console.log(file, "sendFile-file");
  showChat.value = true
  chatList.value = [];
  uploadImage(file);
}

function handleAddFileClick() {
  fileInput?.value?.click();
  console.log(fileInput.value);

}
//上传文件
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    // 处理文件
    console.log(file);
    uploadImage(file)
  }

};

const uploadImage = async (file: File) => {
  const fileData = new FormData();
  fileData.append("file", file);
  uploadContractFile(fileData).then((res: any) => {
    console.log(res, "上传图片");
    let files = [...fileList.value, res];
    console.log(files, "files==============");

    files = files.map((item: FileType) => {
      return {
        type: item.mime_type,
        transfer_method: "local_file",
        upload_file_id: item.id,
        name: item.name,
        extension: item.extension.toUpperCase(),
        size: item.size,
      };
    });
    fileList.value = files;
    console.log(fileList.value, "fileList.value");
  });

}

// 是否显示回到底部按钮
const handleChatScroll = function (e: Event) {
  const target = e.target as HTMLElement;
  const scrollTop = target?.scrollTop;
  isShowToBottom.value = scrollTop < 0;
};

// 清空消息
const clearConfirm = function () {
  chatList.value = [];
};
const handleOperation = async function (type: string, options: any, item?: any) {
  console.log("handleOperation", type, options, item);

  if (type === "replay") {
    console.log("重新生成", options, chatList.value);

    await inputEnter(inputValue);
  }
};

const onStop = async function () {
  console.log("停止111111");
  loading.value = false;
  console.log(taskId, "taskId");
  const res = await stopChat(taskId);
  console.log(res, "停止");
};
const inputEnter = function (inputValue: string) {
  return new Promise(async (resolve, _reject) => {
    console.log("inputEnter", inputValue);

    if (loading.value) {
      return;
    }
    const params = {
      avatar: UserIcon,
      name: "",
      datetime: formatTime(new Date()),
      content: inputValue,
      conversationId: chatList.value[0]?.conversationId,
      role: "user",
    };
    chatList.value.unshift(params as any);
    // 空消息占位
    const params2 = {
      avatar: ChatIcon,
      name: "",
      datetime: formatTime(new Date()),
      content: "",
      reasoning: "",
      role: "assistant",
      conversationId: chatList.value[0]?.conversationId,
    };
    chatList.value.unshift(params2 as any);
    query.value = "";
    loading.value = true;
    inputValue = inputValue;
    const lastItem = chatList.value[0];
    console.log(lastItem, "lastItem");
    let paramsResquest: ChatAIQuery = {
      query: inputValue,
      conversationId: lastItem.conversationId,
    };
    if (fileList.value.length > 0) {
      paramsResquest.files = [...fileList.value];
    }
    fileList.value = [];
    isStreamLoading.value = true;
    const res = await queryAIChat(paramsResquest);
    console.log("queryAIChat-res", res);

    if (!res.ok) return;
    const reader = res?.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;
    let buffer = "";

    const processChunk = (result: ReadableStreamReadResult<Uint8Array<ArrayBuffer>>) => {
      const { done, value } = result;
      if (done) return;
      if (!value) return; // 检查 value 是否存在
      buffer += decoder.decode(value, { stream: true });
      // 处理事件流格式
      while (buffer.includes("\n\n")) {
        const eventEndIndex = buffer.indexOf("\n\n");
        const eventData = buffer.slice(0, eventEndIndex); // 获取一个完整的事件数据
        buffer = buffer.slice(eventEndIndex + 2); // 去掉处理过的数据
        // 解析 JSON 数据
        try {
          const lines = eventData.split("\n"); // 按行分割
          if (lines.length) {
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (line.startsWith("data:")) {
                const jsonStr = line.replace("data:", "").trim();
                const data = JSON.parse(jsonStr);
                console.log(data.event, data.answer, data.task_id, data.conversation_id, "data");
                taskId = data.task_id; //记录任务id 方便终止
                if (data.answer) {
                  isStreamLoading.value = false;
                }
                // 处理数据
                if (data.answer) {
                  // lastItem.reasoning += data.reasoning;
                  lastItem.content += data.answer;
                }
                if (data.event === "message_end") {
                  console.log("结束");
                  resolve(data.conversation_id)
                  loading.value = false;
                }
              }
            }
          }
        } catch (e) {
          console.error("SSE 解析错误:", e);
        }
      }

      reader.read().then(processChunk);
    };
    reader.read().then(processChunk);
  })
};


const showText = ref(true);
const inputBlur = async (item: any) => {
  await editConversation({
    conversationId: item.id,
    name: chatName.value,
  });
  showText.value = true;
  getConversationsList("")
}

const delConversation = async () => {



  const res = await deleteConversation({
    conversationId: currItem.id,
  });
  if (res && typeof res === 'object' && 'result' in res && res.result === "success") {
    MessagePlugin.success("操作成功");
    menuList.value.splice(currItem.index as number, 1);
    delVisible.value = false;
  }
  if (route.params.id === currItem.id) {
    router.replace({
      path: "/",
    });
    showChat.value = false;
    chatList.value = []; //清空聊天记录
  }

}

const menuItemHandle = async (type: string, item: any, index: number) => {
  if (type === "delete") { //删除
    console.log(item, "item");
    currItem = { ...item };
    currItem.index = index;
    delVisible.value = true;
  } else if (type === "rename") { //重命名
    //先默认全部显示文本
    menuList.value.forEach((item: any) => {
      item.showText = true;
    })
    console.log(item, "item");
    item.showText = false;
    chatName.value = item.name;

  }
};

const downloadPDFHandle = async () => {
  const res = await downloadPdf({
    conversationId: route.params.id as string,
  })
  console.log(res, "res");
  // Blob {size: 63855, type: 'application/pdf'}size: 63855type: "application/pdf"[[Prototype]]: Blob 
  const blob = new Blob([res], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = '商业IP内容智能体.pdf'
  link.click();
  URL.revokeObjectURL(url);
}

const goHome = async () => {
  chatList.value = [];
  router.replace({
    path: "/",
  });
  showChat.value = false;
  chatList.value = []; //清空聊天记录
  chatName.value = "";
  fileList.value = [];
  isExpand.value = false;
};

//折叠
const expand = () => {
  isExpand.value = !isExpand.value;
};

const removeFile = (index: number) => {
  fileList.value.splice(index, 1);
  fileList.value = [...fileList.value];
  console.log(fileList.value, "fileList.value");
};

const logout = async () => {
  //二次确认
  //清除用户信息
  localStorage.clear()
  //跳转到登录页
  router.replace({
    path: "/login",
  });
}



</script>
<style></style>
<style lang="scss" scoped>
/* 整体滚动条轨道 */
::-webkit-scrollbar {
  width: 8px;
  /* 垂直滚动条宽度 */
  height: 8px;
  /* 水平滚动条高度 */
}

/* 滚动条轨道背景 */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* 轨道颜色 */
  border-radius: 10px;
  /* 圆角 */
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: #eeeeee;
  /* 滑块颜色 */
  border-radius: 10px;
  /* 滑块圆角 */
  border: 2px solid #f1f1f1;
  /* 滑块边框 */
}

/* 鼠标悬停时滑块样式 */
::-webkit-scrollbar-thumb:hover {
  background: #555;
  /* 悬停颜色 */
}

.dialog {
  padding: 24px !important;
}

.chat-box {
  position: relative;
  width: 100%;
  padding: 10px;

  .bottomBtn {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: 210px;
    padding: 0;
    border: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.08),
      0px 16px 24px 2px rgba(0, 0, 0, 0.04),
      0px 6px 30px 5px rgba(0, 0, 0, 0.05);
  }

  .to-bottom {
    width: 40px;
    height: 40px;
    border: 1px solid #dcdcdc;
    box-sizing: border-box;
    background: var(--td-bg-color-container);
    border-radius: 50%;
    font-size: 24px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .t-icon {
      font-size: 24px;
    }
  }
}

.model-select {
  display: flex;
  align-items: center;

  .t-select {
    width: 112px;
    height: 32px;
    margin-right: 8px;

    .t-input {
      border-radius: 32px;
      padding: 0 15px;
    }
  }

  .check-box {
    width: 112px;
    height: 32px;
    border-radius: 32px;
    border: 0;
    background: #e7e7e7;
    color: rgba(0, 0, 0, 0.9);
    box-sizing: border-box;
    flex: 0 0 auto;
  }

  .check-box.is-active {
    border: 1px solid #d9e1ff;
    background: #f2f3ff;
    color: var(--td-brand-color);
  }
}

.custom-input {
  :deep(.t-textarea__inner) {
    border-radius: 4px;
    height: 100px !important;
  }

  .t-button__text {
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      margin-left: 4px;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;
  position: absolute;
  box-shadow: 0px 1px 3px 0px #c3c3c3;
}

.main {
  display: flex;
  width: 100%;

  .seder-bar {
    transition: all 0.3s;
    width: 260px;
    padding: 10px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    .logo {
      height: 35px;
      font-family: Source Han Sans, Source Han Sans;
      font-weight: 700;
      font-size: 24px;
      color: #111823;
      line-height: 35px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .text {
        cursor: pointer;
      }
    }

    .create-msg {
      cursor: pointer;
      flex-shrink: 0;
      margin-top: 30px;
      width: 100%;
      height: 40px;
      background: #e0e3ff;
      border-radius: 8px 8px 8px 8px;
      display: flex;
      align-items: center;
      padding-left: 14px;

      .text {
        font-family: Source Han Sans, Source Han Sans;
        font-weight: 700;
        font-size: 15px;
        color: #2d42fc;
        line-height: 24px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        padding-left: 5px;
      }

      &:hover {
        background: #d0d5ff;
      }
    }

    .menu {
      box-sizing: border-box;
      padding: 20px 10px;
      display: flex;
      flex-direction: column;
      overflow: scroll;
      overflow-x: hidden;
      flex: auto;

      .menu-item {
        cursor: pointer;
        margin-bottom: 10px;
        width: 100%;
        height: 40px;
        border-radius: 4px;
        // border: 1px solid #e7e7e7;
        // background: #f7f7f7;
        color: rgba(0, 0, 0, 0.9);
        box-sizing: border-box;
        flex: 0 0 auto;

        // justify-content: space-between;
        align-items: center;
        display: flex;
        padding: 0 10px;
        position: relative;

        // padding: 10px;
        .menu-item-title {
          // 一行显示
          width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: auto;

          span {
            margin-left: 4px;
          }
        }

        .menu-item-submenu {
          width: 50px;
          background-color: #cbcbcb;
          position: absolute;
          font-size: 14px;
          right: 0;
          top: 26px;
          z-index: 1;
        }

        .menu-item-handle {
          width: 20px;
          height: 20px;
          background-color: #9e9e9e;
          display: flex;
          align-items: center;
          justify-content: center;
          display: none;

          &:hover {
            .menu-item-submenu {
              display: block;
            }
          }
        }

        &:hover {
          background: #e7e7e7;

          .menu-item-handle {
            display: flex;
          }
        }


      }

      .active {
        background: #e7e7e7;
      }


    }

    .login-status {
      .left {
        display: flex;
        align-items: center;
        padding: 10px;


        .login-status-avatar {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }

      .login-status-logout {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .seder-bar-expand {
    width: 0;
    font-size: 0;
  }
}

.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .chat-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
}

:deep(.t-chat__list--reverse) {
  padding: 0 48px 0 10px;
}

.loading {
  display: flex;
  /* width: 100%; */
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.expand {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.pa {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 9;
}

.home {
  width: 100%;
  display: flex;
}

.file-list {
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 10px;

  .file-list-item {
    display: flex;
    align-items: center;
    position: relative;
    min-width: 220px;
    gap: 10px;
    padding: 10px;
    background: #eee;
    border-radius: 20px 20px 20px 20px;

    .file-list-item-close {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .file-list-item-name {
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 400;
    font-size: 14px;
    color: #111823;
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }

  .file-list-item-size {
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 400;
    font-size: 12px;
    color: #666666;
    line-height: 18px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}

.box-item {
  .popover-item {
    gap: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: #e7e7e7;
    }
  }
}

.dialog-title {
  display: flex;

  p {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 16px;
    color: #333333;
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    padding-left: 10px;
  }
}

.dialog-content {
  font-family: Microsoft YaHei, Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #666666;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  padding-left: 35px;
}

.confirm-btn {
  width: 65px;
  height: 30px;
  background: #2D42FC;
  border-radius: 32px 32px 32px 32px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 300;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.cancel-btn {
  width: 65px;
  height: 30px;
  background: #FFFFFF;
  border-radius: 32px 32px 32px 32px;
  font-family: PingFang SC, PingFang SC;
}

.add-file-button {
  position: absolute;
  width: 30px;
  height: 30px;
  right: 50px;
  bottom: 10px;
  cursor: pointer;
}

.t-dialog--default {
  padding: 20px;
}

.pdf {
  display: grid;
  width: 100%;
  height: 72px;
  background: #FFF8F5;
  border-radius: 20px 20px 20px 20px;
  border: 1px solid #E4773D;
  margin-bottom: 20px;
  grid-template-columns: auto 2fr auto;
  align-items: center;
  gap: 10px;
  padding: 0 15px;

  .pdf-icon {
    width: 40px;
    height: 40px;
  }

  .pdf-title {
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 400;
    font-size: 16px;
    color: #E4773D;
    line-height: 26px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }

  .pdf-download-icon {
    width: 30px;
    height: 30px;
    cursor: pointer;

  }
}

:deep(.t-chat__text__content) {
  white-space: inherit;
  line-height: 2 !important;
}
</style>
<style>
.t-chat__text__assistant p,
.t-chat__text__assistant ul,
.t-chat__text__assistant ol,
.t-chat__text__assistant li {
  line-height: 2 !important;
}
</style>
