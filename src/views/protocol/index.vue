<template>
  <div class="protocol">
    <iframe id="iframeId" :src="src" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      src: "",
      data: {
        user: "/protocal/知识库问答系统_用户协议.html",
        privacy: "/protocal/知识库问答系统_隐私政策.html",
      },
    };
  },
  computed: {},
  mounted() {
    this.src = this.data[this.$route.query.type];
  },
  methods: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.protocol {
  width: 100%;
  height: 100%;
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
}
#iframeId {
  width: 100%;
  height: 100%;
}
</style>
