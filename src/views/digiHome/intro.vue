<template>
  <div class="role-intro">
    <div class="intro-box">
      <h3>点击选择您要使用的知识库</h3>
      <div class="intro-con">
        <h4>"{{ $attrs.agentName }}"大模型知识库</h4>
        <div class="role-info">
          <img v-if="agentId" :src="`/imgs/${agentId}.jpg`" alt="" />
          <div class="content">{{ intro[agentId] }}</div>
        </div>
        <el-button @click="useRole" type="primary" style="margin-top: 10px; width: 80px" plain>使 用</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      intro: {
        "AGENT-202402171203":
          "精选自中央财经大学等顶尖高校500万字原始语料，为您提供权威的双碳信息与绿色金融最新洞察。无论是政策解读、市场分析还是实践指南，我们为您的绿色发展之旅保驾护航。立即探索，开启智慧绿色未来。",
        "AGENT-202402171204":
          "探索「航运ETS大模型知识库」，您的一站式欧盟ETS规则导航。我们提供专家级对话式服务，从MOHA账户申请到碳排放数据报送，再到核查、交易履约及减排策略，全方位支持您轻松应对欧盟碳排放交易系统的每一步。立即加入，让复杂流程变得简单。",
        "AGENT-202402171205":
          "汇集最新国家政策法规与实践指南，提供从数据发现、分类到增值的全程精准指导。旨在助力企业通过数据资产化实现战略决策与业务增长，成为数据驱动发展的领航者。立即启航，开启数据资产化的增值之旅。",
        "AGENT-202403181348": "DIGICARBON内部实验专用大模型知识库。", //龙马智碳-涌现
        "AGENT-202403181347":
          "集成欧盟碳关税的最新法案，深度解析欧盟碳边界调整机制（CBAM），旨在为企业提供关键策略和实用指南，确保符合欧盟碳排放标准，规避违约风险。通过汇集全球最新法律和政策分析，为企业和出口商提供实时问答服务，从碳关税影响评估到合规策略制定，帮助您优化业务布局，维护市场竞争力。", //
      },
    };
  },
  computed: {
    ...mapState(["agentId"]),
  },
  mounted() {},
  methods: {
    useRole() {
      this.$emit("useRole");
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
$imgSize: 80px;
.role-intro {
  h3 {
    font-size: 25px;
    margin-bottom: 20px;
  }
  .intro-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    h4 {
      font-size: 18px;
      margin: 10px 0;
      padding-left: 80px;
    }
    .intro-con {
      background: #fff;
      min-width: 400px;
      padding: 5px 20px 20px 20px;
      border-radius: 5px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .role-info {
      display: flex;
    }
    .content {
      text-align: left;
      font-size: 14px;
      margin-left: 20px;
    }
    img {
      border-radius: 50%;
      width: $imgSize;
      height: $imgSize;
    }
  }
}
</style>
