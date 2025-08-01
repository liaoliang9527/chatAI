<template>
  <div class="container">
    <div class="top">
      <div class="logo-title">
        <div class="title">{{ BASE_TITLE }}</div>
        <div class="doc">
          专为老板和创业者打造，从0到1搭建个人IP的全流程内容生成器，短视频脚本、直播话术、朋友圈文案，一键生成，直接拿来拍、拿来发、拿来成交。
        </div>
      </div>
    </div>
    <div class="content">
      <t-chat-sender v-model="message" :textarea-props="{
        placeholder: '请输入，Enter键发送，Shift+Enter键换行', autofocus: true
      }" :loading="loading" @send="sendMessage">
        <!-- 自定义操作区域的内容，默认支持图片上传、附件上传和发送按钮 -->
        <template #suffix="{ renderPresets }">
          <t-popup placement="top" content="上传图片" show-arrow destroy-on-close>
            <img src="@/assets/images/add_file_icon.png" class="add-file-button" @click="handleAddFileClick"></img>
          </t-popup>

          <input ref="fileInput" accept="image/*" type="file" hidden @change="handleFileSelect" />
          <component :is="renderPresets([])" />
        </template>
      </t-chat-sender>
      <!-- 
      <t-popup placement="top" content="上传图片" show-arrow destroy-on-close>
        <img src="@/assets/images/add_file_icon.png" class="add-file-button" @click="handleAddFileClick"></img>
      </t-popup>

      <img src="@/assets/images/sending_icon.png" class="send-arrow-button" @click="sendMessage"></img> -->
    </div>
  </div>
  <input ref="fileInput" accept="image/*" type="file" hidden @change="handleFileSelect" />
</template>

<script setup lang="ts" name="Home">
import { ref, nextTick, onMounted } from "vue";
const BASE_TITLE = ref<string>(import.meta.env.VITE_BASE_TITLE);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const message = ref<string>("");
const disabled = ref<boolean>(false);
const emits = defineEmits(["sendMessage", "sendFile"]);
const fileInput = ref<HTMLInputElement | null>(null);
const loading = ref<boolean>(false);


function handleAddFileClick() {
  fileInput?.value?.click();
  console.log(fileInput.value);

}
function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    // 处理文件
    console.log(file);
    emits("sendFile", file);
  }
}

function sendMessage(): void {
  if (message.value.trim() === "") {
    return;
  }
  console.log(message.value);
  emits("sendMessage", message.value)
  message.value = "";
  disabled.value = true;
}



onMounted(() => {
  nextTick(() => {
    textareaRef.value?.focus();
  });
  disabled.value = true;
});
</script>

<style lang="scss" scoped>
$primary-color: #175cd3;

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .top {
    zoom: 1.2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .logo-title {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 10px;

      .logo {
        width: 50px;
        height: 50px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        font-family: Source Han Sans, Source Han Sans;
        font-weight: 500;
        font-size: 24px;
        color: #111823;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }

    .doc {
      color: #111823;
      font-size: 14px;
      max-width: 660px;
    }
  }

  .content {
    margin-top: 30px;
    border-radius: 10px;
    min-height: 112px;
    width: 100%;
    max-width: 800px;
    position: relative;

    .search-consult-textarea {
      width: 100%;
      height: 100%;
      padding: 10px;
      border: none;
      outline: none;
      resize: none;
      font-size: 1em;
      background-color: none;
    }

    .send-arrow-button {
      position: absolute;
      width: 30px;
      height: 30px;
      right: 10px;
      bottom: 10px;
      cursor: pointer;
    }

    .add-file-button {
      position: absolute;
      width: 30px;
      height: 30px;
      right: 50px;
      bottom: 10px;
      cursor: pointer;
    }
  }

  .bottom {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .btn {
      width: 100px;
    }
  }
}
</style>
