import axios from "axios"; // 引入axios
import { Message } from "element-ui";
let { NODE_ENV } = process.env;
import Vue from "vue";
import $vue from "@/main";

//连接mock连接
const http = axios.create({
  baseURL: "/api",
  timeout: 6000000,
  responseType: "json",
  withCredentials: true,
  headers: {
    httponly: true,
    secure: true,
  },
});

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    http
      .get(url, { params: params })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    http
      .post(url, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}
/**
 * @函数功能:请求拦截器 添加请求头
 * @参数输入:
 * @函数返回:
 */
http.interceptors.request.use(
  (config) => {
    // if (NODE_ENV === "development") {
    //   config.headers["loginUser"] = "wlliweili_v";
    // }
    return config;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

/**
 * @函数功能:拦截器
 * @参数输入:
 * @函数返回:
 */
http.interceptors.response.use(
  (data) => {
    //无效的token
    if (data.data.code === 1001) {
      $vue.$EventBus.$emit("voidToken");
      return;
    }
    //无效的agentId
    if (data.data.code === 1003) {
      localStorage.setItem("agentId", "");
    }
    //响应出现问题
    if (data.data.code !== 0) {
      Message.warning({ message: data.data.msg });
      return Promise.reject(err);
    }
    return data;
  },
  (err) => {
    // debugger;
    Message.error({
      message: `程序出错了，请联系管理员：${err.response.statusText}（${err.response.status}）`,
    });
    return Promise.reject(err);
  }
);
