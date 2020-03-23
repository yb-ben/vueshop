<template>
  <div class="app-container">
    <el-container>

      <el-header>

        <el-form :inline="true" :model="paginate" class="demo-form-inline">
  <el-form-item label="商品名">
    <el-input v-model="paginate.kw" placeholder="输入商品名称"></el-input>
  </el-form-item>
  <el-form-item label="商品分类">
    <el-select v-model="paginate.cate_id" placeholder="请选择">
    <el-option
      v-for="item in cate"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </el-select>
  </el-form-item>
    <el-form-item label="价格">
      <el-row>
  <el-col :span="11">
    <div class="grid-content bg-purple">
     <el-input v-model="paginate.price[0]"></el-input>
    </div></el-col>
  <el-col :span="2"><div class="grid-content" style="text-align:center"> <span>-</span></div></el-col>
  <el-col :span="11"><div class="grid-content bg-purple">  <el-input v-model="paginate.price[1]"></el-input></div></el-col>
</el-row>
     
     
    
  </el-form-item>
  <el-form-item>
    <el-button type="primary" >查询</el-button>
  </el-form-item>
</el-form>
      </el-header>

      <el-header>
        <el-tabs v-model="paginate.status" @tab-click="handleClick">
          <el-tab-pane label="全部" name="-1"></el-tab-pane>
          <el-tab-pane label="待上架" name="0"></el-tab-pane>
          <el-tab-pane label="销售中" name="1"></el-tab-pane>
          <el-tab-pane label="已售罄" name="2"></el-tab-pane>
        </el-tabs>
      </el-header>

      <el-header>
        <el-button @click="addGoods">添加商品</el-button>
        <el-button v-show="paginate.status !== '1' || paginate.status !== '2'" @click="upGoods">上架</el-button>
        <el-button v-show="paginate.status === '1' || paginate.status === '2'" @click="downGoods">下架</el-button>
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

          <el-table-column label="封面" width="100" align="center">
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
         
             </template>
          </el-table-column>
        </el-table>
        

               <div class="block"  style="text-align:right">
    <el-pagination
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
      :current-page.sync="paginate.page"
      :page-sizes="[10,20]"
      :page-size.sync="paginate.limit"
      layout="total, sizes, prev, pager, next, jumper"
     
       :total="resp ? resp.total :0">
    </el-pagination>
  </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { goodsList ,takeUp,takeDown} from "@/api/goods";
import { getCateList } from "@/api/cate";

export default {
  name: "Goods",
  data() {
    return {
      resp:null,
      list: [],
      multipleSelection:[],
      listLoading: true,
      paginate: {
        limit: 15,
        status: "-1",
        page:1,
        cate_id:null,
        price:[null,null],
        kw:null,
      },
      cate:[]
    };
  },

  created(){
   this.loadGoodsList();
   this.loadCate();
  },

  methods: {
    handleClick(tab, event) {
      this.loadGoodsList();
    },


      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      loadCate(){
         getCateList({type:'list'}).then(resp=>{
            this.cate = resp.data;
         })
      },

    //添加商品
    addGoods() {
      this.$router.push("/goods/add");
    },

    //商品列表
    loadGoodsList() {
      this.listLoading = true;
      goodsList(this.paginate)
        .then(resp => {
          this.resp = resp.data;
          this.list = this.resp.data;
          this.listLoading = false;
        });
    },


    upGoods(){
      //上架
      let d = [];
      this.multipleSelection.forEach(x=>{
        d.push(x.id);
      })
      takeUp(d).then(resp=>{
        this.loadGoodsList();
      });
    },

    downGoods(){
      //下架
            let d = [];
      this.multipleSelection.forEach(x=>{
        d.push(x.id);
      })
      takeDown(d).then(resp=>{
        this.loadGoodsList();
      });
    },

    onPageChange(p){
        this.paginate.page = p;
        this.loadGoodsList();
    },

    onPageSizeChange(size){
      this.paginate.limit = size;
      this.loadGoodsList();
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
  width: 60px;
  height:60px;
}
</style>


<style>
  .el-row {
    margin-bottom: 20px;
 
  }
  .el-col {
    border-radius: 4px;
  }
 

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: white;
  }
</style>