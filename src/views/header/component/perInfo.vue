<template>
  <div class="">
    <div class="upload-photo-box" style="">
      <div class="head-portrait"><img v-if="data.picUrl" :src="data.picUrl" alt="" /> <i v-else class="el-icon-s-custom"></i></div>
      <uploadPhoto></uploadPhoto>
    </div>
    <sec-form :span="12" style="margin-top: 20px" :formData="formData" :ruleForm="ruleForm" :optionData="optionData"></sec-form>
    <div style="text-align: center">
      <el-button @click="saveUserInfo" style="width: 100px" type="primary">保 存</el-button>
    </div>
  </div>
</template>

<script>
import uploadPhoto from "@/views/header/component/uploadPhoto.vue";
import { customerInfoModifyApi } from "api";
export default {
  name: "",
  props: {
    data: Object,
  },
  components: { uploadPhoto },
  data() {
    return {
      optionData: {
        userGender: [
          { label: "男", value: "1" },
          { label: "女", value: "0" },
        ],
      },
      ruleForm: { userName: "", userGender: "", userBirth: "", userAddress: "", userCompany: "", userJob: "", userBusiness: "", phoneNumber: "" },
      formData: [
        { type: "text", label: "昵称", prop: "userName" },
        { type: "text", label: "手机号", prop: "phoneNumber", disabled: true },
        // { type: "text", label: "账号", prop: "account" },
        { type: "select", label: "性别", prop: "userGender" },
        { type: "date", label: "生日", prop: "userBirth" },
        { type: "text", label: "所在地", prop: "userAddress" },
        { type: "text", label: "公司", prop: "userCompany" },
        { type: "text", label: "职位", prop: "userJob" },
        { type: "text", label: "行业", prop: "userBusiness" },
      ],
    };
  },
  computed: {},
  mounted() {
    this.ruleForm = this.data;
  },
  methods: {
    saveUserInfo() {
      let accessToken = localStorage.getItem("accessToken");
      customerInfoModifyApi({ ...this.ruleForm, accessToken }).then((res) => {
        let state = this.message.state(res, ["保存成功", "保存失败"]);
        if (!state) return;
        this.$emit("save");
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.upload-photo-box {
  display: flex;
  align-items: center;
  .head-portrait {
    margin-right: 10px;
    width: 40px;
    height: 40px;
  }
}
.head-portrait {
  width: 40px;
  height: 40px;
  border: 1px solid #dbdbdb;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 20px;
    color: $themeColor;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    padding: 2px;
  }
  &:hover {
    border: 1px solid $themeColor;
    // color: $themeColor;
  }
}
</style>
