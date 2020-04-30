<template>
  <div>
  <el-form-item :label="labelText" :label-width="labelWidth">
    <div class="mImage-item" v-for="(v,i) in images" :key="i">
      <img
        v-if="v.image_url"
        :src="v.image_url"
        class="avatar"
        @click="visibleImageSelector = true"
      />
      <i class="el-icon-close" @click="removeImage(i)"></i>
    </div>
    <div style="display:inline-block;vertical-align:top">
      <i
        class="el-icon-plus avatar-uploader-icon"
        style="border: 1px dashed #c0ccda;
              border-radius: 6px;"
        @click="visibleImageSelector = true"
      ></i>
    </div>
  </el-form-item>
  <ImageSelector
    v-if="visibleImageSelector"
    :select-mode="2"
    @submit-images="handleSubmitImages"
    :visibleSelector.sync="visibleImageSelector"
  ></ImageSelector>
  </div>
</template>

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

  .mImage-item {
    display: inline-block;
    position: relative;
    margin-right: 10px;
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
<script>
    import ImageSelector from "@/views/imageSelector";

    export default {
        name: "multiSelector",
        components: {
            ImageSelector
        },
        props: {
            formLabelWidth: { type: String, default: '120px' },
            label: { type: String, default: '图片' },
            defaultImage: { type: String, default: '' },
            mImages:{type:Array}
        },

        data() {
            return {
                visibleImageSelector: false,
                labelWidth: this.formLabelWidth,
                labelText: this.label,
                images:this.mImages,
            }
        },

        watch:{

            formLabelWidth(){
                this.labelWidth = this.formLabelWidth;
            },
            label(){
                this.labelText = this.label;
            },
            mImages(){
                this.images = this.mImages;
            }
       },

        methods:{
            handleSubmitImages(val){
                if(val){
                  val.forEach((x)=>{
                      this.images.push({image_id: x.id,image_url:x.url_full})
                  });
                  this.$emit('multi-images-selected',this.images);
                }
            },
            removeImage(i){
                this.images.splice(i,1)
            }
        }
    }
</script>

<style scoped>

</style>
