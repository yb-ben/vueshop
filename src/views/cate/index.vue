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

        </div>

        <el-table :data="currentList">
          <el-table-column label="ID" prop="id" width="180"></el-table-column>
          <el-table-column label="分类名" prop="name" width="180"></el-table-column>
          <el-table-column prop="attr" width="300" label="属性">
            <template v-slot="scope">
              <el-image style="width: 50px;height: 50px" :src="scope.row.image?scope.row.image.url_full:''">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template v-slot="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="onCateEdit(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getCateList } from "@/api/cate";

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
            this.currentList = resp.data;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    onTreeNodeClick(data, node, elem) {
      if (data.children) {
        this.currentList = [data,...data.children];
      }else{
        this.currentList = [data];
      }
    },

      //添加分类
    onAddCategoryClick(){
      this.$router.push({name:'CateAdd'})
    },
    //编辑分类
      onCateEdit(val){
        this.$router.push({name:'CateEdit',params:{id:val.id}})
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
