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
          <el-button >一键上架</el-button>
          <el-button>一键下架</el-button>
          <el-button>删除</el-button>
        </el-header>
      <el-main>
        <el-table>
          
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
    name:'Goods',
    data(){
        return {
            status:'1'  
        }
    },

     methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },

      //添加商品
      addGoods(){
        this.$router.push('/goods/add');
      }
    }


}
</script>