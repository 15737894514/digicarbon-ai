<template>
  <div class="agent-group__box">
    <div class="agent-group_header">
      <!-- <el-button @click="useRole(agent)" type="primary" style="margin-top: 10px; width: 80px" plain>返回</el-button> -->
      <div class="title">专家智能体中心</div>
    </div>
    <div class="group" v-for="(item, index) in data.agentGroup" :key="index">
      <div class="sec-title">{{ getAgentGroupName(item) }}</div>
      <el-row :gutter="15">
        <el-col
          style="margin-bottom: 15px"
          :xs="24"
          :sm="12"
          :md="12"
          :lg="8"
          :xl="6"
          v-for="(agent, i) in getAgent(item)"
          :key="i"
        >
          <div class="agent-container">
            <div class="agent-box">
              <div class="agent-icon">
                <img :src="agent.agentVersionIcon" alt="" />
              </div>
              <div class="agent-con">
                <div class="agent-name over-ellipsis">{{ agent.agentVersionName }}</div>
                <div class="agent-intro clamp3">
                  <el-tooltip
                    popper-class="agent-desc-tooltip"
                    effect="dark"
                    :content="agent.agentVersionDesc"
                    placement="top"
                  >
                    <div>{{ agent.agentVersionDesc }}</div>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div style="text-align: center; margin-bottom: 10px">
              <el-button @click="useRole(agent)" type="primary" style="margin-top: 10px; width: 80px" plain
                >使 用</el-button
              >
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- <div class="line"></div> -->
    </div>
    <el-tooltip effect="dark" content="返回" placement="top">
      <el-button @click="returnHandle" round class="return" type="primary"><i class="iconfont">&#xe625;</i></el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "",
  props: { data: Object },
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {
    getAgentGroupName(agentGroupId) {
      let { data } = this.data;
      return data.find((item) => item.agentGroupId === agentGroupId)?.agentGroupName;
    },
    getAgent(agentGroupId) {
      let { data } = this.data;
      return data.filter((item) => item.agentGroupId === agentGroupId);
    },
    useRole(agentData) {
      this.$emit("chang", agentData);
    },
    returnHandle() {
      this.$emit("closeDiaShow");
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(newVal) {
        console.log("[ newVal ] >", newVal);
      },
    },
  },
};
</script>
<style scoped lang="scss">
$imgSize: 40px;
$titleFontSize: 14px;
$conFontSize: 12px;
.agent-intro {
  height: 50px;
}
.sec-title {
  font-size: 16px;
  margin: 0 0 10px 0;
}
.agent-group__box {
  position: fixed;
  right: 0;
  bottom: 0;
  left: $navWidth;
  top: 0;
  background: #f8f8f8;
  // background: #fff;
  padding: 10px 100px 30px 100px;
  overflow: auto;
  z-index: 999;
}
.el-col {
  // padding: 20px;
  cursor: pointer;

  .agent-container:hover {
    box-shadow: 0 4px 12px 0 rgba(17, 49, 95, 0.08);
  }
  .agent-container {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.05);
    padding: 15px 10px 2px 10px;
  }
  .agent-box {
    display: flex;
  }

  .agent-icon {
    align-items: center;
    margin-right: 10px;
    img {
      border-radius: 50%;
      width: $imgSize;
    }
  }
  .agent-con {
    font-size: $conFontSize;
    .agent-name {
      font-size: $titleFontSize;
      color: #333;
      font-weight: 600;
      margin-bottom: 5px;
    }
  }
}
.agent-group_header {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  margin: 15px 0;

  .title {
    font-weight: 600;
    font-size: 18px;
  }
}
.return {
  position: absolute;
  right: 40px;
  top: 25px;
  // font-size: 25px;
}
.group {
  margin-bottom: 10px;
  .line {
    height: 1px;
    border: 1px dashed rgba(0, 0, 0, 0.05);
    margin-bottom: 10px;
  }
}
</style>
<style>
.agent-desc-tooltip {
  max-width: 300px;
  font-size: 13px;
  line-height: 1.5;
}
</style>
