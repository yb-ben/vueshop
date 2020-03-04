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
          <el-button type="primary">添加分类</el-button>
        </div>

        <el-table :data="currentList">
          <el-table-column label="分类名">
            <template v-slot="{ cate }">
              <span>{{ cate.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="排序">
            <template v-slot="{ cate }">
              <span>{{ cate.row.sort }}</span>
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

      currentList: []
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },

  created() {
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
      console.log(node.getCurrentNode());
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
