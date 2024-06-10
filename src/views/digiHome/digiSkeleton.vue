<template>
  <div class="">
    <el-container>
      <el-aside style="" width="200px"><el-skeleton :rows="6" animated /></el-aside>
      <el-main style="margin: 0 10px">
        <el-skeleton :rows="6" animated />
      </el-main>
    </el-container>
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
.el-aside {
  padding: 20px 10px 0 10px;
  border-right: 1px solid #dbdbdb;
  height: calc(100vh - 50px);
}
.el-main {
  position: absolute;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
