<template>
  <div>
    <el-form-item label="商品规格" label-width="120px">
      <el-form ref="attr">
        <el-row v-for="(a,idx) in attr" :key="a.k_id">
          <el-form-item label="规格名">
            <el-select
              v-model="a.selected"
              @change="onAttrSelected"
              @focus="onAttrFocus"
              filterable
              allow-create
            >
              <el-option
                v-for="j in attrs"
                :key="j.k_id"
                :label="j.k"
                :value="j.k_id"
                :disabled="j.disabled"
              ></el-option>
            </el-select>
            <el-button class="el-icon-close" @click="removeSpuItem(idx)"></el-button>
          </el-form-item>

          <el-form-item label="规格值">
            <span v-for="(s,i) in a.values" :key="i">
              <el-select
                filterable
                v-model="s.valueSelected"
                allow-create
                @change="onValuesSelected"
              >
                <el-option
                  v-for="(vv) in a.allValues"
                  :key="vv.v_id"
                  :label="vv.v"
                  :value="vv.v_id"
                  :disabled="vv.disabled"
                ></el-option>
              </el-select>
              <el-button class="el-icon-close" @click="removeSpuValue(idx,i)"></el-button>
            </span>
            <el-button v-if="a.selected" @click="addSpuValue(a)">添加规格值</el-button>
          </el-form-item>
        </el-row>
      </el-form>

      <el-button @click="addSpuItem" :disabled="addSpuItemBtnDisabled">添加规格项目</el-button>
    </el-form-item>

    <el-form-item label="规格明细" label-width="120px" v-if="spu.length>0">
      <el-table
        border
        :highlight-current-row="false"
        :data="spu"
        :span-method="arraySpanMethod"
        style="width: 100%"
      >
        <el-table-column
          :prop="'v'+(i+1)"
          width="150"
          v-for="(v,i) in getSpuAttr"
          :key="v.k_id"
          :label="v.k"
        ></el-table-column>

  <el-table-column prop="price" label="价格" width="150" v-slot="scope">
          <el-input v-model="scope.row.price"></el-input>
        </el-table-column>
        <el-table-column prop="count" label="库存" width="150" v-slot="scope">
          <el-input v-model="scope.row.count"></el-input>
        </el-table-column>

           <el-table-column prop="code" label="规格编码" width="150" v-slot="scope">
          <el-input v-model="scope.row.code"></el-input>
        </el-table-column>

        <el-table-column prop="cast" label="成本价" width="150" v-slot="scope">
          <el-input v-model="scope.row.cast"></el-input>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
import { attrs, addAttr, values, addValue } from "@/api/goods";
import { foo } from "@/utils/common";

export default {
  name: "SPUEditor",
  data() {
    return {
      attrs: [],
      values: [],
      k1_id: "",
      k2_id: "",
      k3_id: "",
      attr: [],
      // spu: [
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黑色",
      //   //   v1_id: 100,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "大",
      //   //   v2_id: 102,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黑色",
      //   //   v1_id: 100,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "小",
      //   //   v2_id: 103,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黄色",
      //   //   v1_id: 101,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "大",
      //   //   v2_id: 102,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黄色",
      //   //   v1_id: 101,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "小",
      //   //   v2_id: 103,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黑色",
      //   //   v1_id: 100,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "大",
      //   //   v2_id: 102,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黑色",
      //   //   v1_id: 100,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "小",
      //   //   v2_id: 103,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黄色",
      //   //   v1_id: 101,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "大",
      //   //   v2_id: 102,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黄色",
      //   //   v1_id: 101,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "小",
      //   //   v2_id: 103,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黑色",
      //   //   v1_id: 100,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "大",
      //   //   v2_id: 102,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黑色",
      //   //   v1_id: 100,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "小",
      //   //   v2_id: 103,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黄色",
      //   //   v1_id: 101,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "大",
      //   //   v2_id: 102,
      //   //   count: 0,
      //   //   cast: 0
      //   // },
      //   // {
      //   //   k1: "颜色",
      //   //   k1_id: 1,
      //   //   v1: "黄色",
      //   //   v1_id: 101,
      //   //   k2: "尺寸",
      //   //   k2_id: 2,
      //   //   v2: "小",
      //   //   v2_id: 103,
      //   //   count: 0,
      //   //   cast: 0
      //   // }
      // ],
      spu:[],
      vlenArr:[],
      maxSpuItem: 3,
      maxSpuValue: 10,
      cacheMap:new Map(),
      cnt: 0
    };
  },

  watch: {},

  computed: {
    addSpuItemBtnDisabled() {
      return this.attr.length === this.maxSpuItem;
    },

    getValues(idx) {
      let s = this.attr[idx].selected;
      let ret = null;
      this.attrs.forEach((v, i) => {
        if (v.k_id === s) ret = v.values;
      });
      return ret;
    },

    getSpuAttr() {
      let t = this.spu[0];
      let ret = [];
      if (t.k1) {
        ret.push({ k: t.k1, k_id: t.k1_id });
      }
      if (t.k2) {
        ret.push({ k: t.k2, k_id: t.k2_id });
      }
      if (t.k3) {
        ret.push({ k: t.k3, k_id: t.k3_id });
      }
      return ret;
    }
  },

  methods: {
    addSpuItem() {
      //添加规格项目
      this.attr.push({});
    },

    removeSpuItem(idx) {
      //移除规格项目
      //         this.spu.splice(idx,1);
      let kid = this.attr[idx].k_id;
      let t = this.attrs.find(x => {
        return x.k_id === kid;
      });
      if (t) t.disabled = false;
      this.attr.splice(idx, 1);
      this.getSpuArr();
    },

    addSpuValue(v) {
      //添加规格值
      console.log(v);
      v.values.push({});
      this.$forceUpdate();
    },

    removeSpuValue(pi, i) {
      //移除规格值
      let v = this.attr[pi].values[i];

      let t = this.attr[pi].allValues.find(x => {
        return v.v_id === x.v_id;
      });
      if (t) t.disabled = false;
      this.attr[pi].values.splice(i, 1);
      this.$forceUpdate();
      this.getSpuArr();
    },

    onValuesSelected(val) {
      //选中规格值
      let f = 0;
      new Promise(resolve => {
        if (typeof val !== "number") {
          this.attr.forEach((v, i) => {
            if (v.values) {
              v.values.forEach((vv, ii) => {
                if (vv.valueSelected === val) {
                  let t = v.allValues.find(x => {
                    return x.v_id === vv.v_id;
                  });
                  if (t) t.disabled = false;

                  addValue({ _id: v.k_id, val: val }).then(resp => {
                    vv.v = val;
                    vv.v_id = resp.data;
                    v.allValues.push({
                      v_id: resp.data,
                      v: val,
                      disabled: true
                    });

                    this.$forceUpdate();
                    resolve();
                  });
                  f = 1;
                }
              });
              if (f) return false;
            }
          });
        } else {
          this.attr.forEach((v, i) => {
            if (v.values) {
              v.values.forEach((vv, ii) => {
                if (vv.valueSelected === val) {
                  // this.$set(vv, "valueSelected", val);
                  let old_v_id = vv.v_id;
                  v.allValues.forEach((vvv, iii) => {
                    if (vvv.v_id === old_v_id) vvv.disabled = false;
                    if (vvv.v_id === val) {
                      vv.v = vvv.v;
                      vvv.disabled = true;
                    }
                  });
                  vv.v_id = val;
                  this.$forceUpdate();
                  f = 1;
                  return false;
                }
              });
            }
            if (f) return false;
          });
          resolve();
        }
      }).then(resp => {
        
        this.getSpuArr();
      });
    },

    onAttrSelected(val) {
      //选中规格
      console.log(val);
      new Promise(resolve => {
        if (typeof val !== "number") {
          //添加新的属性值
          addAttr({ name: val }).then(resp => {
            this.attr.forEach((v, i) => {
              if (v.selected === val) {
                this.attrs.forEach((vv, ii) => {
                  if (vv.k_id === v.k_id) vv.disabled = false;
                });
                v.selected = resp.data;
                v.k = val;
                v.k_id = resp.data;
                v.allValues = [];
                v.values = [{}];
              }
            });
            this.attrs.push({ k_id: resp.data, k: val, disabled: true });
            resolve();
          });
        } else {
          this.attr.forEach((v, i) => {
            if (v.selected === val) {
              let old_k_id = v.k_id;
              this.attrs.forEach((vv, ii) => {
                if (vv.k_id === old_k_id) vv.disabled = false;
                if (vv.k_id === val) {
                  vv.disabled = true;
                  v.k = vv.k;
                  v.k_id = vv.k_id;
                  v.values = [{}];
                  //获取属性值列表
                  values({ _id: val }).then(resp => {
                    this.$set(v, "allValues", resp.data);
                    //v.allValues = resp.data;
                  });
                }
              });
            }
          });
          resolve();
        }
      }).then(resp => {
        this.getSpuArr();
      });
    },

    onAttrFocus() {
      //获取规格
      if (this.attrs.length === 0) {
        attrs().then(resp => {
          this.attrs = resp.data;
        });
      }
    },

    getSpuArr() {
      //计算出SPU数组
      console.log('start getSpuArr');
      let ret = [];
      let validAttrs = [];
      let validValues = [];
      let lenArr = [];
      let success ;
      let t ;
     this.attr.forEach((v, i) => {
       success = 0;
       t = [];
       if(v.k && v.k_id && v.values && v.values.length > 0 ){
          v.values.forEach((vv,ii)=>{
            if(vv.v && vv.v_id){
              t.push(vv);
              success++;
            }
          });
          if(success){
            v.pointer = t;
            validAttrs.push(v);
            //validValues.push(t);
            lenArr.push(success);
          }
       }
      });
      
      if(validAttrs.length>0){
        validAttrs.sort((a,b)=>{
          return a.k_id - b.k_id;
        });
        validAttrs.forEach((v)=>{
          v.pointer.sort((a,b)=>{
            return a.v_id - b.v_id;
          })
          validValues.push( v.pointer);
        });

        foo(validValues,0,validValues.length,{},validAttrs,ret,'',this.cacheMap);
      }
      this.vlenArr = lenArr;
      this.spu = ret;
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let len ;
      if(this.spu.length ===0)return;
      if(this.spu[0].k3){
        len = 3;
      }else if(this.spu[0].k2){
        len = 2;
      }else{
        return;
      }
      
      switch (len) {
        case 2:
          if (columnIndex === 0) {


            let l = this.vlenArr[1];
            
            if (rowIndex % l === 0) {
              return [l, 1];
            } else {
              return [0, 0];
            }
          }
          break;
        case 3:
          
          if (columnIndex === 1) {
            let l =this.vlenArr[2];
            if (rowIndex % l === 0) {
              return [l, 1];
            } else {
              return [0, 0];
            }
          } else if (columnIndex === 0) {
            let l = this.vlenArr[1] * this.vlenArr[2];
            if (rowIndex % l === 0) {
              return [l, 1];
            } else {
              return [0, 0];
            }
          }
          break;
      }
    },

    sendMsg() {
      this.$emit("spu", this.spu);
    }
  }
};
</script>