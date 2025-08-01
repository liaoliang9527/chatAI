import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosHeaders,
} from "axios";
import { MessagePlugin } from "tdesign-vue-next";
import { ResultEnum } from "../enums/httpEnum";
import { useRouter } from "vue-router";

import { BASE_URL } from "../util/constants";
import { AxiosCanceler } from "./helper/axiosCancel.ts";
const router = useRouter();
console.log(BASE_URL, "BASE_URL===========");

/**
 * 返回response
 * */
export interface ReturnHandler<T> {
  /**
   * 状态码
   * */
  code: number;

  /**
   * 错误信息
   */
  msg: string;

  /**
   * 数据
   */
  data: T;
}

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  // showLoading?: boolean;
  cancel?: boolean;
  isSSE?: boolean;
}

const config: CustomAxiosRequestConfig = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: BASE_URL,
  // baseURL: "http://api.dev.admodel.net:9999",
  // baseURL: "hhttps://api.admodel.net",
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  // withCredentials: true
  headers: new AxiosHeaders(),
};

const axiosCanceler = new AxiosCanceler();
let globalParams = {
  type: 2, // type  1:经略智能体;2:商业智能体
};
class RequestHttp {
  service: AxiosInstance;
  public constructor(config: CustomAxiosRequestConfig) {
    console.log("config", config);
    // instantiation
    this.service = axios.create(config);
    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        config.cancel ??= true;
        if (config.cancel) {
          axiosCanceler.addPending(config);
        }
        console.log("request config", config);
        // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { loading: false } 来控制
        // config.showLoading ??= true;
        if (!(config as InternalAxiosRequestConfig).headers) {
          config.headers = new AxiosHeaders();
        }
        // const userStore = useUserStore();
        const token = localStorage.getItem("token");
        config.headers.set("Authorization", token);
        console.log("config1111", config);
        // if (config.isSSE) {
        //   config.headers.set("Accept", "text/event-stream");
        // }

        // 根据请求方法不同，处理参数的添加方式
        if (config.method === "get") {
          // GET请求：参数添加到params中
          config.params = {
            ...config.params, // 保留原请求的参数
            ...globalParams, // 添加全局参数
          };
        } else {
          // POST等其他请求：参数添加到data中
          config.data = {
            ...config.data, // 保留原请求的参数
            ...globalParams, // 添加全局参数
          };
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
        const { data, config, headers } = response;
        console.log(data, config, headers, "1111111111");

        axiosCanceler.removePending(config);
        // const userStore = useUserStore();

        if (data.code === ResultEnum.ERROR) {
          console.log(50000000000);
          MessagePlugin.error(data.msg);
          return data;
        }

        // 登陆失效
        if (
          data.code == ResultEnum.NEED_LOGIN ||
          data.code == ResultEnum.EXPIRE_TOKEN
        ) {
          // userStore.setToken("");
          // localStorage.setItem("token", "")
          router.push("/");
          return data;
        }
        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          MessagePlugin.error(data.msg);
          return data;
        }

        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        // const authHeader = response.headers["authorization"];
        // const newToken = authHeader; // 当token快过期时，会返回新的token，此时用新的token替换掉旧的token
        // 确保newToken不为undefined再设置
        // if (newToken) {
        //   userStore.setToken(newToken as string);
        // }
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;
        console.log(error, "2222222222");

        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.indexOf("timeout") !== -1)
          if (error.message.indexOf("Network Error") !== -1)
            if (response) console.log(response, "请求超时！请您稍后重试");

        MessagePlugin.error("请求超时！请您稍后重试");
        MessagePlugin.error("网络错误！请您稍后重试");
        // 根据服务器响应的错误状态码，做不同的处理
        // checkStatus(response.status);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        // if (!window.navigator.onLine) router.replace("/500");
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description 常用请求方法封装
   */
  get<T>(
    url: string,
    params?: object
    // showLoading: boolean = true
  ): Promise<ReturnHandler<T>> {
    return this.service.get(url, {
      params,
      // showLoading,
      headers: new AxiosHeaders(),
    } as CustomAxiosRequestConfig);
  }
  // 发送POST请求
  post<T>(
    // 请求的URL
    url: string,
    // 请求的参数，可以是对象或字符串
    params?: object | string
  ): Promise<ReturnHandler<T>> {
    // 调用service的post方法发送请求
    return this.service.post(url, params, {
      headers: new AxiosHeaders(),
    } as CustomAxiosRequestConfig);
  }

  postBody<T>(
    url: string,
    params: Record<string, any>,
    data: any
    // showLoading: boolean = true
  ): Promise<ReturnHandler<T>> {
    // 将params参数转换为查询字符串
    let paramsStr = "";
    const keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      paramsStr += `${key}=${params[key]}`;
      if (i < keys.length - 1) {
        paramsStr += "&";
      }
    }
    const fullUrl = `${url}?${paramsStr}`;
    return this.service.post(fullUrl, data, {
      // showLoading,
      headers: new AxiosHeaders(),
    } as CustomAxiosRequestConfig);
  }

  put<T>(
    url: string,
    params?: object
    // showLoading: boolean = true
  ): Promise<ReturnHandler<T>> {
    return this.service.put(url, params, {
      params,
      // showLoading,
      headers: new AxiosHeaders(),
    } as CustomAxiosRequestConfig);
  }

  delete<T>(
    url: string,
    params?: any
    // showLoading: boolean = true
  ): Promise<ReturnHandler<T>> {
    return this.service.delete(url, {
      data: params,
      // showLoading,
      headers: new AxiosHeaders(),
    } as CustomAxiosRequestConfig);
  }

  download(
    url: string,
    params?: object
    // showLoading: boolean = true
  ): Promise<BlobPart> {
    return this.service.post(url, params, {
      // showLoading,
      headers: new AxiosHeaders(),
      responseType: "blob",
    } as CustomAxiosRequestConfig);
  }
  fetch(url: string, params?: object): Promise<Response> {
    return fetch(config.baseURL + url, {
      method: "POST",
      body: JSON.stringify({
        ...params,
        ...globalParams,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || "",
      } as HeadersInit,
    });
  }
}

export default new RequestHttp(config);
