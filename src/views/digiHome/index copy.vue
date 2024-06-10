<template>
  <div class="home">
    <sec-header></sec-header>
    <div class="sec-contanier">
      <div class="nav-role">
        <el-button @click="roleSel(item, index)" v-for="(item, index) in roles" :key="index" :type="index === selRoleIndex ? 'primary' : ''" round>
          <i class="iconfont"> {{ iconfont(roleIcons[index]) }}</i
          >{{ item.agentName }}</el-button
        >
      </div>
      <div class="topic-list">
        <!-- <el-button icon="el-icon-plus" plain round type="primary" @click="setUpTopic">新建对话</el-button> -->
        <el-input class="search" clearable placeholder="搜索历史对话" @input="searchInput" suffix-icon="el-icon-search" v-model="searchVal">
        </el-input>
        <div class="topic">
          <div class="title">
            <div>话题列表 {{ topicLists.length + 1 }}</div>
            <el-tooltip class="item" effect="dark" content="新建对话" placement="top">
              <el-button @click="setUpTopic()" size="mini" plain icon="el-icon-plus"></el-button>
            </el-tooltip>
          </div>
          <ul>
            <li :class="{ active: sessionId === config.sessionDefault }" @click="topicListSel()">
              <i class="iconfont">&#xe710;</i>
              <span>默认话题</span>
              <span style="margin-left: 5px; padding: 1px 5px; color: #666666 !important; background: rgba(0, 0, 0, 0.06); border: 5px">临时</span>
            </li>
            <li v-for="(item, index) in topicLists" :class="{ active: sessionId === item.sessionId }" :key="index" @click="topicListSel(item)">
              <div style="display: flex; align-items: center">
                <i class="iconfont">&#xe61e;</i>
                <el-input style="width: 150px" v-if="item.rename" v-model="item.seesionName" @blur="renameBlur(item)"></el-input>
                <div :title="item.value" style="width: 140px" v-else class="over-ellipsis">{{ item.seesionName }}</div>
              </div>
              <el-dropdown class="opt" @command="handleCommand">
                <span class="el-dropdown-link"> <i class="el-icon-more"></i> </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ command: 'rename', item: item }"><i class="el-icon-edit"></i>重命名</el-dropdown-item>
                  <el-dropdown-item :command="{ command: 'delete', item: item }"><i class="el-icon-delete"></i>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </div>
      </div>
      <div class="ai-contanier">
        <digiAi :secParams="getParams" :sessionId="sessionId" :agentName="agentName"></digiAi>
      </div>
    </div>
  </div>
</template>

<script>
import secHeader from "views/header";
import digiAi from "views/digiAi";
import { agentListApi, sessionListApi, sessionAddApi, sessionDeleteApi } from "api";
export default {
  name: "home",
  props: {},
  components: { secHeader, digiAi },
  data() {
    return {
      selRoleIndex: 0, //角色选中的下标
      topicLists: [],
      copyTopicLists: [], //暂存使用
      searchVal: "", //搜索会话
      roleIcons: ["&#xe619;", "&#xe61b;", "&#xe63f;"],
      roles: [],
      agentId: "", //角色id
      agentName: "",
      sessionId: "Session-default", //会话id
    };
  },
  computed: {},
  created() {},
  mounted() {
    // this.initPage();
  },
  methods: {
    getParams() {
      let accessToken = localStorage.getItem("accessToken") || "";
      let timestamp = new Date().valueOf();
      let sid = this.utils.createToSign(accessToken, "DigiCarbonAI", timestamp);
      return {
        accessToken,
        sid,
        timestamp,
      };
    },
    async initPage() {
      await this.getRoles(); //获取角色数据
      this.sessionListByRole(); //获取角色会话列表
    },
    async getRoles() {
      await agentListApi(this.getParams()).then((res) => {
        this.roles = res.data.agentList;
        let { agentId } = this.$route.query;
        let { agentName } = this.roles[0];
        this.agentId = agentId ? agentId : this.roles[0].agentId;
        this.agentName = agentName;
        this.$router.push({ path: "/ai", query: { agentId: this.agentId } });
      });
    },
    sessionListByRole() {
      sessionListApi({ ...this.getParams(), agentId: this.agentId }).then((res) => {
        this.topicLists = res.data.sessionList;
        this.copyTopicLists = this.topicLists;
      });
    },
    handleCommand(data) {
      let { command, item } = data;
      if (command === "delete") {
        this.utils.$confirm({ content: `确定要删除「${item.seesionName}」?` }, () => {
          sessionDeleteApi({ ...this.getParams(), agentId: this.agentId, sessionId: data.item.sessionId }).then((res) => {
            let state = this.message.state(res);
            if (!state) return;
            this.sessionListByRole();
          });
        });
      } else if (command === "rename") {
        this.$set(item, "rename", true);
      }
    },
    //搜索对话列表
    searchInput() {
      if (!this.searchVal) {
        this.topicLists = this.copyTopicLists;
        return;
      }
      this.topicLists = this.topicLists.filter((item) => item.seesionName.includes(this.searchVal));
    },
    //新建对话
    setUpTopic(sessionName = "默认话题") {
      sessionAddApi({ ...this.getParams(), agentId: this.agentId, sessionName }).then((res) => {
        this.sessionListByRole();
      });
    },
    topicListSel(item) {
      this.sessionId = item ? item.sessionId : "Session-default";
    },
    renameBlur(item) {
      console.log("[ item ] >", item);
      item.rename = false;
    },
    roleSel(item, index) {
      this.selRoleIndex = index;
      this.agentId = item.agentId;
      this.sessionId = "Session-default"; //初始成默认会话
      let agentName = this.roles.find((item) => item.agentId === this.agentId)?.agentName;
      this.agentName = agentName;

      this.$router.push({ path: "/ai", query: { agentId: this.agentId } });
      this.sessionListByRole();
    },
    //Vue iconfont 编码转换
    iconfont: function (icon) {
      const reg = /(&#x)?(.*)/;
      let iconfontName;
      if (reg.test(icon)) {
        iconfontName = reg.exec(icon)[2];
      }
      return String.fromCharCode(parseInt(iconfontName, 16));
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
//@import url(); 引入公共css类
.sec-contanier {
  height: calc(100vh - 50px);
  display: flex;
}
.nav-role {
  width: 200px;
  height: 100%;
  border-right: 1px solid rgb(219, 219, 219);
  box-sizing: border-box;
  text-align: center;
  .el-button {
    margin-top: 10px;
    width: 80%;
    height: 40px;
    font-size: 16px;
    text-align: left;
    i {
      margin-right: 5px;
    }
  }
}
.topic-list {
  width: 200px;
  height: 100%;
  padding: 10px;
  border-right: 1px solid rgb(219, 219, 219);
  box-sizing: border-box;
  background: #f8f8f8;
  text-align: center;
  .search {
    margin-top: 10px;
  }
  .topic {
    .title {
      padding: 14px 0;
      text-align: left;
      box-shadow: 0 2px 6px #f8f8f8;
      color: #080808;
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
        padding: 8px;
        border-radius: 5px;
        margin-bottom: 5px;
        // &.default {
        //   background: rgba(0, 0, 0, 0.12);
        // }
        &.active {
          background: rgba(0, 0, 0, 0.06);
        }
        -webkit-transition: background 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        transition: background 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        list-style: none;
        padding: 10px 5px;
        text-align: left;
        // &:hover {
        //   background: rgba(0, 0, 0, 0.03);
        // }
        i {
          margin-right: 5px;
        }
        .opt {
          position: absolute;
          right: 5px;
          top: 15px;
        }
      }
    }
  }
}
.ai-contanier {
  background: #f8f8f8;
  flex: 1;
}
</style>
