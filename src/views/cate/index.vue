<template>
  <div class="app-container">
    <el-container>
      <el-aside style="padding-top:20px">
        <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
        <el-tree
          ref="tree2"
          v-loading="listLoading"
          :data="cateList"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="onTreeNodeClick"
        ></el-tree>
      </el-aside>
      <el-main>

      
        <div style="margin-bottom:30px">
          <el-button type="primary" @click="onAddCategoryClick">添加分类</el-button>

          <cateForm :message="msg" ref="cateForm"></cateForm>
        </div>

        <el-table :data="currentList">
          <el-table-column label="ID" prop="id" width="180"></el-table-column>
          <el-table-column label="分类名" prop="name" width="180"></el-table-column>
          <el-table-column prop="attr" width="300" label="属性">
            <template v-slot="scope">
              <el-tag v-for="a in scope.row.attr" :key="a.id" type="primary">
                {{ a.name }}
                </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template v-slot="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getCateList } from "@/api/cate";
import  cateForm  from "./cateForm";

//let id = 1000;
export default {
  components:{
     cateForm
  },

  data() {
    return {
      filterText: "aaa",
      cateList: null,
      list: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      listLoading: true,

      currentList: [],
      msg:{
        first:[],second:[],dialogFormVisible:false
      },
    //   dialogFormVisible: false,
      
    //   first: [],
    //    second: [],
    //  form: {
    //     name: "",
    //     sort: 10000,
    //     currFirstId:'',
    //     currSecondId:'',
    //     status: true
    //   },
    //   formLabelWidth: "120px"
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },

  created() {
    //初始化
    this.loadData();
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    loadData() {
      if (!this.cateList) {
        getCateList()
          .then(resp => {
            this.cateList = resp.data;
            this.listLoading = false;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    onTreeNodeClick(data, node, elem) {
      if (data.children) {
        this.currentList = data.children;
      }else{
        this.currentList = [data];
      }
    },

    onAddCategoryClick(){
      
      // if(!this.msg){
      //   this.msg = {first:[],second:[]};
      // }
      
        if(this.msg.first && this.msg.first.length === 0){
          this.cateList.forEach((value,index)=>{
            this.msg.first.push(value);
          });
      }
      this.$refs.cateForm.showDialog();
    },

    // onFirstCateChange(val){
    //   this.first.forEach((value,index)=>{
    //     if(value.id === val){
    //       if(value.children && value.children.length >0){
    //         this.second = value.children;
    //         this.form.currSecondId = value.children[0].id
    //       }else{
    //         this.second = [];
    //       }
    //     }
    //   });
    // },

    // onFirstCateClear(){
    //   this.form.currSecondId = '';
    //   this.second = [];
    // },

  
    // onAddFormSubmit(){
    //   addCate(this.form).then(resp=>{
    //     console.log(resp);
    //     this.dialogFormVisible = false;
    //   }).catch(err=>{

    //   })
    // },

  }
};
</script>
<style>
.show-hover {
  visibility: hidden;
}
.el-tree-node__content:hover .show-hover {
  visibility: visible;
}
</style>
