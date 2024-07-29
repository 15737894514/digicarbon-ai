<template>
  <div class="home">
    <sec-header></sec-header>
    <digiSkeleton v-if="!agentId"></digiSkeleton>
    <div class="sec-contanier" v-else>
      <!-- 角色选择（知识库） -->
      <div class="nav-role">
        <!-- <div class="role-box">
          <div
            :class="{ active: item.agentId === agentId }"
            class="role-list-box"
            v-for="(item, index) in roles"
            :key="index"
            @click="roleSel(item.agentId)"
          >
            <img v-if="agentId" :src="`/imgs/${item.agentId}.jpg`" alt="" />
            <span :title="item.agentName" class="over-ellipsis">{{ item.agentName }}</span>
            <div v-if="item.agentId === agentId" class="role-active"></div>
          </div>
        </div> -->
        <div class="cur-role-box">
          <div class="cur-role">
            <img v-if="agentId" :src="`${selAgentData.agentVersionIcon}`" alt="" />
            <el-tooltip
              popper-class="agent-desc-tooltip"
              effect="light"
              :content="selAgentData.agentVersionName"
              placement="top"
            >
              <!-- <div>{{ agent.agentVersionDesc }}</div> -->
              <span class="over-ellipsis">{{ selAgentData.agentVersionName }}</span>
            </el-tooltip>
            <!-- <span :title="agentName" class="over-ellipsis">{{ selAgentData.agentVersionName }}</span> -->
          </div>
          <div class="sel-agent__btn">
            <el-button size="mini" @click="changeRoleClick" type="primary"
              ><i class="iconfont icon-qiehuan"></i>
              <p>切换</p>
            </el-button>
          </div>
        </div>
        <!-- 话题列表 -->
        <div class="topic-list">
          <el-input
            class="search"
            clearable
            placeholder="搜索历史对话"
            @input="searchInput"
            suffix-icon="el-icon-search"
            v-model="searchVal"
          >
          </el-input>
          <div class="set-up-box" v-if="isLogin">
            <el-button type="primary" @click="setUpTopic()" icon="el-icon-plus">新建对话</el-button>
          </div>
          <div class="topic">
            <div class="title">
              <!-- {{ topicLists.length + 1 }} -->
              <div>话题列表</div>
              <!-- <el-tooltip v-if="isLogin" class="item" effect="dark" content="新建对话" placement="top">
                <el-button @click="setUpTopic()" size="mini" plain icon="el-icon-plus"></el-button>
              </el-tooltip> -->
            </div>
            <ul>
              <li :class="{ active: sessionId === config.sessionDefault }" @click="topicListSel()">
                <i class="iconfont">&#xe710;</i>
                <span>默认话题</span>
                <span class="short-time">临时</span>
              </li>
              <div v-if="isLogin">
                <div v-show="topic.data.length > 0" v-for="(topic, i) in topicData" :key="i" :title="topic.title">
                  <div class="topic-date-title">{{ topic.title }}</div>
                  <li
                    v-for="(item, index) in topic.data"
                    :class="{ active: sessionId === item.sessionId }"
                    :key="index"
                    @click="topicListSel(item)"
                  >
                    <div style="display: flex; align-items: center">
                      <i class="iconfont">&#xe61e;</i>
                      <el-input
                        style="width: 150px"
                        v-if="item.rename"
                        v-model="item.seesionName"
                        @blur="renameBlur(item)"
                      ></el-input>
                      <div :title="item.value" style="width: 170px" v-else class="over-ellipsis">
                        {{ item.seesionName }}
                      </div>
                    </div>
                    <el-dropdown class="opt" @command="handleCommand">
                      <span class="el-dropdown-link"> <i class="el-icon-more"></i> </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="{ command: 'rename', item: item }"
                          ><i class="el-icon-edit"></i>重命名</el-dropdown-item
                        >
                        <el-dropdown-item :command="{ command: 'delete', item: item }"
                          ><i class="el-icon-delete"></i>删除</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </li>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <!-- 角色简介 -->
      <!-- <agentIntro
        @useRole="useRole"
        :agentData="selAgentData"
        :agentName="agentName"
        :agentId="agentId"
        class="ai-intro"
        v-if="introShow"
      ></agentIntro> -->
      <!-- AI对话 -->
      <div class="ai-contanier">
        <digiAi
          ref="digiAi"
          @updateTopic="updateTopic"
          @createTopic="setUpTopic"
          :sessionId="sessionId"
          :agentName="agentName"
          :agentIcon="selAgentData.agentVersionIcon"
          :agentChatDesc="selAgentData.agentVersionChatDesc"
          :questions="selAgentData.agentVersionChatInfo"
        ></digiAi>
      </div>
    </div>
    <agentScene @closeDiaShow="diaShow = false" v-if="diaShow" :data="data" @chang="agentChange"></agentScene>
    <!-- <el-dialog custom-class="agent-group" title="智能体中心" append-to-body :visible.sync="diaShow" width="80%">
      <agentScene v-if="diaShow" :data="data" @chang="agentChange"></agentScene>
    </el-dialog> -->
  </div>
</template>

<script>
import secHeader from "views/header";
import digiAi from "views/digiAi";
import agentIntro from "views/digiHome/intro.vue";
import digiSkeleton from "@/views/digiHome/digiSkeleton";
import agentScene from "./components/agentScene.vue";
import { agentListApi, sessionListApi, sessionAddApi, sessionUpdateApi, sessionDeleteApi, agentListV1Api } from "api";
import moment from "moment";
import { agentIconPath } from "@/utils/config";
let { NODE_ENV } = process.env;
export default {
  name: "home",
  props: {},
  components: { secHeader, digiAi, agentIntro, digiSkeleton, agentScene },
  data() {
    return {
      data: {},
      diaShow: false,
      selAgentData: {},
      activeNames: [0, 1, 2, 3],
      introShow: false, //角色介绍
      topicData: [],
      copyTopicData: [], //暂存使用
      topicLists: [],
      searchVal: "", //搜索会话
      roles: [],
      agentId: "", //角色id
      agentName: "",
      sessionId: "", //会话id  空/默认话题（Session-default）/创建的话题
      isLogin: false,
      logo: require("@/assets/imgs/logo1.jpg"),
    };
  },
  computed: {},
  created() {
    this.isLogin = this.utils.isLogin();
  },
  mounted() {
    this.initPage();
    this.$EventBus.$on("loginSuccess", () => {
      this.isLogin = true;
      this.sessionListByRole(); //获取角色会话列表
    });
  },
  methods: {
    changeRoleClick() {
      if (this.isPending()) return;
      this.diaShow = true;
    },
    agentChange(selAgentData) {
      this.diaShow = false;
      //切换智能体和之前的智能体一样（不做操作）
      console.log(selAgentData.agentId);
      console.log(this.agentId);
      if (selAgentData.agentId === this.agentId) return;
      //未登录 先清空对话数据
      if (!this.utils.isLogin()) {
        this.$refs.digiAi.setEmptyData();
      }
      this.selAgentData = selAgentData;
      this.agentId = selAgentData.agentId;
      // this.isShowIntro();
      this.sessionId = this.getSessionId();
      let agentName = selAgentData.agentVersionName;
      this.agentName = agentName;

      this.$store.commit("setAgentId", this.agentId);
      this.$store.commit("setAgentName", this.agentName);
      window.localStorage.setItem("agentId", this.agentId);
      this.message.success({ message: `已切换到「 ${agentName} 」` });

      // this.$router.push({ path: "/ai", query: { agentId: this.agentId } });
      this.utils.isLogin() && this.sessionListByRole("changeRole");
    },
    //点击使用角色
    useRole() {
      this.introShow = false;
      this.sessionId = this.config.sessionDefault;
    },
    //话题列表选择
    topicListSel(item) {
      if (this.isPending()) return;
      this.sessionId = item ? item.sessionId : this.config.sessionDefault;
      this.introShow = false;
      this.setSessionId();
    },
    //角色选择
    roleSel(agentId) {
      if (this.isPending()) return;
      // this.sessionId = "";
      // this.introShow = true;
      this.agentId = agentId;
      this.isShowIntro();
      this.sessionId = this.getSessionId();
      let agentName = this.roles.find((item) => item.agentId === agentId)?.agentName;
      this.agentName = agentName;

      this.$store.commit("setAgentId", this.agentId);
      this.$store.commit("setAgentName", this.agentName);
      window.localStorage.setItem("agentId", agentId);

      // this.$router.push({ path: "/ai", query: { agentId: this.agentId } });
      this.utils.isLogin() && this.sessionListByRole("changeRole");
    },
    //角色（知识库）介绍是否展示
    isShowIntro() {
      this.sessionId = this.getSessionId();
      console.log("[ this.sessionId ] >", this.sessionId);
      this.introShow = this.sessionId === this.config.sessionDefault ? true : false;
    },
    async initPage() {
      await this.getRoles(); //获取角色数据
      //登录后才有会话列表
      let accessToken = localStorage.getItem("accessToken");
      accessToken && this.agentId && this.sessionListByRole(); //获取角色会话列表
      // if (accessToken) {
      //   this.agentId && this.sessionListByRole(); //获取角色会话列表
      //   this.isShowIntro(); //未登录
      // } else {
      //   this.isShowIntro(); //未登录
      // }
    },
    //获取角色（知识库）
    async getRoles() {
      let env = NODE_ENV === "cn" ? "prod" : "pre";
      await agentListV1Api({ ...this.utils.getComParams(), env }).then((res) => {
        console.log(res);
        this.data = res.data;
        let { data, agentGroup } = this.data;
        if (data?.length > 0) {
          data.forEach((item) => {
            item.agentVersionIcon = `${agentIconPath[NODE_ENV]}${item.agentVersionIcon}`;
          });
          let urlAgentId = this.$route.query.agentId;

          let agentId = urlAgentId || localStorage.getItem("agentId");
          console.log("[ agentId ] >", agentId);
          this.agentId = agentId ? agentId : data[0].agentId;
          let selAgentData = data.find((item) => item.agentId === this.agentId);
          this.selAgentData = selAgentData ? selAgentData : data[0];
          this.agentName = this.selAgentData.agentVersionName;
          this.sessionId = this.getSessionId();

          this.$store.commit("setAgentId", this.agentId);
          this.$store.commit("setAgentName", this.agentName);
        }
      });
      // await agentListApi(this.utils.getComParams()).then((res) => {
      //   let agentList = res.data.agentList;
      //   // this.roles = this.filterRoleByEnv(agentList);
      //   this.roles = agentList;
      //   let agentId = localStorage.getItem("agentId");
      //   this.agentId = agentId ? agentId : this.roles[0].agentId;
      //   this.agentName = this.roles.find((item) => item.agentId === this.agentId)?.agentName;
      //   this.$store.state.roles = this.roles;
      //   this.$store.state.agentId = this.agentId;
      //   this.sessionId = this.getSessionId();

      //   this.$store.commit("setRoles", this.roles);
      //   this.$store.commit("setAgentId", this.agentId);
      //   this.$store.commit("setAgentName", this.agentName);
      //   // this.$router.push({ path: "/ai", query: { agentId: this.agentId } });
      // });
    },
    //通过角色获取会话列表
    sessionListByRole(type) {
      sessionListApi({ ...this.utils.getComParams(), agentId: this.agentId }).then((res) => {
        this.topicLists = res.data.sessionList;

        if (this.topicLists.length === 0) {
          this.$refs.digiAi.setEmptyData();
          this.sessionId = this.config.sessionDefault;
          // this.sessionId = type == "changeRole" ? "" : this.config.sessionDefault;
        } else {
          //默认选择第一个
          if (["create", "delete"].includes(type)) {
            this.sessionId = this.topicLists[0].sessionId;
            this.setSessionId();
          }
          this.$nextTick(() => {
            this.newQuestion && this.$refs.digiAi.sendClick(this.newQuestion);
            this.newQuestion = "";
            if (type === "create") {
              this.$refs.digiAi.setRandomQuestion(this.newQuestion);
            }
          });
        }
        //话题列表 根据时间分类
        //今日、一周内、最近一个月、2024：今年更早的记录
        this.classifyByTime();
        this.copyTopicData = JSON.parse(JSON.stringify(this.topicData));
      });
    },
    classifyByTime() {
      let today = [],
        week = [],
        month = [],
        earlierDate = [];
      this.topicLists.forEach((item) => {
        //跟phython有点差异 后面没有带+0800 (中国标准时间) 解析时间会有偏差
        item.sessionCreateTime = `${item.sessionCreateTime}+0800 (中国标准时间)`;
        let curDate = moment().format("YYYY-MM-DD");
        let curTime = moment().format("YYYY-MM-DD HH:mm:ss");
        let sessionDate = moment(new Date(item.sessionCreateTime).getTime()).format("YYYY-MM-DD");
        let sessionTime = moment(new Date(item.sessionCreateTime).getTime()).format("YYYY-MM-DD HH:mm:ss");
        //计算日期周期
        let diffDay = moment(curTime).diff(moment(sessionTime), "days");
        // let diffMin = moment(curTime).diff(sessionTime), "days"); //days /minute
        //今天
        if (curDate === sessionDate) {
          today.push(item);
        } else if (diffDay < 7) {
          week.push(item);
        } else if (diffDay >= 7 && diffDay < 30) {
          month.push(item);
        } else {
          earlierDate.push(item);
        }
      });
      this.topicData = [
        { title: "今日", data: today },
        { title: "一周内", data: week },
        { title: "最近一个月", data: month },
        { title: "更早的记录", data: earlierDate },
      ];
    },
    handleCommand(data) {
      let { command, item } = data;
      if (command === "delete") {
        this.utils.$confirm({ content: `确定要删除「${item.seesionName}」?` }, () => {
          sessionDeleteApi({
            ...this.utils.getComParams(),
            agentId: this.agentId,
            sessionId: data.item.sessionId,
          }).then((res) => {
            let state = this.message.state(res, ["删除成功", "删除失败"]);
            if (!state) return;
            this.sessionListByRole("delete");
          });
        });
      } else if (command === "rename") {
        this.$set(item, "rename", true);
      }
    },
    //搜索对话列表
    searchInput() {
      if (!this.searchVal) {
        this.topicData = JSON.parse(JSON.stringify(this.copyTopicData));
        return;
      }
      this.topicData.forEach((topic) => {
        topic.data = topic.data.filter((item) => item.seesionName.includes(this.searchVal));
      });
    },
    //新建对话
    setUpTopic(value) {
      if (this.isPending()) return;
      console.log("status", this.$refs.digiAi);
      this.newQuestion = value || ""; //通过他决定新建对话并且直接发送问答
      sessionAddApi({ ...this.utils.getComParams(), agentId: this.agentId, sessionName: value || "默认话题" }).then(
        (res) => {
          this.sessionListByRole("create");
        }
      );
    },
    //重命名
    renameBlur(item) {
      item.rename = false;
      this.updateTopic(item.seesionName, item.sessionId);
    },
    updateTopic(seesionName, sessionId) {
      sessionUpdateApi({
        ...this.utils.getComParams(),
        agentId: this.agentId,
        sessionName: seesionName,
        sessionId: sessionId || this.sessionId,
      }).then((res) => {
        this.sessionListByRole();
      });
    },
    goHome() {
      window.open("https://digicarbon.cn/about");
    },
    setSessionId() {
      let sessionIdKey = `${this.agentId}-sessionId`;
      window.localStorage.setItem(sessionIdKey, this.sessionId);
      // this.$store.commit("setSessionId", this.sessionId);
    },
    getSessionId() {
      let sessionIdKey = `${this.agentId}-sessionId`;
      return localStorage.getItem(sessionIdKey) || this.config.sessionDefault;
    },
    //是否在对话中
    isPending() {
      let status = this.$refs.digiAi?.status;
      console.log("status", status);
      if (status === "pending") {
        this.message.warning({ message: "正在对话中" });
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
//@import url(); 引入公共css类
$roleHeight: 80px;
$roleImgWidth: 50px;
.set-up-box {
  margin: 10px 0;
  .el-button {
    width: 100%;
  }
}
.logo {
  // width: 150px;
  // width: 30px;
  height: 30px;
  // height: 30px;
  cursor: pointer;
  margin: 5px 0 0 5px;

  // margin-right: 2px;
}
.sec-contanier {
  height: 100vh;
  // height: calc(100vh - 50px);
  display: flex;
}
.el-dropdown-menu {
  width: 100px;
}
.el-dropdown-menu__item.active {
  background: rgb(235, 244, 239);
  color: rgb(98, 167, 129);
}
// ::v-deep .el-dropdown-menu__item:not(:last-child) {
//   border-bottom: 1px solid #f1f8fe;
// }
.role-list-box {
  position: relative;
  display: flex;
  cursor: pointer;
  // height: 40px;
  align-items: center;
  padding: 7px 0 7px 5px;
  border-radius: 5px;
  &.active {
    background: rgb(235, 244, 239);
    color: rgb(98, 167, 129);
  }
  span {
    display: inline-block;
    width: 170px;
    text-align: left;
    // background: pink;
  }
  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .role-active {
    position: absolute;
    right: 10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $themeColor;
  }
}
.nav-role::-webkit-scrollbar {
  display: none;
}
.short-time {
  margin-left: 5px;
  padding: 1px 5px;
  color: var(--topicShortTimeColor) !important;
  background: var(--topicShortTimeBg);

  border: 5px;
}
.nav-role {
  flex: none;
  padding: 0 10px;
  width: $navWidth;
  min-width: 200px;
  height: 100%;
  border-right: 1px solid rgb(219, 219, 219);
  box-sizing: border-box;
  text-align: left;
  overflow: auto;
  padding-top: 5px;
  background: var(--asideBg);
  color: var(--asideColor);
  .role-box {
    // padding-top: 10px;
    // height: $roleHeight;
    width: 100%;
    // border-bottom: 1px solid #dbdbdb;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // text-align: center;
    .nav-role-box {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    // img {
    //   // float: left;
    //   width: $roleImgWidth;
    //   height: $roleImgWidth;
    //   border-radius: 50%;
    //   margin-right: 10px;
    // }
    .el-dropdown-link {
      text-align: left;
      .agent-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        .agent-name {
          width: 100px;
        }
      }
      p {
        font-size: 12px;
      }
    }
  }
}
.topic-list {
  // width: 200px;
  // height: calc(100% - #{$roleHeight});
  // height: 100%;
  // padding: 10px;
  // border-right: 1px solid rgb(219, 219, 219);
  box-sizing: border-box;
  // background: #f8f8f8;
  text-align: center;
  overflow: auto;
  .search {
    margin-top: 10px;
    ::v-deep .el-input__inner {
      background-color: var(--asideSearchBg);
      border: var(--asideSearchBorder);
      color: var(--asideSearchColor);
      transition: inherit;
    }
  }
  .topic {
    color: var(--topicColor);
    .title {
      padding: 14px 0;
      text-align: left;
      // box-shadow: 0 2px 6px #f8f8f8;
      color: var(--topicTitleColor);
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    ul {
      li {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        // padding: 8px;
        border-radius: 5px;
        margin-bottom: 5px;
        // &.default {
        //   background: rgba(0, 0, 0, 0.12);
        // }
        &.active {
          background: var(--topicListActiveBg);
        }
        -webkit-transition: background 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        transition: background 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        list-style: none;
        padding: 10px 0;
        text-align: left;

        i {
          margin-right: 5px;
          color: var(--topicColor);
        }
        .opt {
          position: absolute;
          right: 5px;
          top: 12px;
        }
      }
    }
  }
}
.ai-contanier,
.ai-intro {
  background: #f8f8f8;
  flex: 1;
  position: relative;
  padding-top: $headerHeight;
}
.cur-role-box {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // height: 40px;
  font-size: 14px;
  .cur-role {
    display: flex;
    align-items: center;
    span {
      width: 120px;
    }
  }
  .sel-agent__btn {
    .el-button {
      ::v-deep span {
        display: flex;
        align-items: center;
        p {
          font-size: 13px;
        }
        i {
          margin-right: 4px;
          font-weight: 600;
        }
      }
    }
  }
  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
::v-deep .agent-group {
  background: #f8f8f8;
}
.topic-date-title {
  text-align: left;
  color: var(--topicDateTitleColor);
  padding: 10px 0;
  // font-weight: 600;
}
</style>
