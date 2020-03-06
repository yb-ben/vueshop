<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <h2>添加商品</h2>
      </el-header>

      <el-main>
        <el-form :model="form">
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="封面图" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="图集" :label-width="formLabelWidth">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>

        <cateSelecter></cateSelecter>
          
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import cateSelecter from "@/views/cate/cateSelecter";

const mImgHandler = {
  handleRemove(file, fileList) {
    console.log(file, fileList);
  },
  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  }
};

const mainImgHandler = {
  handleAvatarSuccess(res, file) {
    this.imageUrl = URL.createObjectURL(file.raw);
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
  }
};

export default {
  name: "AddGoods",
  components:{
      cateSelecter
  },
  data() {
    return {
      formLabelWidth: "120px",
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      form: {
        title: ""
      }
    };
  },

  methods: {
    ...mainImgHandler,
    ...mImgHandler
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