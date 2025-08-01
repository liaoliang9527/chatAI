<template>
  <div class="index-container">
    <div class="banner">
      {{ BASE_TITLE }}
    </div>
    <div class="content">
      <div class="group">
        <div class="title"> {{ BASE_TITLE }}</div>
        <div class="tip">创始人IP加速器：输入业务，输出流量，拿来就赚 <br>
          告别烧脑文案，让商业IP内容智能体成为您的内容军团</div>
        <t-button class="start-btn" @click="hiddenLogin = false">立即对话  获取流量</t-button>
      </div>
    </div>
    <div class="login-bg" v-if="!hiddenLogin">
      <div class="mask"></div>
      <div class="login-box">
        <div class="login-title"> {{ BASE_TITLE }}</div>
        <t-form labelAlign="top" label-width="auto" layout :data="loginForm" :rules="rules" ref="loginRef"
          :onValidate="onValidate" class="login-form" style="max-width: 600px">
          <t-form-item label="手机号" name="phone">
            <t-input v-model="loginForm.phone" placeholder="请输入手机号" maxlength="11" clearable size="large" />
          </t-form-item>
          <t-form-item label="验证码" name="code" class="login-code">
            <t-input v-model="loginForm.code" placeholder="请输入验证码" size="large">
            </t-input>
            <t-button variant="text" theme="default" size="small" :disabled="isCodeDisabled" class="send-code-btn"
              @click="sendCode">{{
                isCodeDisabled ? `${countDown}s` : '发送验证码' }}</t-button>
          </t-form-item>
          <t-form-item>
            <t-button type="primary" :disabled="isAble" class="login-btn" size="large">登录</t-button>
          </t-form-item>
          <t-form-item>
          </t-form-item>
        </t-form>
        <img src="@/assets/images/pop_close_icon.png" width="16px" class="close-icon" @click="hiddenLogin = true"></img>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
const BASE_TITLE = ref<string>(import.meta.env.VITE_BASE_TITLE);
import { MessagePlugin } from 'tdesign-vue-next'
import { sendSmsCode, loginByPhone, getUserInfo } from "../../api/chat";
import { useRouter } from "vue-router";
const router = useRouter();

const loginForm = reactive({
  phone: "",
  code: "",
});

const loginRef = ref(null)

const isAble = computed(() => {
  if (loginForm.phone && loginForm.code) {
    return false
  } else {
    return true
  }
})

const hiddenLogin = ref(true) // 隐藏登录框


const rules = reactive({
  phone: [
    {
      required: true,
      message: '请输入手机号',
      type: 'error',
      trigger: 'change',
    },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号',
      type: 'error',
      trigger: 'blur',
    },

  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    }
  ]
})
/**
 * 发送验证码
 */
const isCodeDisabled = ref(false) // 发送验证码按钮是否禁用
const countDown = ref(60) // 倒计时
const timer = ref<number | null>()
const sendCode = async () => {
  if (!loginForm.phone) {
    MessagePlugin.warning('请输入手机号')
    return
  }
  try {
    isCodeDisabled.value = true
    const res = await sendSmsCode({ phone: loginForm.phone, type: 2 })
    if (res.data) {
      // 开始倒计时
      countDown.value = 60
      timer.value = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value--
        } else {
          // 倒计时结束，重置状态
          clearInterval(timer.value!)
          isCodeDisabled.value = false
          countDown.value = 60
          timer.value = null
        }
      }, 1000)
    } else {
      isCodeDisabled.value = false
    }
  } catch (error) {
    isCodeDisabled.value = false
  }
}


const onValidate = async (valid: any) => {
  console.log(valid, loginForm, 'onValidate');
  let validateResult = valid.validateResult
  if (typeof validateResult !== 'object') {
    console.log(1);
    login()
  }
}


/**
 * 登录
 */
const login = async () => {
  console.log(1111);
  const res = await loginByPhone(loginForm)
  if (res.code === 0) {
    localStorage.setItem('token', String(res.data))
    //查询用户信息
    const { data } = await getUserInfo()
    localStorage.setItem('userInfo', JSON.stringify(data))
    router.push('/')
  }
};

</script>

<style scoped lang="scss">
.index-container {
  width: 100%;
  background: url('@/assets/images/index_banner_bg.png') no-repeat center center/cover;
}

.banner {
  font-weight: 700;
  font-size: 24px;
  color: #1374FA;
  line-height: 35px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  padding-left: 34px;
  padding-top: 13px;
}

.content {
  width: 100%;
  margin-top: 210px;
  display: flex;
  padding-left: 20vw;


  .group {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

}

.login-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.login-box {
  background: #fff;
  width: 460px;
  border-radius: 8px;
  padding: 20px 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .login-title {
    font-weight: 700;
    font-size: 30px;
    margin-bottom: 46px;
    text-align: center;
    color: #111823;
  }

  .login-code {
    position: relative;

    .send-code-btn {
      position: absolute;
      right: 2px;
      top: 2px;
      padding: 0 24px;
      height: 36px;
      z-index: 9;
      color: #000;
    }
  }



  :deep(.t-form-item__label) {
    font-size: 14px;
    color: #111823;
  }

  .t-button.login-btn {
    width: 100%;
    height: 48px;
    background-color: #2D42FC;
  }

  .login-footer {
    line-height: 24px;
    font-size: 14px;
    color: #999999;
  }

  .close-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;

  }
}

.title {
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 700;
  font-size: 40px;
  color: #1374FA;
  line-height: 58px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-bottom: 22px;
}


.tip {
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 400;
  font-size: 14px;
  color: #111823;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.start-btn {
  width: 192px;
  height: 48px;
  margin-top: 20px;
  line-height: 48px;
  color: #fff;
  background: #1374FA;
  border-radius: 5px 5px 5px 5px;
}
</style>