import { MessageBox } from "element-ui";
import Clipboard from "clipboard";
const crypto = require("crypto"); // 使用示例
import Message from "@/common/js/message";
import { config } from "@/config.js";
import { customerInfoApi } from "api";
import store from "@/store/index";
import agentData from "@/utils/model";

//是否是一个合法的链接;
export function isValidURL(url) {
  return /^https?:\/\//.test(url);
}
//是否登录
export function isLogin() {
  return window.localStorage.getItem("accessToken") ? true : false;
}
//获取上传的头像
export function setUeseInfo() {
  let accessToken = localStorage.getItem("accessToken");
  accessToken &&
    customerInfoApi({ accessToken }).then((res) => {
      let data = res.data || {};
      store.commit("setUserData", data);
    });
}
//验证手机号
export const validateMobile = function (rule, value, callback) {
  let newValue = value.replace(/[^0-9]/gi, "");
  if (value !== newValue) {
    callback(new Error("请输入正确的手机号"));
  } else if (newValue.length !== 11) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
};
/**
 *
 * @param {object}
 * @param {function} 回调函数
 *
 */
export function $confirm(params, callback, catchCb) {
  let { content, title, confirmButtonText, cancelButtonText, type } = params;
  MessageBox.confirm(content || "此操作将永久删除, 是否继续?", title || "提示", {
    confirmButtonText: confirmButtonText || "确定",
    cancelButtonText: cancelButtonText || "取消",
    type: type || "warning",
  })
    .then(() => {
      arguments.length == 1 ? params() : callback(); //如果参数是一个，直接执行回调函数
    })
    .catch(() => {
      catchCb?.();
    });
}

export function handleClipboard(event, text) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  });
  clipboard.on("success", () => {
    new Message().success({ message: "复制成功" });
    clipboard.destroy();
  });
  clipboard.on("error", () => {
    new Message().warning({ message: "复制失败" });
    clipboard.destroy();
  });
  clipboard.onClick(event);
}
// 加密算法
function getHmacSha1(message, key) {
  const messageBuffer = Buffer.from(message, "utf8");
  const keyBuffer = Buffer.from(key, "utf8");
  const hmac = crypto.createHmac("sha1", keyBuffer);
  hmac.update(messageBuffer);
  const result = hmac.digest();
  const _sig = result.toString("base64");
  return _sig;
}
// 生成认证字符
export function createToSign(accessToken, SK, timestamp) {
  const newStr = accessToken + timestamp;
  const signature = getHmacSha1(newStr, SK);
  return signature;
}
//每天凌晨清除 使用次数
export function initUseCount() {
  window.setInterval(() => {
    var refreshHours = new Date().getHours();
    var refreshMin = new Date().getMinutes();
    var refreshSec = new Date().getSeconds();
    let useCount = localStorage.getItem("useCount");
    if (refreshHours == 0 && useCount != 0) {
      // 指定每天凌晨做的事情
      window.localStorage.setItem("useCount", 0);
    }
  }, 1000);
}
let timestamp = new Date().valueOf();
export function getComParams() {
  let accessToken = localStorage.getItem("accessToken") || `DIGI-${timestamp}`;
  let sid = createToSign(accessToken, "DigiCarbonAI", timestamp);
  return {
    accessToken,
    sid,
    timestamp,
  };
}
//Vue iconfont 编码转换 可以以字符串形式
export function iconfont(icon) {
  const reg = /(&#x)?(.*)/;
  let iconfontName;
  if (reg.test(icon)) {
    iconfontName = reg.exec(icon)[2];
  }
  return String.fromCharCode(parseInt(iconfontName, 16));
}
// 创建一个id
export function uuid(length = 8, chars) {
  let result = "";
  let charsString = chars || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = length; i > 0; --i) {
    result += charsString[Math.floor(Math.random() * charsString.length)];
  }
  return result;
}
//获取问答的推荐问题
export function getRandomQuestion(questions, count) {
  // 创建一个空数组存放随机选取的元素
  if (!questions || questions.length == 0) return [];
  if (questions.length == 1 && !questions[0]) return [];
  var randomArr = [];
  // if (!agentData[agentId]?.questions) return [];
  // let questions = agentData[agentId].questions;
  while (randomArr.length < count) {
    // 生成一个介于0到arr.length-1之间的随机索引值
    var index = Math.floor(Math.random() * questions.length);
    if (randomArr.indexOf(questions[index]) == -1) {
      randomArr.push(questions[index]);
    }
  }
  return randomArr;
}
