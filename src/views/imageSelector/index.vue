<template>
  <div>

    <el-dialog :visible="visible" width="50%" @close="onDialogClose" @closed="onClosed" title="图片选择">
      <div v-if="nowPage === 'imageUpload'" slot="title" class="header-title" >
        <el-page-header @back="jumpToHome" content="图片选择">
        </el-page-header>
      </div>


      <div v-if="nowPage === 'home'">
        <el-tabs v-model="activeName" @tab-click="handleClick">
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
                @current-change	="onPageChange"
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
            <imageUploader @upload-image="getUploadImage"></imageUploader>
          </el-form-item>

          <el-form-item>
            <el-button @click="jumpToHome">确定</el-button>
          </el-form-item>
        </el-form>
      </div>

      <span v-if="nowPage === 'home'" slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
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
  props: ["selectMode","dv"],
  components: {
    imageUploader
  },
  data() {
    return {
        visible:false,
      imageUrl: "",
      uploadImageUrl,
      dialogVisible: false,
      activeName: "image",

      nowPage: "home",

      networkImageUrl: "",
      localImageUrl: "",
      localImageUrlFull: "",
      file_id: "",

      imageSet: [],
      lastResp: null,

      sm: 1 //1单选 2多选
    };
  },



  created() {
    this.getImageList();
  },

  watch: {
    selectMode(val) {
      console.log(val);
      this.sm = val;
    },

      getImageUploadState(){
         this.visible = Boolean(this.getImageUploadState);

      }
  },

  computed: {

         getImageUploadState(){
             return this.$store.getters.imageUpload
         }


  },

  methods: {
      onDialogClose(){
        console.log('dialogclose');
          this.$store.dispatch("upload/close");
      },

      onClosed(){
          //关闭回调
          console.log('closed');
          this.nowPage='home';
      },

    jumpToImageUpload() {
      this.nowPage = "imageUpload";
    },
    jumpToHome() {
      this.nowPage = "home";
      this.getImageList();
    },

    getUploadImage(data) {
      this.localImageUrl = data.path;
      this.localImageUrlFull = data.path_full;
      this.file_id = data.file_id;
    },



    onPageChange(p){
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
        t && (t.selected = false);
        img.selected = true;
        this.$forceUpdate();
      } else if (this.sm === 2) {
        this.$set(img, "selected", !img.selected);
      }
    },

    submit(){
        let ret = [];
          this.imageSet.forEach(x => {
          if(x.selected === true){
              ret.push(x);
          }
        });
        this.$emit('submit-images',ret);
        this.visible = false;
    },

    handleClick() {}
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



</style>


