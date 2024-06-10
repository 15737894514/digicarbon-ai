<template>
  <div class="ai-chat-container-default">
    <div class="ai-content content">
      <img v-if="agentId" :src="`/imgs/${agentId}.jpg`" alt="" />
      <div class="ai-value-box">
        <div class="chat-value">
          <h4>{{ dataH3 }}</h4>
          <p>{{ data[agentId]["intro"][1] }}</p>
          <p>{{ data[agentId]["intro"][2] }}</p>
        </div>
        <div v-if="data[agentId]['tryIntro']" class="random-text">
          不知道怎么开始？试一下“<span @click="requireNewChange(data[agentId]['tryIntro'])">{{
            data[agentId]["tryIntro"]
          }}</span
          >”
        </div>
        <div v-if="!hideChange.includes(agentId)" class="new-change">
          <div class="">
            <i class="iconfont">&#xe601;</i> <strong>{{ value }}</strong>
          </div>
          <div @click="requireNewChange()" class="require-data">单击获取今日双碳商机，把握一手市场动向</div>
          <div style="margin-top: 5px; color: #666; font-size: 12px">关注公众号“小碳”，获取更多一手双碳资讯！</div>
        </div>
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
      dataH3: "",
      value: "今日双碳商机",
      hideChange: ["AGENT-202402171204", "AGENT-202402171205", "AGENT-202403181347", "AGENT-202403181348"], //隐藏碳商机
      data: {
        //龙马智碳
        "AGENT-202402171203": {
          intro: [
            `你好，我是{agentName}大模型知识库`,
            "一个专家级智能碳交易助理，集成了CCER/CEA最新政策、指南和方法学",
            "关于CCER/CEA的任何问题，随时问我，越难越好。",
          ],
          tryIntro: "帮我随机生成5个关于CCER或CEA的问题",
        },
        //航运ETS专家
        "AGENT-202402171204": {
          intro: [
            `欢迎来到{agentName}大模型知识库`,
            "从MOHA开户到碳费定价或减排履约，我能实时解答航运ETS相关问题，帮助您轻松应对欧盟ETS规则。问题越难，我越强！",
            // "让合规变得更简单，立即开始您的绿色航运之旅吧！",
          ],
          tryIntro: "从知识库中帮我随机生成5个关于MOHA的问题",
        },
        //数据资产专家
        "AGENT-202402171205": {
          intro: [
            `你好，我是{agentName}大模型知识库`,
            "一个数字技术和财务会计交叉领域的资深专家，集成了最新的数据资产政策法规文献",
            "无论是战略决策还是业务增长，我都能为您提供精准指导。问题越难，我越强！",
          ],
          tryIntro: "帮我随机生成5个关于数据资产化问题",
        },
        //龙马智碳-涌现
        "AGENT-202403181348": {
          intro: ["你好！我是{agentName}，DIGICARBON内部专属测试知识库。", "快来向我提问吧！"],
          tryIntro: "",
        },
        //欧盟碳关税专家
        "AGENT-202403181347": {
          intro: [
            "欢迎使用「{agentName}」知识库，您的即时CBAM合规顾问。",
            "可能没有人比我更懂CBAM规则，您可以在这里获得关于欧盟碳边界调整机制的最新信息和解答，助您迅速应对合规挑战。问题越难，我越强！",
            // "快来向我提问吧！",
          ],
          tryIntro: "帮我随机生成5个关于CBAM填报的问题",
        },
      },
    };
  },
  computed: {
    ...mapState(["agentId"]),
  },
  mounted() {},
  methods: {
    requireNewChange(value) {
      this.$emit("getNewTopic", value || this.value);
    },
  },
  watch: {
    "$attrs.agentName": {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (this.data[this.agentId]) {
          let dataH3 = this.data[this.agentId]["intro"][0];
          this.dataH3 = dataH3.replace("{agentName}", newVal);
        }

        // console.log("agentName", newVal);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.random-text {
  padding: 0 15px;
  span {
    color: $themeColor;
    cursor: pointer;
  }
}
.ai-content {
  position: relative;
  width: 100%;
  display: flex;
  //   flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  margin-top: 20px;

  &:hover .opt-box {
    display: block;
  }
  .ai-value-box {
    position: relative;
    background: #f0f1f5;
    color: #333;
    width: calc(100% - 120px);
    padding: 20px 0;
    .chat-value {
      background: #f0f1f5;
      padding: 0 15px 10px 15px;
      border-radius: 0 15px 5px 5px;
      letter-spacing: 1px;
      white-space: pre-wrap;
      min-width: 120px;
      ::v-deep ol {
        padding-left: 18px;
      }
      // h3 {
      //   font-size: 25px;
      //   margin-bottom: 10px;
      // }
      p:nth-child(2) {
        text-align: left;
        font-size: 13px;
        margin: 5px 0;
      }
      p:nth-child(3) {
        font-size: 12px;
        color: #666;
      }
    }
    .sign {
      display: inline-block;
      width: 10px;
      height: 4px;
      background: $themeColor;
    }
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .opt-box {
    position: absolute;
    left: 50px;
    top: -15px;
    display: none;
  }
}
.new-change {
  padding: 10px 15px 0 15px;
  i {
    color: #f7c859;
  }
  .require-data {
    cursor: pointer;
    color: $themeColor;
    margin-top: 2px;
  }
}
</style>
