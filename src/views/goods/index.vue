<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-tabs v-model="paginate.status" @tab-click="handleClick">
          <el-tab-pane label="全部" name="-1"></el-tab-pane>
          <el-tab-pane label="上架中" name="1"></el-tab-pane>
          <el-tab-pane label="待上架" name="0"></el-tab-pane>
          <el-tab-pane label="已下架" name="2"></el-tab-pane>
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
           @selection-change="handleSelectionChange"
        >
         <el-table-column
      type="selection"
      width="55">
    </el-table-column>
          <el-table-column label="ID" width="80" align="center">
            <template v-slot="scope">{{scope.row.id}}</template>
          </el-table-column>

          <el-table-column label="封面" width="140" align="center">
            <template v-slot="scope">
              <el-image :src="scope.row.main_image_full" class="main_image"></el-image>
            </template>
          </el-table-column>

          <el-table-column label="标题">
            <template v-slot="scope">{{scope.row.title}}</template>
          </el-table-column>

                    <el-table-column label="价格" width="150" align="center">
            <template v-slot="scope">
              <span>¥</span>
              <s>{{scope.row.line_price}}</s>
              <span class="price">{{scope.row.price}}</span>
              </template>
          </el-table-column>

                    <el-table-column label="库存" width="120" align="center">
            <template v-slot="scope">{{scope.row.count}}</template>
          </el-table-column>

           <el-table-column label="操作" width="200" align="center">
             <template v-slot="scope">

             <el-button @click="editGoods(scope.row.id)">修改</el-button>
             <el-button>删除</el-button>
             </template>
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
     
      list: [],
      multipleSelection:[],
       listLoading: true,
      paginate: {
        limit: 15,
        status: "-1",
      }
    };
  },

  created(){
   this.loadGoodsList();
  },

  methods: {
    handleClick(tab, event) {
      //console.log(tab, event);
      this.loadGoodsList();
    },


      handleSelectionChange(val) {
        this.multipleSelection = val;
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
          this.listLoading = false;
        })
        .catch(err => {});
    },

    //编辑商品
    editGoods(id){
      this.$router.push({
        name:'EditGoods',
        params:{
          id:id
        }
      })
    }
  }
};
</script>

<style scoped>
.price{
  font-size: 18px;
    font-weight: 600;
    color: #ff6318e6;
}
.main_image{
  width: 100px;
  height:100px;
}
</style>