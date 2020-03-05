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

          <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="分类" :label-width="formLabelWidth" >
                <el-select clearable @clear="onFirstCateClear" v-model="form.currFirstId"   placeholder="请选择一级分类" @change="onFirstCateChange">
                  
                  <el-option v-for="item in first" :key="item.id" :label="item.name" :value="item.id"></el-option>
               
                </el-select>

                <el-select clearable  v-model="form.currSecondId" placeholder="请选择二级分类" v-show="second.length > 0">
                    <el-option v-for="item in second" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
             
              <el-form-item label="排序" :label-width="formLabelWidth">
                <el-input v-model="form.sort" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="激活" :label-width="formLabelWidth">
                <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="onAddFormSubmit">确 定</el-button>
            </div>
          </el-dialog>
        </div>

        <el-table :data="currentList">
          <el-table-column label="ID" prop="id" width="180"></el-table-column>
          <el-table-column label="分类名" prop="name" width="180"></el-table-column>
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
import { addCate, getCateList } from "@/api/cate";

//let id = 1000;
export default {
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
      dialogFormVisible: false,
      
      first: [],
       second: [],
     form: {
        name: "",
        sort: 10000,
        currFirstId:'',
        currSecondId:'',
        status: true
      },
      formLabelWidth: "120px"
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
      }
    },

    onAddCategoryClick(){
      this.dialogFormVisible = true
        if(this.first && this.first.length === 0){
          this.cateList.forEach((value,index)=>{
            this.first.push(value);
          });
      }
    },

    onFirstCateChange(val){
      this.first.forEach((value,index)=>{
        if(value.id === val){
          if(value.children && value.children.length >0){
            this.second = value.children;
            this.form.currSecondId = value.children[0].id
          }else{
            this.second = [];
          }
        }
      });
    },

    onFirstCateClear(){
      this.form.currSecondId = '';
      this.second = [];
    },

  
    onAddFormSubmit(){
      addCate(this.form).then(resp=>{
        console.log(resp);
        this.dialogFormVisible = false;
      }).catch(err=>{

      })
    },

    handleClick(row) {
      console.log(row);
      
    }
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
