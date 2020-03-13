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

    <el-select
      clearable
      @clear="onSecondCateClear"
      v-model="currSecondId"
      placeholder="请选择二级分类"
      @change="onSecondCateChange"
      v-show="second.length > 0"
    >
      <el-option v-for="item in second" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>

    <el-select
      clearable
      @clear="onThirdCateClear"
      v-model="currThirdId"
      placeholder="请选择三级分类"
      v-show="third.length > 0"
      @change="onThirdCateChange"
    >
      <el-option v-for="item in third" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
</template>


<script>
import { getCateList } from "@/api/cate";
import { find } from "@/utils/common";
export default {
  name: "CateSelecter",
  props: ["message"],
  data() {
    return {
      first: [],
      second: [],
      third: [],
      currFirstId: "",
      currSecondId: null,
      currThirdId: null,
      formLabelWidth: "120px",
      postCid: "",
      initValue: 0
    };
  },

  created() {
    //初始化

    this.initValue = this.$props.message;
    this.loadData();
  },

  watch: {
    postCid() {
      this.sendMsg();
    }
  },

  methods: {
    loadData() {
      getCateList()
        .then(resp => {
          let d = resp.data;

          for (let i = 0; i < d.length; i++) {
            this.first.push(d[i]);
          }

          if (this.initValue) {
            let selected = find(d, v => {
              return v.id === this.initValue;
            });
            let t = selected.path.split("-");

            if (t.length === 3) {
         
                this.currThirdId = parseInt(selected.id);
          
                this.currSecondId = parseInt(t[2]);
                
               this.currFirstId = parseInt(t[1]);
                this.onFirstCateChange(this.currFirstId);
              
            
            }else if(t.length === 2){

      
                this.currSecondId = parseInt(selected.id);
  
               this.currFirstId = parseInt(t[1]);
                this.onFirstCateChange(this.currFirstId);
              
             
            }else if(t.length === 1){

               this.currFirstId =  parseInt(selected.id);
                this.onFirstCateChange(this.currFirstId);
            }
              
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //选中一级分类
    onFirstCateChange(val) {
      this.first.forEach((value, index) => {
        if (value.id === val) {
          if (value.children && value.children.length > 0) {
            this.second = value.children;
            if (!this.initValue) this.currSecondId = value.children[0].id;
            this.onSecondCateChange(this.currSecondId);
          } else {
            this.second = [];
            this.postCid = this.currFirstId;
          }
          return;
        }
      });
    },
    //选中二级分类
    onSecondCateChange(val) {
      this.second.forEach((value, index) => {
        if (value.id === val) {
          if (value.children && value.children.length > 0) {
            this.third = value.children;
            if (!this.initValue) this.currThirdId = value.children[0].id;
            this.onThirdCateChange(this.currThirdId);
          } else {
            this.third = [];
            this.postCid = this.currSecondId;
          }
        }
      });
    },
    //选中三级分类
    onThirdCateChange(val) {
      this.postCid = this.currThirdId;
    },
    //清除一级分类
    onFirstCateClear() {
      this.currSecondId = "";
      this.second = [];

      this.currThirdId = "";
      this.third = [];

      this.postCid = "";
    },
    //清除二级分类
    onSecondCateClear() {
      this.currThirdId = "";
      this.third = [];

      this.postCid = this.currFirstId;
    },
    // 清除三级分类
    onThirdCateClear() {
      this.postCid = this.currSecondId;
    },

    sendMsg() {
      console.log(this.postCid);
      this.$emit("event1", this.postCid);
    }
  }
};
</script>