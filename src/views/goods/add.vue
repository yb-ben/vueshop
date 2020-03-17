<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <h2>添加商品</h2>
      </el-header>

      <el-main>
        <el-form >
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="title" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="价格" :label-width="formLabelWidth">
            <el-input v-model="price"  autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="划线价格" :label-width="formLabelWidth">
            <el-input v-model="line_price" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="库存" :label-width="formLabelWidth">
            <el-input v-model="count" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="封面图" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              :action="uploadImageUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
             
            >
              <img v-if="main_image_full" :src="main_image_full" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="图集" :label-width="formLabelWidth">
            <el-upload
              :action="uploadImageUrl"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSucess"
              :on-change="handleSelectImage"
              :auto-upload="false"
              :limit="9"
               ref="mImage"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
            <el-button @click="handleAddImage">上传</el-button>
          </el-form-item>

          <cateSelecter @event1="onPostCid"></cateSelecter>


          <spuComponent></spuComponent>

          <el-form-item label="商品详情" :label-width="formLabelWidth">
               <tinymce v-model="content" :height="300" />
          </el-form-item>

          <el-form-item label=" " :label-width="formLabelWidth">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>

          
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import cateSelecter from "@/views/cate/cateSelecter";
import { getAttrs } from "@/api/cate";
import {addGoods} from "@/api/goods";
import {uploadImageUrl} from "@/api/upload";
import Tinymce from '@/components/Tinymce';
import spuComponent from "@/views/spu/index";
//主图
const mImgHandler = {
  
 handleAvatarSuccess(res, file) {
   console.log(res);
   if(res.code !== 0){
     return false;
   }
    this.main_image = res.data.path;
    this.file_id = res.data.file_id;
    this.main_image_full = URL.createObjectURL(file.raw);
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
//图集
const mainImgHandler = {
  handleRemove(file, fileList) {   
    if(file.response){
        this.mImage.forEach((v,i)=>{
          if(v.url === file.response.data.path){
            this.mImage.splice(i,1);return false;
          }
        });
    }

  },
   handlePictureCardPreview(file) {
     console.log(file);
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  },

  handleSucess(res,file){
    console.log(res,file);
    if(res.code !== 0){
      return false;
    }
    this.mImage.push({url:res.data.path,file_id:res.data.file_id});
  },

  handleAddImage(file,fileList){
    this.$refs.mImage.submit()
  },

  handleSelectImage(file,fileList){
    console.log(file,fileList);
  }
 
};

export default {
  name: "AddGoods",
  components: {
    cateSelecter,Tinymce,spuComponent
  },
  data() {
    return {
      formLabelWidth: "120px",
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      mImage:[],
      uploadImageUrl,
      spu: [],
      content:"",
      sku: [ ],
      cateId:0,
      price:0,
      line_price:0,
      count:0,
      main_image:"",
      main_image_full:null,
      file_id:null,
      title:"",
    };
  },

  watch: {
    cateAttrs() {
      let allAttrs = [];
      this.cateAttrs.forEach((val, index) => {});
    }
  },

  computed: {
    attrLabel() {
      return this.cateAttrs.reduce(function(total, curr) {
        return total + " " + curr.name;
      }, "");
    }
  },

  methods: {
    ...mainImgHandler,
    ...mImgHandler,
    onPostCid(val) {
      //选择分类
      this.cateId = val;
    },

    //添加规格项
    addSpec() {
      this.sku.push({});
    },

    //规格修改
    specAttrChange(v) {
      console.log(v);
    },

    //删除规格
    delSpec(i) {
      console.log(i);
      this.$delete(this.sku, i);
    },

   

    //提交表单
    submitForm(){
      let d = {
        'title':this.form.title,
        'main_image':this.main_image,
        'mImage':this.mImage,
        'cate_id' : this.cateId,
        'attrValues': this.cateAttrs,
        'sku': this.sku,
        'content':this.content
      };
      let t = [];
      d.sku.forEach(function(v){
         if( Object.keys(v).length !== 0){
           t.push(v);
         }
      });
      d.sku = t;
      addGoods(d).then(resp=>{
        if(resp.code === 0){
          this.$message({
            message: '添加成功',
            type: 'success',
            onClose:()=>{
              this.$router.push('/goods/index');
            }
          });
        }
      }).catch(err=>{

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

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.addSpecBtn {
  width: 100%;
  margin-top: 15px;
  text-align: center;
  padding: 5px;
}
.add {
  display: inline-block;
  width: 30px;
  height: 30px;
  transition: color 0.25s;
  position: relative;
}

.add::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20px;
  margin-left: -10px;
  margin-top: -2px;
  border-top: 5px solid;
}

.add::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  height: 20px;
  margin-left: -2px;
  margin-top: -10px;
  border-left: 5px solid;
}
</style>