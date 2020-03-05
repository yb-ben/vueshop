<template>
  <div class="app-container">
    <el-container>
      <el-header>
      
        <el-tabs v-model="status" @tab-click="handleClick">
          <el-tab-pane label="上架中" name="1">上架中</el-tab-pane>
          <el-tab-pane label="待上架" name="2">待上架</el-tab-pane>
          <el-tab-pane label="已下架" name="3">已下架</el-tab-pane>
        </el-tabs>
      
      </el-header>
      <el-main></el-main>
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
      }
    }


}
</script>