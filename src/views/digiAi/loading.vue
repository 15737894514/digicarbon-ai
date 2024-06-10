<template>
  <div class="spinner-ai">
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <!-- <div class="rect4"></div>
    <div class="rect5"></div> -->
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
<style scoped lang="scss">
/* 等待动画 */
.spinner-ai {
  margin: 0;
  /* width: 50px; */
  margin-left: 10px;
  height: 20px;
  text-align: left;
  font-size: 10px;
  display: flex;
}
.spinner-ai::after {
  content: "等待片刻，高质量的答案需要深度思考...";
  margin-left: 8px;
  font-size: 14px;
}
.spinner-ai > div {
  background-color: $themeColor;
  height: 100%;
  width: 6px;
  /* border-radius: 50%; */
  display: inline-block;
  margin-right: 2px;
  -webkit-animation: stretchDelay 1.2s infinite ease-in-out;
  animation: stretchDelay 1.2s infinite ease-in-out;
}

.spinner-ai .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner-ai .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.spinner-ai .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner-ai .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchDelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }

  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes stretchDelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>
