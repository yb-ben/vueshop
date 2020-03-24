<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <h2>编辑商品</h2>
      </el-header>

      <el-main>
        <el-form>
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="title" autocomplete="off"></el-input>
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
            <img
              v-if="main_image"
              :src="main_image_full"
              class="avatar"
              @click="visibleImageSelector = true,selectModel = 1"
            />
            <i
              v-if="!main_image"
              class="el-icon-plus avatar-uploader-icon"
              style="border: 1px dashed #c0ccda;border-radius: 6px;"
              @click="visibleImageSelector = true,selectModel = 1"
            ></i>
          </el-form-item>

          <ImageSelector
            v-if="visibleImageSelector"
            :select-mode="selectModel"
            @submit-images="handleSubmitImages"
            :visibleSelector.sync="visibleImageSelector"
          ></ImageSelector>

          <el-form-item label="图集" :label-width="formLabelWidth">
            <div class="mImage-item"  v-for="(v,i) in mImage" :key="v.file_id">
              <img
                v-if="v.url"
                :src="v.url_full"
                class="avatar"
              />
              <i class="el-icon-close" @click="removeImage(i)"></i>
            </div>
            <div style="display:inline-block;vertical-align:top">
              <i
                class="el-icon-plus avatar-uploader-icon"
                style="border: 1px dashed #c0ccda;border-radius: 6px;"
                @click="visibleImageSelector = true,selectModel = 2"
              ></i>
            </div>
          </el-form-item>

          <cateSelecter v-if="cateId" @event1="onPostCid" :message="cateId"></cateSelecter>

          <spuComponent v-if="cacheResp" ref="spuComponent" :initResp="cacheResp"></spuComponent>

          <el-form-item label="上架时间" :label-width="formLabelWidth">
            <el-radio-group v-model="up_status" @change="onUpStatusChange">
              <el-radio :label="0">暂不上架</el-radio>
              <el-radio :label="1">立即上架</el-radio>
              <el-radio :label="3">定时上架</el-radio>
            </el-radio-group>
            <el-date-picker
              v-if="up_status === 3"
              v-model="up_at"
              type="datetime"
              placeholder="选择日期时间"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="限购" :label-width="formLabelWidth">
            <el-checkbox :label="1" @change="onLimitChange" :checked="(limit && limit[0])?true:false">限制每人可购买数量</el-checkbox>
            <div>
              <el-radio-group v-if="limit" v-model="limit[0].type" >
                <el-row style="margin-bottom:10px">
                  <el-radio :label="1">
                    终身限购
                    <el-input-number v-model="limit[0].count" :min="1"></el-input-number>
件
                  </el-radio>
                </el-row>
                <el-row style="margin-bottom:10px">
                  <el-radio :label="2">
                    按周期限购
                    <el-select v-model="limit[0].circle" style="width:100px">
                      <el-option :value="1" label="每天"></el-option>
                      <el-option :value="2" label="每周"></el-option>
                      <el-option :value="3" label="每月"></el-option>
                    </el-select>
                    <el-input-number v-model="limit[0].circle_count" :min="1"  label="描述文字"></el-input-number>
件
                  </el-radio>
                </el-row>
              </el-radio-group>
            </div>
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
import { getCateList } from "@/api/cate";
import { editGoods, detail, attrs, values } from "@/api/goods";
import { uploadImageUrl } from "@/api/upload";
import Tinymce from "@/components/Tinymce";
import spuComponent from "@/views/spu/index";
import ImageSelector from "@/views/imageSelector";



export default {
  name: "EditGoods",
  components: {
    cateSelecter,
    Tinymce,
    spuComponent,
    ImageSelector
  },
  data() {
    return {
      formLabelWidth: "120px",
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      mImage: [],
      uploadImageUrl,
      visibleImageSelector: false,
      cacheResp: null,
      selectModel: 1,

      content: "",
      id: 0,
      cateId: 0,
      price: 0,
      line_price: 0,
      count: 0,
      main_image: "",
      main_image_full: null,
      file_id: null,
      title: "",
      up_at: null,
      status: 0,
      up_status: 0,
      least: 1,
      limit: null
    };
  },

  watch: {
    cateAttrs() {
      let allAttrs = [];
      this.cateAttrs.forEach((val, index) => {});
    }
  },

  created() {
    let t = null;
    //获取商品详细信息和属性列表
    Promise.all([detail(this.$route.params.id)]).then(res => {
      let d0 = res[0].data;
      this.id = d0.id;
      this.cacheResp = d0;
      this.cateId = res[0].data.cate_id;
      this.title = d0.title;
      this.price = d0.price;
      this.line_price = d0.line_price;
      this.main_image = d0.main_image;
      this.main_image_full = d0.main_image_full;
      this.file_id = d0.file_id;
      this.content = d0.content.content;
      this.count = d0.count;

      this.mImage = d0.gallery;
      this.status = d0.status;
      this.up_at = d0.up_at?d0.up_at*1000:d0.up_at;
      this.limit = d0.limit;
      this.up_status = (d0.up_at && d0.status === 0)?3:d0.status
    });
  },

  computed: {
    attrLabel() {
      return this.cateAttrs.reduce(function(total, curr) {
        return total + " " + curr.name;
      }, "");
    }
  },

  methods: {
    
        removeImage( i) {
      //移除图片
        this.mImage.splice(i,1);
    },

    
    onLimitChange(v) {
      //限购
      if (v) {
        this.limit = [
          {
            type: 1,
            count: null,
            circle: 1,
            circle_count:1,
          }
        ];
      } else {
        this.limit = null;
      }
    },

    // onLeastBlur() {
    //   this.least || (this.least = 1);
    // },

    onUpStatusChange(v) {
      //上架方式变更
      if (v === 3) {
        this.status = 0;
      } else {
        this.status = v;

        this.up_at = null;
      }
    },


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

    handleSubmitImages(val) {
      //主图选择
      console.log(val);
      if (val) {
        if (this.selectModel === 1) {
          this.main_image_full = val[0].url_full;
          this.main_image = val[0].url;
          this.file_id = val[0].id;
        } else if (this.selectModel === 2) {
          if(val.length + this.mImage.length < 10){
          
          val.forEach(v=>{
            this.mImage.push({ file_id: v.id, url: v.url , url_full:v.url_full});
          });
       
          }else{
            this.$message({message:'图集不能超过9张',type:'error',duration:1000});
          } 
          }
      }
    },

    //提交表单
    submitForm() {
      let t = this.$refs.spuComponent;

      let a = [];
      if (t.cacheValidAttrs) {
        t.cacheValidAttrs.forEach(x => {
          let vals = [];
          x.values.forEach(v => {
            if (t.isAddSPUImg) {
              vals.push({
                v: v.v,
                v_id: v.v_id,
                path: v.path,
                file_id: v.file_id
              });
            } else {
              vals.push({ v: v.v, v_id: v.v_id });
            }
          });
          a.push({ k: x.k, k_id: x.k_id, values: vals });
        });
      }

      let d = {
        id: this.id,
        title: this.title,
        main_image: this.main_image,
        mImage: this.mImage,
        cate_id: this.cateId,
        price: this.price,
        line_price: this.line_price,
        file_id: this.file_id,
        content: this.content,
        count: this.count,
        code: "",
        how: 1,
        sku: t.spu,
        spu: a,
        up_at: this.up_at?this.up_at/1000:this.up_at,
        status: this.status,
        limit : this.limit
      };

      editGoods(d)
        .then(resp => {
          if (resp.code === 0) {
            this.$message({
              message: "保存成功",
              type: "success",
              onClose: () => {
                this.$router.push("/goods/index");
              }
            });
          }
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

.mImage-item{
  display: inline-block;
  position: relative;
  margin-right:10px;
}


i.el-icon-close {
  position: absolute;
  color: #ffffff00;
  padding: 2px;
  border-radius: 10px;
  right: 0px;
  top: 0px;
}

i.el-icon-close:hover {
  background-color: #aaa;
  color: white;
}
</style>