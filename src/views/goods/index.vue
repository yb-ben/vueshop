<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-tabs v-model="status" @tab-click="handleClick">
          <el-tab-pane label="全部" name="0"></el-tab-pane>
          <el-tab-pane label="上架中" name="1"></el-tab-pane>
          <el-tab-pane label="待上架" name="2"></el-tab-pane>
          <el-tab-pane label="已下架" name="3"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-header>
        <el-button @click="addGoods">添加商品</el-button>
        <el-button>一键上架</el-button>
        <el-button>一键下架</el-button>
        <el-button>删除</el-button>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="ID">
            <template v-slot="scope">{{scope.row.id}}</template>
          </el-table-column>

          <el-table-column label="封面">
            <template v-slot="scope">
              <el-img :src="scope.row.main_image"></el-img>
            </template>
          </el-table-column>

          <el-table-column label="标题">
            <template v-slot="scope">{{scope.row.title}}</template>
          </el-table-column>

                    <el-table-column label="价格">
            <template v-slot="scope">
              <span>{{scope.row.price}}</span>
              <span>{{scope.row.line_price}}</span>
              </template>
          </el-table-column>

                    <el-table-column label="库存">
            <template v-slot="scope">{{scope.row.count}}</template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { goodsList } from "@/api/goods";

export default {
  name: "Goods",
  data() {
    return {
      status: "1",
      list: [],
      paginate: {
        limit: 15
      }
    };
  },

  created(){
    loadGoodsList();
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },

    //添加商品
    addGoods() {
      this.$router.push("/goods/add");
    },

    //商品列表
    loadGoodsList() {
      goodsList(this.paginate)
        .then(resp => {
          this.list = resp.data.data;

        })
        .catch(err => {});
    }
  }
};
</script>