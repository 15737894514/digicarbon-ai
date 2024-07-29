<template>
  <div class="ai-chat-container-default">
    <div class="ai-content content">
      <img v-if="agentId" :src="$attrs.agentIcon" alt="" />
      <div class="ai-value-box">
        <div class="chat-value" v-html="$attrs.agentChatDesc"></div>
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
      value: "今日双碳商机",
    };
  },
  computed: {
    ...mapState(["agentId"]),
  },
  mounted() {},
  methods: {
    initEvent() {
      // let that = this;
      document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (event) => {
          let href = "";
          let attributes = event.currentTarget.attributes;
          //获取a标签的href内容
          for (let key in attributes) {
            let name = attributes[key].name;
            if (name === "href") {
              //正确格式必须是https:// 或者http://开头的合法链接地址
              href = attributes[key].value;
            }
          }

          if (href) {
            if (/^https?:\/\//.test(href)) {
              window.open(href);
            } else {
              this.requireNewChange(href);
            }
          } else {
            console.warn("没找到这个a标签href属性");
          }
          event.preventDefault();
        });
      });
    },
    requireNewChange(value) {
      console.log(value);
      this.$emit("getNewTopic", value || this.value);
    },
    formatHtmlStr() {
      let htmlContent = this.$attrs.agentChatDesc;
      // 假设这是你的富文本内容，包含多个<a>标签
      //   let htmlContent = `
      //   <p>这是一段包含多个链接的富文本。</p>
      //   <p>链接1：<a href="https://example.com/1">示例1</a></p>
      //   <p>链接2：<a href="https://example.com/2">示例2</a></p>
      //   <p>链接3：<a href="https://example.com/3">示例3</a></p>
      // `;
      // 使用正则表达式匹配所有<a>标签，并捕获href属性和标签内的文本
      const regex = /<a[^>]*\shref="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
      let match;
      let linksInfo = [];

      // 循环匹配所有结果
      while ((match = regex.exec(htmlContent)) !== null) {
        // match[1] 是href属性，match[2] 是<a>标签内的文本
        console.log("match", match);
        linksInfo.push({
          href: match[1],
          text: match[2],
        });
      }
      this.linksInfo = linksInfo;
      // 打印提取的链接信息
      console.log(linksInfo);
    },
  },
  watch: {
    agentId: {
      deep: true,
      immediate: true,
      handler(newVal) {
        // this.formatHtmlStr();
        this.$nextTick(() => {
          this.initEvent();
        });
      },
    },
    // "$attrs.agentChatDesc": {
    //   deep: true,
    //   immediate: true,
    //   handler(newVal) {},
    // },
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
      line-height: 1.5;
      min-width: 120px;
      ::v-deep ol {
        padding-left: 18px;
        margin-top: 10px;
      }
      ::v-deep ul {
        padding-left: 14px;
        margin-top: 10px;
      }
      ::v-deep p {
        margin: 5px 0;
      }
      ::v-deep a {
        color: $themeColor;
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
