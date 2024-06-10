<template>
  <div class="ai-chat-container">
    <div class="ask-content content">
      <img src="/logo.png" alt="" />
      <div class="chat-value-box">
        <div class="chat-value">您好，我是<strong>龙马智碳</strong>大模型知识库，我能实时解答双探问题，是你的智能碳领域助手，快来向我提问吧！</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.ai-chat-container {
  height: calc(100% - 150px);
  padding: 5px 20px 20px 20px;
  overflow: auto;
}
.ask-content {
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: row;
  color: #fff;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px 0;
  &:hover .opt-box {
    display: block;
  }
  img {
    width: 30px;
    height: 30px;
    flex: none;
  }
  .chat-value-box {
    // position: relative;
    display: flex;
    // width: calc(100% - 120px);
    flex-direction: column;
    // align-items: flex-end;
    // padding: 15px 0;

    .chat-value {
      background: #fff;
      color: #080808;
      border-radius: 10px 0 15px 10px;
      padding: 20px 15px;
      letter-spacing: 1px;
      white-space: pre-wrap;
    }
  }
  .opt-box {
    position: absolute;
    top: 5px;
    right: 50px;
    display: none;
  }
}
</style>
