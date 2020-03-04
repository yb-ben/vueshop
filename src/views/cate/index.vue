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
          node-key="id"
        >
          <template v-slot="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span class="show-hover">
                <el-button type="text" size="mini" @click="() => append(data)">添加</el-button>
                <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
              </span>
            </span>
          </template>
        </el-tree>
      </el-aside>
      <el-main>
        <div style="margin-bottom:30px">
          <!-- <el-button type="primary">添加分类</el-button> -->
        </div>
        <!-- <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID" width="95">
            <template v-slot:scope="{ scope }">{{ scope.$index }}</template>
          </el-table-column>
          <el-table-column label="Title">
            <template v-slot:scope="{ scope }">{{ scope.row.title }}</template>
          </el-table-column>
          <el-table-column label="Author" width="110" align="center">
            <template v-slot:scope="{ scope }">
              <span>{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Pageviews" width="110" align="center">
            <template v-slot:scope="{ scope }">{{ scope.row.pageviews }}</template>
          </el-table-column>
          <el-table-column class-name="status-col" label="Status" width="110" align="center">
            <template v-slot:scope="{ scope }">
              <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="Display_time" width="200">
            <template v-slot:scope="{ scope }">
              <i class="el-icon-time" />
              <span>{{ scope.row.display_time }}</span>
            </template>
          </el-table-column>
        </el-table>-->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getCateList } from "@/api/cate";

let id = 1000;
export default {
  data() {
    return {
      filterText: "aaa",
      cateList: null,
      list: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      listLoading: true
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

    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
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
    }
  }
};
</script>
<style>
.show-hover{
    visibility: hidden;

}
.el-tree-node__content:hover .show-hover{
    visibility:visible;
}
</style>
