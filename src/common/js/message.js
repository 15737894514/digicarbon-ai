// 为了实现Class的私有属性
import { Message } from "element-ui";
const showMessage = Symbol("showMessage");
/**
 *  重写ElementUI的Message
 *  single默认值true，默认只弹出一个，可以根据实际需要设置
 */
let messageInstance = null;
class DonMessage {
  success(options, single = true) {
    this[showMessage]("success", options, single);
  }
  warning(options, single = true) {
    this[showMessage]("warning", options, single);
  }
  info(options, single = true) {
    this[showMessage]("info", options, single);
  }
  error(options, single = true) {
    this[showMessage]("error", options, single);
  }
  [showMessage](type, options, single) {
    if (messageInstance && single) {
      messageInstance.close(); //先把原来的关闭
    }
    messageInstance = Message[type]({ ...options, showClose: true }); //再创建新的消息
  }
  state(res, msgs) {
    if (res.success === 0 || res.code == 0) {
      let msg = msgs?.[0] ? msgs?.[0] : res.msg;
      this.success({ message: msg });
      return true;
    } else {
      let msg = msgs?.[1] ? msgs?.[1] : res.msg;
      this.warning({ message: msg });
      return false;
    }
  }
}
export default DonMessage;
