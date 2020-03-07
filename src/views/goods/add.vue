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

          <cateSelecter @event1="onPostCid"></cateSelecter>

          <el-form-item v-for="(item,index) in cateAttrs" :key="item.id" :label="item.name" :label-width="formLabelWidth">
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

          <el-form-item label="SKU" :label-width="formLabelWidth">
            <el-table :data="sku">
              <el-table-column label="属性">
                <template v-slot="scope">
                  {{ scope.row.attr_name }}
                </template>
              </el-table-column>
              <el-table-column label="价格">
                <template>
                  <el-input></el-input>
                </template>
              </el-table-column>
              <el-table-column label="划线价格">
                  <template>
                  <el-input></el-input>
                </template>
              </el-table-column>
              <el-table-column label="库存">
                  <template>
                  <el-input></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import cateSelecter from "@/views/cate/cateSelecter";
import { getAttrs } from "@/api/cate";

//主图
const mImgHandler = {
  handleRemove(file, fileList) {
    console.log(file, fileList);
  },
  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  }
};
//图集
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
//属性值
const attrVal = {
  handleClose(target, tag) {
    target.values.splice(target.values.indexOf(tag),1);
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
      if(-1 === item.values.indexOf(inputValue)){
        item.values.push(inputValue);
      }else{
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
    cateSelecter
  },
  data() {
    return {
      formLabelWidth: "120px",
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,

      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: "",
      cateAttrs: [],

      sku: [
        { attr_name: "红-大", price: "100", line_price: "200", count: 2000 },
        { attr_name: "黑-大", price: "100", line_price: "200", count: 2000 },
        { attr_name: "红-小", price: "100", line_price: "200", count: 2000 },
        { attr_name: "黑-小", price: "100", line_price: "200", count: 2000 }
      ],
      form: {
        title: "",
        cateId: ""
      }
    };
  },

  watch:{

    cateAttrs(){
        let allAttrs = [];
        this.cateAttrs.forEach((val,index)=>{
            
        });
    }
  },

  methods: {
    ...mainImgHandler,
    ...mImgHandler,
    ...attrVal,
    onPostCid(val) {
      this.cateId = val;

      getAttrs({ cateId: this.cateId })
        .then(resp => {
          this.cateAttrs = resp.data;
        })
        .catch(err => {});
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
</style>