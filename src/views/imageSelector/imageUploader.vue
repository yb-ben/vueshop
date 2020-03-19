<template>
  <el-upload

    class="avatar-uploader"
    :action="uploadImageUrl"
    :show-file-list="false"
    :auto-upload="true"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { uploadImageUrl } from "@/api/upload";
export default {
  data() {
    return {
      uploadImageUrl,
      imageUrl: "",
      path_full:"",
      file_id : "",
      path:"",
    };
  },

  methods: {
    handleAvatarSuccess(res, file) {
         this.path = res.data.path;
         this.file_id = res.data.file_id;
         this.path_full = res.data.path_full;
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(1);
        this.sendMsg();    
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // submitUpload() {
    //     this.$refs.upload.submit();
    //   },

    sendMsg(){
        console.log('upload-image')
        this.$emit('upload-image',{file_id:this.file_id ,path:this.path,path_full:this.path_full});
    }

  }
};
</script>



<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>