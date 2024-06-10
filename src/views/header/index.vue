<template>
  <header>
    <div class="left">
      <img @click="goHome" class="logo" :src="logo" alt="" />
      <!-- <div class="logo-title">
        <p>中财数碳</p>
        <p>DIGICARBON</p>
      </div> -->
    </div>
    <div class="right">
      <!-- <div class="home list" @click="goHome">
        <i class="iconfont">&#xe600;</i>
        <span>公司官网</span>
      </div>
      <div class="shipping list" @click="goEts">
        <i class="iconfont">&#xe61b;</i>
        <span>航运碳税服务</span>
      </div> -->
      <el-link
        href="https://fbtlbah76l.feishu.cn/wiki/AVVowsD9Ui4sDVkBDlecb19Pnph?from=from_copylink"
        style="margin-right: 15px"
        :underline="false"
        type="primary"
        target="_blank"
        >产品手册</el-link
      >
      <div class="account">
        <el-dropdown @command="handleCommand" v-if="isLogin">
          <div class="head-portrait">
            <img v-if="userData.picUrl" :src="userData.picUrl" alt="" />
            <i v-else class="el-icon-s-custom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <div class="tel">{{ userData.phoneNumber }}</div>
            <el-dropdown-item command="perInfo"><i class="el-icon-user"></i>个人资料</el-dropdown-item>
            <el-dropdown-item command="feedback"><i class="el-icon-message"></i>我要反馈</el-dropdown-item>
            <el-dropdown-item command="logout"><i class="iconfont">&#xe631;</i>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button v-else type="primary" @click="login" plain>登录/注册</el-button>
      </div>
    </div>
    <!-- 登录界面 -->
    <el-dialog
      :z-index="1000"
      :close-on-click-modal="false"
      title=""
      :visible.sync="loginDiaShow"
      append-to-body
      width="520px"
    >
      <secLogin @loginSuccess="loginSuccess" v-if="loginDiaShow"></secLogin>
    </el-dialog>
    <el-dialog :z-index="1000" title="感谢您的反馈" :visible.sync="fdDiaShow" append-to-body width="40%">
      <el-input type="textarea" :rows="6" placeholder="想要了解什么知识？欢迎向我们提出需求！" v-model="feedbackVal">
      </el-input>
      <div style="text-align: center; margin: 20px 0 0 0">
        <el-button size="medium" type="primary" @click="submitFeedback" style="width: 100px">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog :z-index="1000" title="设置个人资料" :visible.sync="perDiaShow" append-to-body width="60%">
      <digi-per-info @save="perDiaShow = false" :data="userData" v-if="perDiaShow"></digi-per-info>
    </el-dialog>
  </header>
</template>

<script>
import digiPerInfo from "./component/perInfo.vue";
import secLogin from "views/login";
import { logoutApi, customerInfoApi, feedbackApi } from "api";
import { mapState } from "vuex";
export default {
  name: "secHeader",
  props: {},
  components: { digiPerInfo, secLogin },
  data() {
    return {
      logo: require("@/assets/imgs/logoNewAlign.png"),
      loginDiaShow: false,
      perDiaShow: false,
      fdDiaShow: false,
      feedbackVal: "",
      isLogin: false,
      userData: {},
    };
  },
  computed: {
    ...mapState(["roles"]),
  },
  mounted() {
    //无效的token
    this.$EventBus.$on("voidToken", () => {
      // this.loginDiaShow = true;
      // this.reset();
      localStorage.setItem("accessToken", "");
      window.location.reload();
      // this.isLogin = false;
    });
    this.$EventBus.$on("goLogin", () => {
      this.loginDiaShow = true;
    });
    //上传头像成功的回调
    this.$EventBus.$on("uploadPicSuccess", () => {
      this.getUserInfo();
    });
    this.isLogin = this.utils.isLogin();
    this.isLogin && this.getUserInfo(); //获取用户信息
  },
  methods: {
    getUserInfo() {
      let accessToken = window.localStorage.getItem("accessToken");
      customerInfoApi({ accessToken }).then((res) => {
        this.userData = res.data || {};
        this.$store.commit("setUserData", this.userData);
      });
    },
    loginSuccess() {
      this.loginDiaShow = false;
      this.isLogin = this.utils.isLogin();
      this.getUserInfo();
    },
    handleCommand(command) {
      if (command === "feedback") {
        this.fdDiaShow = true;
      } else if (command === "perInfo") {
        this.perDiaShow = true;
      } else if (command === "logout") {
        this.utils.$confirm({ content: "确定要退出系统吗" }, () => {
          let accessToken = window.localStorage.getItem("accessToken");
          logoutApi({ accessToken }).then((res) => {
            let state = this.message.state(res, ["退出登录成功"]);
            if (!state) return;
            // this.reset();
            localStorage.setItem("accessToken", "");
            window.location.reload();
          });
        });
      }
    },
    reset() {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("agentId", "");
      localStorage.setItem("sessionId", "");
      this.roles.forEach((item) => {
        let sessionIdKey = `${item.agentId}-sessionId`;
        localStorage.setItem(sessionIdKey, "");
      });
      localStorage.setItem("userInfo", "");
    },
    goHome() {
      window.open("https://digicarbon.cn/about");
    },
    goEts() {
      window.open("http://ets.digicarbon.cn/");
    },
    login() {
      this.loginDiaShow = true;
    },
    submitFeedback() {
      if (!this.feedbackVal) {
        this.message.warning({ message: "请输入内容" });
        return;
      }
      feedbackApi({ ...this.utils.getComParams(), feedback: this.feedbackVal }).then((res) => {
        let state = this.message.state(res, ["反馈成功", "反馈失败"]);
        if (!state) return;
        this.feedbackVal = "";
        this.fdDiaShow = false;
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
header {
  position: fixed;
  left: $navWidth;
  right: 0;
  color: rgb(51, 51, 51);
  // background: #fff;
  height: $headerHeight;
  // box-shadow: rgb(219, 219, 219) 0px 1px 0px;
  // border-bottom: 1px solid rgb(219, 219, 219);
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  z-index: 100;
  .left {
    display: flex;
    justify-content: center;
    // align-items: center;
    padding-top: 5px;
    // width: 200px;
    height: 100%;
    font-size: 12px;
    overflow: hidden;
    margin-left: 20px;
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
  .logo {
    // width: 150px;
    height: 25px;
    cursor: pointer;
    margin-top: 5px;
  }
  .right {
    display: flex;
    align-items: center;
    margin-right: 20px;
    .list {
      margin-right: 15px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      font-size: 14px;
      i {
        font-size: 18px;
        color: $themeColor;
        margin-left: 5px;
      }
    }
  }
}
.head-portrait {
  width: 35px;
  height: 35px;
  border: 1px solid #dbdbdb;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 20px;
    color: $themeColor;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    padding: 2px;
  }
  &:hover {
    border: 1px solid $themeColor;
    // color: $themeColor;
  }
}
.tel {
  text-align: center;
  padding: 5px 0;
}
</style>
