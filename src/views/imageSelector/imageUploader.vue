<template>
  <el-upload
    ref="imageUploader"
    class="avatar-uploader"
    :action="uploadImageUrl"
    :show-file-list="false"
    :auto-upload="false"
    :on-success="handleAvatarSuccess"
    :on-change="handleChange"
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
      path_full: "",
      file_id: "",
      path: "",
      allowFileSize: 0,
      allowFileType: null
    };
  },

  created() {
    console.log(this.getAllowFileSize);
    this.allowFileSize = this.getAllowFileSize;
    this.allowFileType = this.getAllowFileType;
  },

  computed: {
    getAllowFileSize() {
      return this.$store.getters.allowFileSize;
    },

    getAllowFileType() {
      return this.$store.getters.allowFileType;
    }
  },

  methods: {
    handleAvatarSuccess(res, file) {
      this.path = res.data.path;
      this.file_id = res.data.file_id;
      this.path_full = res.data.path_full;
      this.sendMsg();
    },
    beforeAvatarUpload(file) {
    
    },

    handleChange(file) {
      console.log(file);
      const a = this.allowFileType.indexOf(file.raw.type) === -1;
      const b = file.size > this.allowFileSize;

      if (a) {
        this.$message.error(
          "上传头像图片只能是" + this.allowFileType.join(" ") + " 格式!"
        );
      } else if (b) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      } else {
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },

    submitUpload() {
      this.$refs.imageUploader.submit();
    },

    sendMsg() {
      this.$message({message:"上传成功",type:'success',duration:1500});
      this.$refs.imageUploader.clearFiles();
      this.file_id = this.path = this.path_full= "";
      this.imageUrl = "";
     
      this.$emit("upload-image", {
        file_id: this.file_id,
        path: this.path,
        path_full: this.path_full
      });
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