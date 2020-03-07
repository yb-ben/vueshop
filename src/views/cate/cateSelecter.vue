<template>
  <el-form-item label="分类" :label-width="formLabelWidth">
    <el-select
      clearable
      @clear="onFirstCateClear"
      v-model="currFirstId"
      placeholder="请选择一级分类"
      @change="onFirstCateChange"
    >
      <el-option v-for="item in first" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>

    <el-select clearable @clear="onSecondCateClear" v-model="currSecondId" placeholder="请选择二级分类" @change="onSecondCateChange" v-show="second.length > 0">
      <el-option v-for="item in second" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>

    <el-select clearable @clear="onThirdCateClear" v-model="currThirdId" placeholder="请选择三级分类" v-show="third.length > 0" @change="onThirdCateChange">
      <el-option v-for="item in third" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
</template>


<script>
import { getCateList } from "@/api/cate";
export default {
  name: "CateSelecter",
  props: ["message"],
  data() {
    return {
      first: [],
      second: [],
      third: [],
      currFirstId: "",
      currSecondId: "",
      currThirdId: "",
      formLabelWidth: "120px",
      postCid:""
    };
  },

  created() {
    //初始化
    this.loadData();
  },


  watch:{
    postCid(){
      this.sendMsg();
    }
  },
 

  methods: {
    loadData() {
      getCateList()
        .then(resp => {
          resp.data.forEach((value, index) => {
            this.first.push(value);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    onFirstCateChange(val) {
      this.first.forEach((value, index) => {
        if (value.id === val) {
          if (value.children && value.children.length > 0) {
            this.second = value.children;
            this.currSecondId = value.children[0].id;
            this.onSecondCateChange(this.currSecondId);
          } else {
            this.second = [];
            this.postCid = this.currFirstId;
          }
          return;
        }
      });
    },

    onSecondCateChange(val) {
      this.second.forEach((value, index) => {
        if (value.id === val) {
          if (value.children && value.children.length > 0) {
            this.third = value.children;
            this.currThirdId = value.children[0].id;
            this.onThirdCateChange(this.currThirdId);
          } else {
            this.third = [];
            this.postCid = this.currSecondId;
          }
        }
      });
    },

    onThirdCateChange(val){
      this.postCid = this.currThirdId;
    },

    onFirstCateClear() {
      this.currSecondId = "";
      this.second = [];

      this.currThirdId = "";
      this.third = [];

      this.postCid = "";
    },
    onSecondCateClear() {
      this.currThirdId = "";
      this.third = [];

      this.postCid = this.currFirstId;
    },

    onThirdCateClear(){
      this.postCid = this.currSecondId;
    },

    sendMsg() {
      console.log(this.postCid);
      this.$emit("event1", this.postCid);
    }
  }
};
</script>