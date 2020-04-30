<template>
  <div>
    <el-form-item :label="labelText" :label-width="labelWidth">
      <img
        v-if="image_url"
        :src="image_url"
        class="avatar"
        @click="visibleImageSelector = true"
      />
      <i
        v-if="!image_url"
        class="el-icon-plus avatar-uploader-icon"
        style="border: 1px dashed #c0ccda; border-radius: 6px;"
        @click="visibleImageSelector = true"
      ></i>
    </el-form-item>

    <ImageSelector
      v-if="visibleImageSelector"
      :select-mode="1"
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
</style>
<script>
    import ImageSelector from "@/views/imageSelector";

    export default {
        name: "singleSelector",
        props: {formLabelWidth:{type:String,default:'120px'}, label:{type:String,default: '图片'},defaultImage:{type:String,default:''}},
        components: {
            ImageSelector
        },
        data() {
            return {
                visibleImageSelector: false,
                image: null,
                image_url: this.defaultImage,
                image_id: null,
                labelWidth:this.formLabelWidth,
                labelText: this.label
            }
        },

        watch:{

            defaultImage(val){
                this.image_url = val;
            },
            formLabelWidth(val){
                this.labelWidth = val;
            },
            label(val){
                this.labelText = val;
            }
        },


        methods: {

            handleSubmitImages(val) {
                if (val) {

                    this.image_url = val[0].url_full;
                    this.image = val[0].url;
                    this.image_id = val[0].id;

                    this.$emit("submit-images", {
                        image: this.image,
                        image_url: this.image_full,
                        image_id: this.image_id
                    });
                }
            }
        }

    }
</script>

<style scoped>

</style>
