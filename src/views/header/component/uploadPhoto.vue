<template>
  <div class="upload-photo">
    <el-button size="mini" plain type="primary" @click="dialogVisible = true">上传头像</el-button>
    <avatar-cropper :dialogVisible.sync="dialogVisible" @closeAvatarDialog="uploadFile"></avatar-cropper>
    <!-- <el-upload :http-request="uploadFile" action="string" :show-file-list="false" accept=".jpg,.jpeg,.png">
      <el-button size="mini" plain type="primary">点击上传</el-button>
    </el-upload> -->
  </div>
</template>

<script>
import { picUploadApi } from "api";
import avatarCropper from "@/components/avatarCropper";
export default {
  name: "",
  props: {},
  components: { avatarCropper },
  data() {
    return {
      dialogVisible: false,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    uploadFile(item) {
      let accessToken = localStorage.getItem("accessToken");
      let fileObj = item;
      const form = new FormData(); // FormData 对象
      form.append("pic", fileObj); // 文件对象  'upload'是后台接收的参数名
      form.append("accessToken", accessToken);
      picUploadApi(form).then((res) => {
        if (res.code === 0) {
          this.message.success({ message: "头像上传成功" });
          this.$EventBus.$emit("uploadPicSuccess");
        } else {
          this.message.warning({ message: "头像上传失败" });
        }
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
// ::v-deep .el-upload-list {
//   display: none;
// }
</style>
