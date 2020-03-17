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
              <el-option v-for="j in attrs" :key="j.k_id" :label="j.k" :value="j.k_id"></el-option>
            </el-select>
            <el-button class="el-icon-close" @click="removeSpuItem(idx)"></el-button>
          </el-form-item>
          <el-form-item label="规格值" >
              <el-select v-for="(s,i) in a.values" :key="i"  filterable
              allow-create @focus="onSpuValuesFocus(idx)">
                <el-option v-for="(v) in getValues(idx)" :key="v.v_id" :label="v.v" :value="v.v_id"></el-option>
              </el-select>
              <el-button @click="addSpuValue">添加规格值</el-button>
          </el-form-item>
        </el-row>

      </el-form>

      <el-button @click="addSpuItem" :disabled="addSpuItemBtnDisabled">添加规格项目</el-button>
    </el-form-item>

    <el-form-item label="规格明细" label-width="120px">
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
          v-for="(v,i) in attr"
          :key="v.k_id"
          :label="v.k"
        ></el-table-column>

        <el-table-column prop="count" label="库存" width="150" v-slot="scope">
          <el-input v-model="scope.row.count"></el-input>
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
export default {
  name: "SPUEditor",
  data() {
    return {
      tableData: [],
      attrs: [],
      values: [],
      k1_id: "",
      k2_id: "",
      k3_id: "",
      attr: [
        
      ],
      spu: [
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黑色",
          v1_id: 100,
          k2: "尺寸",
          k2_id: 2,
          v2: "大",
          v2_id: 102,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黑色",
          v1_id: 100,
          k2: "尺寸",
          k2_id: 2,
          v2: "小",
          v2_id: 103,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黄色",
          v1_id: 101,
          k2: "尺寸",
          k2_id: 2,
          v2: "大",
          v2_id: 102,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黄色",
          v1_id: 101,
          k2: "尺寸",
          k2_id: 2,
          v2: "小",
          v2_id: 103,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黑色",
          v1_id: 100,
          k2: "尺寸",
          k2_id: 2,
          v2: "大",
          v2_id: 102,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黑色",
          v1_id: 100,
          k2: "尺寸",
          k2_id: 2,
          v2: "小",
          v2_id: 103,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黄色",
          v1_id: 101,
          k2: "尺寸",
          k2_id: 2,
          v2: "大",
          v2_id: 102,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黄色",
          v1_id: 101,
          k2: "尺寸",
          k2_id: 2,
          v2: "小",
          v2_id: 103,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黑色",
          v1_id: 100,
          k2: "尺寸",
          k2_id: 2,
          v2: "大",
          v2_id: 102,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黑色",
          v1_id: 100,
          k2: "尺寸",
          k2_id: 2,
          v2: "小",
          v2_id: 103,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黄色",
          v1_id: 101,
          k2: "尺寸",
          k2_id: 2,
          v2: "大",
          v2_id: 102,
          count: 0,
          cast: 0
        },
        {
          k1: "颜色",
          k1_id: 1,
          v1: "黄色",
          v1_id: 101,
          k2: "尺寸",
          k2_id: 2,
          v2: "小",
          v2_id: 103,
          count: 0,
          cast: 0
        }
      ],
      maxSpuItem: 3,
      maxSpuValue: 10
    };
  },

  watch: {
    spu: {
      deep: true,
      handler() {
        this.sendMsg();
      }
    }
  },

  computed: {
    addSpuItemBtnDisabled() {
      return this.attr.length === this.maxSpuItem;
    },

    getValues(idx){
      return '';
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
      this.attr.splice(idx, 1);
    },

    addSpuValue(idx, $v) {
      //添加规格值
    },

    removeSpuValue() {
      //移除规格值
    },

    onInputSpuItem(data) {
      //输入新的规格项目
      addAttr(data)
        .then(resp => {})
        .catch(err => {});
    },

    onInputSpuValue(data) {
      //输入新的规格值
      addValue(data)
        .then(resp => {})
        .catch(err => {});
    },

    onSpuValuesFocus(idx){
      let v = this.getValues(idx);
       
    },

    onAttrSelected(val) {
      console.log(val);
      //选中规格

      if (typeof val !== "number") {
        addAttr({ name: val })
          .then(resp => {
            this.attr.forEach((v, i) => {
              if (v.selected === val) {
                v.selected = resp.data;
                v.k = val;
                v.k_id = resp.data;
              }
            });
            this.attrs.push({ k_id: resp.data, k: val });
          })
          .catch(err => {});
      } else {
        this.attr.forEach((v, i) => {
          if (v.selected === val) {
            this.attrs.forEach((vv, ii) => {
              if (vv.k_id === val) {
                v.k = vv.k;
                v.k_id = vv.k_id;
              }
            });
          }
        });
      }
    },

    onAttrFocus() {
      //获取规格
      if (this.attrs.length === 0) {
        attrs().then(resp => {
          this.attrs = resp.data;
        });
      }
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      switch (this.attr.length) {
        case 2:
          if (columnIndex === 0) {
            let l = this.attr[1].v.length;
            if (rowIndex % l === 0) {
              return [l, 1];
            } else {
              return [0, 0];
            }
          }
          break;
        case 3:
          if (columnIndex === 1) {
            let l = this.attr[2].v.length;
            if (rowIndex % l === 0) {
              return [l, 1];
            } else {
              return [0, 0];
            }
          } else if (columnIndex === 0) {
            let l = this.attr[1].v.length * this.attr[2].v.length;
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