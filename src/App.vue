<template>
  <div id="app">
    <router-view />
    <el-popover class="add-group" placement="left" width="100" trigger="hover">
      <div style="text-align: center; margin-bottom: 5px">扫码加入社群</div>
      <div class="center">
        <img class="group-img" :src="require('@/assets/group.jpg')" alt="" />
      </div>
      <el-button size="medium" circle plain type="primary" slot="reference">
        <i class="iconfont">&#xe6a0;</i>
      </el-button>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.add-group {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.group-img {
  width: 100px;
  margin: 0 auto;
}
.el-button {
  i {
    font-size: 20px;
  }
}
</style>
