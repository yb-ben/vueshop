<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      @close="onDialogClose"
      @closed="onClosed"
      title="图片选择"
     
    >
      <div v-if="nowPage === 'imageUpload'" slot="title" class="header-title">
        <el-page-header @back="jumpToHome" content="图片选择"></el-page-header>
      </div>

      <div v-if="nowPage === 'home'">
        <el-tabs v-model="activeName" >
          <el-tab-pane label="图片选择" name="image">
            <el-row>
              <el-col :span="24">
                <el-button @click="jumpToImageUpload">图片上传</el-button>
                <div class="grid-content bg-purple-dark"></div>
              </el-col>
            </el-row>

            <el-row>
              <div
                style="display:inline-block;position:relative"
                v-for="img in imageSet"
                :key="img.id"
              >
                <el-image
                  class="image-item"
                  :class="img.selected? 'image-item-selected':''"
                  :src="img.url_full"
                  @click="onSelectImage(img)"
                ></el-image>
                <i v-show="img.selected" class="el-icon-check selectedIcon"></i>
              </div>

              <el-pagination
                background
                layout="prev, pager, next"
                :total="lastResp ? lastResp.total :0"
                @prev-click="onPageChange"
                @next-click="onPageChange"
                @current-change="onPageChange"
              ></el-pagination>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div v-if="nowPage === 'imageUpload'">
        <el-form label-width="120px">
          <el-form-item label="网络图片">
            <el-input v-model="networkImageUrl" style="width: 80%"></el-input>

            <el-button>提取</el-button>
          </el-form-item>

          <el-form-item label="本地图片">
            <imageUploader @upload-image="getUploadImage" ref="iu"></imageUploader>
          </el-form-item>

          <el-form-item>
            <el-button @click="submitUpload">确定</el-button>
          </el-form-item>
        </el-form>
      </div>

      <span v-if="nowPage === 'home'" slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { uploadImageUrl, imageList } from "@/api/upload";
import imageUploader from "./imageUploader";

export default {
  name: "ImageSelector",
  props: ["selectMode", "visibleSelector"],
  components: {
    imageUploader
  },
  data() {
    return {
      imageUrl: "",
      uploadImageUrl,
      dialogVisible: this.visibleSelector,
      activeName: "image",

      nowPage: "home",

      networkImageUrl: "",
      localImageUrl: "",
      localImageUrlFull: "",
      file_id: "",

      imageSet: [],
      lastResp: null,

      sm: this.selectMode ,//1单选 2多选
     

    };
  },

  created() {

    this.getImageList();
  },



  watch: {
    
    visibleSelector(val){
      this.dialogVisible = val;
    },

  dialogVisible(val){
    this.$emit('update:visibleSelector',this.dialogVisible)
  }

  },


  methods: {

    closeDialog(){

      this.dialogVisible = false;
      this.onDialogClose();
    },

    onDialogClose() {
      //关闭图片选择器
      console.log('dialogClose');
      this.jumpToHome();
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
  
    },

    onClosed() {
      //关闭回调
      console.log('Closed');
    },

    jumpToImageUpload() {
      this.nowPage = "imageUpload";
    },
    jumpToHome() {
      this.nowPage = "home";
    },

    getUploadImage(data) {
      this.localImageUrl = data.path;
      this.localImageUrlFull = data.path_full;
      this.file_id = data.file_id;
      this.imageSet.unshift({id:this.file_id,url:this.localImageUrl,url_full:this.localImageUrlFull});
    },

    onPageChange(p) {
      this.getImageList({
        page: p
      });
    },

    getImageList(params = {}) {
      //获取图片列表
      return imageList(params).then(resp => {
        this.lastResp = resp.data;
        this.imageSet = this.lastResp.data;
      });
    },

    onSelectImage(img) {
      //选中图片
    
      if (this.sm === 1) {
        let t = this.imageSet.find(x => {
          return x.selected === true;
        });
        t && (this.$set(t,'selected',  false));
       
       this.$set(img,'selected',true);
      } else if (this.sm === 2) {
        this.$set(img, "selected", !img.selected);
      }
    },


    submitUpload(){
      //提交上传
      this.$refs.iu.submitUpload();
    },

    submit() {
      let ret = [];
      this.imageSet.forEach(x => {
        if (x.selected === true) {
          ret.push(x);
        }
      });
      this.$emit("submit-images", ret);
     
      this.closeDialog();
    },

  }
};
</script>

<style>
.image-item {
  width: 100px;
  height: 100px;
  margin: 10px;
  border: 2px solid #fff0;
}

.selectedIcon {
  position: absolute;
  right: 15px;
  top: 15px;
  color: #fff;
  z-index: 111111;
}

.image-item-selected {
  border: 2px solid #07d;
}

.image-item-selected::after {
  position: absolute;
  display: block;
  content: " ";
  right: 0;
  top: 0;
  border-color: #07d #07d transparent transparent;
  border-style: solid;
  border-width: 14px;
  z-index: 1;
}
</style>


