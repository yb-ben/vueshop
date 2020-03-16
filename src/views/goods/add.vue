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

          <el-form-item label="价格" :label-width="formLabelWidth">
            <el-input v-model="price" autocomplete="off"></el-input>
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
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
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

          <el-form-item
            v-for="(item,index) in cateAttrs"
            :key="item.id"
            :label="item.name"
            :label-width="formLabelWidth"
          >
            <el-tag
              :key="tag"
              v-for="tag in item.values"
              closable
              :disable-transitions="false"
              @close="handleClose(item,tag)"
            >{{tag}}</el-tag>

            <el-input
              class="input-new-tag"
              v-if="cateAttrs[index].inputVisible"
              v-model="cateAttrs[index].inputValue"
              :ref="'saveTagInput'+item.id"
              size="small"
              @keyup.enter.native="handleInputConfirm(item)"
              @blur="handleInputConfirm(item)"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(item)">+ New Tag</el-button>
          </el-form-item>

          <el-form-item
            label="SKU"
            :label-width="formLabelWidth"
            v-if="cateAttrs && cateAttrs.length>0"
          >
            <el-table :data="sku">
              <el-table-column label="属性">
                <template v-slot="scope">
                  <el-select
                    v-for="i in cateAttrs"
                    :key="i.id"
                    v-model="scope.row[i.id]"
                    style="width:120px;margin-right:5px"
                    :placeholder="i.name"
                    @change="specAttrChange(scope.row)"
                  >
                    <el-option v-for="v in i.values" :label="v" :value="v" :key="v"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="价格" width="150">
                <template v-slot="scope">
                  <el-input v-model="scope.row.price"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="划线价格" width="150">
                <template v-slot="scope">
                  <el-input v-model="scope.row.line_price"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="库存" width="150">
                <template v-slot="scope">
                  <el-input v-model="scope.row.count"></el-input>
                </template>
              </el-table-column>

              <el-table-column width="150">
                <template v-slot="scope">
                  <el-button @click="delSpec(scope.$index)" type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button class="addSpecBtn" @click="addSpec" type="primary">
              <div class="add"></div>
            </el-button>
          </el-form-item>

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
//主图
const mImgHandler = {
  
 handleAvatarSuccess(res, file) {
   console.log(res);
   if(res.code !== 0){
     return false;
   }
   this.main_image = res.data.path;
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
    this.mImage.push({url:res.data.path});
  },

  handleAddImage(file,fileList){
    this.$refs.mImage.submit()
  },

  handleSelectImage(file,fileList){
    console.log(file,fileList);
  }
 
};
//属性值
const attrVal = {
  handleClose(target, tag) {
    target.values.splice(target.values.indexOf(tag), 1);
    this.sku = [{}];
    this.$forceUpdate();
    //this.$delete(target.values,target.values.indexOf(tag));
  },

  showInput(target) {
    this.$set(target, "inputVisible", true);

    this.$nextTick(_ => {
      this.$refs["saveTagInput" + target.id][0].$refs.input.focus();
    });
  },

  handleInputConfirm(item) {
    console.log(item);
    let inputValue = item.inputValue;
    if (inputValue) {
      if (!item.values) {
        item.values = [];
      }
      if (-1 === item.values.indexOf(inputValue)) {
        item.values.push(inputValue);
      } else {
        return false;
      }
    }
    item.inputVisible = false;
    item.inputValue = "";
  }
};

export default {
  name: "AddGoods",
  components: {
    cateSelecter,Tinymce
  },
  data() {
    return {
      formLabelWidth: "120px",
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      uploadImageUrl,
      mImage:[],
      inputVisible: false,
      inputValue: "",
      cateAttrs: [],
      content:"",
      sku: [
        {}
      ],
      cateId:0,
      price:0,
      line_price:0,
      count:0,
      main_image:"",
      form: {
        title: "",
        
      }
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
    ...attrVal,
    onPostCid(val) {
      this.cateId = val;
      this.sku = [{}];
      if (!val) {
        this.cateAttrs = [];
      } else {
        getAttrs( this.cateId )
          .then(resp => {
            resp.data.forEach(v => {
              v.values = [];
            });
            this.cateAttrs = resp.data;
          })
          .catch(err => {});
      }
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