<template>
  <div>
    <div class="login-logo">
      <img style="width: 150px" class="logo" :src="logo" alt="" />
      <!-- <div class="logo-title">
        <p>中财数碳</p>
        <p>DIGICARBON</p>
      </div> -->
    </div>
    <sec-form ref="loginForm" size="medium" style="margin: 30px 30px" :formData="formData" :ruleForm="ruleForm">
      <template v-slot:phoneNumberLabel><span class="sign">*</span>手机号</template>
      <template v-slot:phoneNumber>
        <el-input placeholder="请输入手机号" v-model="ruleForm.phoneNumber"></el-input>
      </template>
      <template v-slot:smsCodeLabel><span class="sign">*</span>验证码</template>
      <template v-slot:smsCode>
        <div class="position:relative">
          <el-input maxlength="6" placeholder="请输入验证码" v-model="ruleForm.smsCode"></el-input>
          <el-button :disabled="disabled" @click="getCode" class="get-code" type="text">{{ codeText }}</el-button>
        </div>
        <span v-if="errorMsg" class="error-message">{{ errorMsg }}</span>
      </template>
      <template v-slot:checked>
        <div style="text-align: center">
          <el-checkbox v-model="ruleForm.checked">未注册的用户将自动注册，登录即视为您已阅读并同意</el-checkbox>
          <a @click="protocolClick('user')">《用户协议》</a>
          <span>和</span>
          <a @click="protocolClick('privacy')">《隐私政策》</a>
          <!-- <p style="text-align: left">新用户将自动注册</p> -->
        </div>
      </template>
      <template v-slot:loginBtn>
        <el-button
          @click="loginClick"
          round
          style="letter-spacing: 2px; width: 100%; height: 50px; font-size: 18px"
          type="primary"
          >登录</el-button
        >
      </template>
    </sec-form>
  </div>
</template>

<script>
import { smscodeApi, loginApi } from "api";
export default {
  name: "login",
  props: {},
  components: {},
  data() {
    return {
      disabled: false,
      logo: require("@/assets/imgs/logoNew.png"),
      codeText: "获取验证码", //倒计时数字
      timeShow: false,
      errorMsg: "",
      ruleForm: {
        checked: true,
        phoneNumber: "",
        smsCode: "",
      },
      formData: [
        { type: "slot", prop: "phoneNumber" },
        { type: "slot", prop: "smsCode" },
        { type: "custom", prop: "checked" },
        { type: "custom", prop: "loginBtn" },
      ],
      rules: {
        phoneNumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          //校验手机号的正则：/^1[3456789]\d{9}$/
          { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {
    protocolClick(type) {
      const { href } = this.$router.resolve({ path: "/protocol", query: { type } });
      window.open(href, "_blank");
    },
    getCode() {
      this.ruleForm.smsCode = "";
      if (this.getVerify()) {
        this.timer(); //倒计时
        smscodeApi({ phoneNumber: this.ruleForm.phoneNumber }); //获取验证码
      }
    },
    getVerify() {
      let { phoneNumber, checked } = this.ruleForm;
      if (!phoneNumber) {
        this.errorMsg = "请输入手机号";
        return false;
      }
      if (!/^1[3456789]\d{9}$/.test(phoneNumber)) {
        this.errorMsg = "手机号不正确,请重新输入";
        return false;
      }
      if (!checked) {
        this.errorMsg = "请阅读后勾选同意服务条款及隐私政策";
        return false;
      }
      this.errorMsg = "";
      return true;
    },
    loginClick() {
      if (this.getVerify()) {
        let { smsCode, phoneNumber } = this.ruleForm;
        if (!smsCode) {
          this.errorMsg = "请输入验证码";
          return false;
        }
        if (!(smsCode.length === 6 && /^[0-9]*$/.test(smsCode))) {
          this.errorMsg = "请输入正确的验证码";
          return false;
        }
        this.errorMsg = "";
        //后后台请求
        loginApi({ phoneNumber, smsCode }).then((res) => {
          let state = this.message.state(res, ["登录成功", "登录失败"]);
          if (!state) return;
          this.message.success({ message: "登录成功" });
          let { accessToken } = res.data;
          window.localStorage.setItem("accessToken", accessToken);
          this.$emit("loginSuccess");
          this.$EventBus.$emit("loginSuccess"); //登录成功
        });
      }
    },
    // 倒计时方法
    timer() {
      if (this.timeShow) return;
      this.timeShow = true;
      this.time = 60;
      this.disabled = true;
      //17秒后重发
      //短信验证码已发送，可能会有延后，请耐心等待
      var timecount = setInterval(() => {
        this.time--;
        this.codeText = `${this.time}秒后可重新发送`;
        if (this.time < 1) {
          this.codeText = "获取验证码";
          this.disabled = false;
          this.timeShow = false;
          clearInterval(timecount);
        }
      }, 1000);
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.login-logo {
  display: flex;
  justify-content: center;
}
.logo-title {
  text-align: center;

  p:first-child {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 2px;
    font-family: serif;
  }
  p:nth-child(2) {
    letter-spacing: 2px;
    font-size: 0.65em;
    // transform: translateX(0) scale(0.7);
  }
}
.get-code {
  position: absolute;
  right: 10px;
  top: 5px;
}
$height: 45px;
::v-deep .el-input__inner {
  height: $height !important;
  line-height: $height !important;
}
::v-deep .el-form-item__label {
  height: $height !important;
  line-height: $height !important;
}
a {
  color: $themeColor;
}
.sign {
  color: #f56c6c;
  margin-right: 4px;
}
.error-message {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
.el-button.is-disabled {
  color: $themeColor;
}
</style>
