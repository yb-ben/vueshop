<template>
  <div>
    <el-form-item label label-width="60px">
      <el-form ref="attr">
        <el-row v-for="(a,idx) in attr" :key="a.k_id">
          <el-form-item label="规格名" label-width="60px">
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
            <i class="el-icon-close" @click="removeSpuItem(idx)"></i>
            <el-checkbox v-if="idx === 0" v-model="isAddSPUImg" @change="onChangeIsAddSPUImg">添加规格图片</el-checkbox>
          </el-form-item>

          <el-form-item label="规格值" label-width="60px">
            <div class="spuValueDiv" v-for="(s,i) in a.values" :key="i">
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
              <i class="el-icon-close" @click="removeSpuValue(idx,i)"></i>
              <div class="d1" v-if="idx === 0 && isAddSPUImg">
                <img v-if="s.image_url" :src="s.image_url" class="avatar1" @click="showImageUpload(s)" />
                <i
                  v-if=" !s.image_url"
                  class="el-icon-plus avatar-uploader-icon1"
                  @click="showImageUpload(s)"
                ></i>
              </div>
            </div>
            <div class="spuValueDiv">
              <el-button
                v-if="a.selected"
                @click="addSpuValue(a)"
                :disabled="a.addSpuValueBtnDisabled"
              >添加规格值</el-button>
            </div>
          </el-form-item>
        </el-row>

        <el-form-item label-width="60px">
          <el-button @click="addSpuItem" :disabled="addSpuItemBtnDisabled">添加规格项目</el-button>
        </el-form-item>
      </el-form>
    </el-form-item>

    <ImageSelector
      :select-mode="1"
      @submit-images="onSubmitImages"
      pid="spu"
      :visibleSelector.sync="visibleImageSelector"
    ></ImageSelector>

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
        <el-table-column prop="weight" label="重量" width="150" v-slot="scope">
          <el-input v-model="scope.row.weight"></el-input>
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
import { uploadImageUrl } from "@/api/upload";
import ImageSelector from "@/views/imageSelector";

export default {
  name: "SPUEditor",
  components: {
    ImageSelector
  },
  props: ["initResp"],
  data() {
    return {
      uploadImageUrl,
      spuValueLabelWith: "120px",
      isAddSPUImg: false,
      attrs: [],
      values: [],
      attr: [],

      spu: [],
      vlenArr: [],
      maxSpuItem: 3,
      maxSpuValue: 10,
      cacheMap: new Map(),

      tmpPointer: null,
      cacheValidValues: null,
      cacheValidAttrs: null,
      visibleImageSelector: false
    };
  },

  watch: {},

  computed: {
    addSpuItemBtnDisabled() {
      return this.attr.length === this.maxSpuItem;
    },

    getSpuAttr() {
      let t = this.spu[0];
      let ret = [];
      let regex = /^k\d+$/;
      let c = Object.keys(this.spu[0]).reduce((total, v) => {
        return regex.test(v) ? total + 1 : total;
      }, 0);
      for (let i = 1; i <= c; i++) {
        ret.push({ k: t["k" + i], k_id: t["k" + i + "_id"] });
      }
      return ret;
    }
  },

  created() {
    console.log(this.initResp);
    if (this.initResp) {
      this.init();
    }
  },

  methods: {
    init() {
      //编辑下初始化
      attrs().then(resp => {



        let a = this.initResp.spu;
        a.forEach((x, i) => {
          x.selected = x.k_id;
          values({ _id: x.k_id }).then(r => {
            x.values.forEach(vv => {
              r.data.forEach(vvv => {
                    if(vv.v_id === vvv.v_id){ vvv.disabled = true ;return};
              });
              vv.valueSelected = vv.v_id;
             //   x.allValues = r.data;
              this.$set(x, "allValues", r.data);
            });
          });
          x.values[0].image_url && (this.isAddSPUImg = true);


         resp.data.forEach(v => {
            if (x.k_id === v.k_id) {
              v.disabled = true;
              return;
            }
          });
        });
        this.attr = a;
         this.attrs = resp.data;

      }).then(res=>{
          this.getSpuArr();
      }).then(res =>{

          this.spu.forEach(x=>{
              this.initResp.specs.forEach(v=>{
                  if(x._id === v.key){

                    this.$set(x,'price',v.price);
                    this.$set(x,'cast',v.cast);
                    this.$set(x,'weight',v.weight);
                    this.$set(x,'id',v.id);
                    this.$set(x,'code',v.code);
                    this.$set(x,'count',v.count);
                    this.$set(x,'sell',v.sell);
                    this.$set(x,'lock',v.lock);

                    return;
                  }
              });

          });

      });
    },

    onChangeIsAddSPUImg(){

    },

    showImageUpload(v) {
      //弹出图片选择器
      this.tmpPointer = v;
      this.visibleImageSelector = true;
    },

    onSubmitImages(val) {
      //接收图片选择数据
      console.log(val);
      if (val && val.length > 0) {
        this.tmpPointer.image_url = val[0].url_full;
        this.tmpPointer.image_id = val[0].id;
        this.$forceUpdate();
      }
    },

    handleAvatarSuccess(response, file, fileList) {
      //规格图片上传成功
      console.log(response, file, fileList);
    },

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
      if (v.values.length < this.maxSpuValue) {
        v.values.push({});
      }
      if (v.values.length < this.maxSpuValue) {
        v.addSpuValueBtnDisabled = false;
      } else {
        v.addSpuValueBtnDisabled = true;
      }
      this.$forceUpdate();
    },

    removeSpuValue(pi, i) {
      //移除规格值
      let tt = this.attr[pi];
      let v = tt.values[i];

      let t = tt.allValues.find(x => {
        return v.v_id === x.v_id;
      });
      if (t) t.disabled = false;
      tt.values.splice(i, 1);
      tt.addSpuValueBtnDisabled = false;
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
        console.log(1);
      //计算出SPU数组
      let ret = [];
      let validAttrs = [];
      let validValues = [];
      let lenArr = [];
      let success;
      let t;
      this.attr.forEach((v, i) => {
        success = 0;
        t = [];
        if (v.k && v.k_id && v.values && v.values.length > 0) {
          v.values.forEach((vv, ii) => {
            if (vv.v && vv.v_id) {
              t.push(vv);
              success++;
            }
          });
          if (success) {
            v.pointer = t;
            validAttrs.push(v);
            //validValues.push(t);
          }
        }
      });

      if (validAttrs.length > 0) {
        // validAttrs.sort((a, b) => {
        //     return a.k_id - b.k_id;
        // });
        validAttrs.forEach(v => {
          // v.pointer.sort((a, b) => {
          //     return a.v_id - b.v_id;
          // })
          lenArr.push(v.pointer.length);
          validValues.push(v.pointer);
        });

        this.foo(
          validValues,
          0,
          validValues.length,
          {},
          validAttrs,
          ret,
          "",
          this.cacheMap
        );
        this.cacheMap.clear();
        ret.forEach(x => {
          this.cacheMap.set(x._id, x);
        });
      }
      this.cacheValidValues = validValues;
      this.cacheValidAttrs = validAttrs;
      this.vlenArr = lenArr;
      this.spu = ret;

    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let regex = /^k\d+$/;
      let len = Object.keys(this.spu[0]).reduce((total, v) => {
        return regex.test(v) ? total + 1 : total;
      }, 0);
      if (len > 1 && columnIndex < len - 1) {
        let l = 1;
        for (let a = columnIndex; a < len - 1; a++) {
          l *= this.vlenArr[a + 1];
        }
        return rowIndex % l === 0 ? [l, 1] : [0, 0];
      }
    },


    foo($arr, $currHeight, $height, $obj, $attr, $save, $key, $cacheMap) {
      let t = $arr[$currHeight];
      let tt = $attr[$currHeight];
      let c = $currHeight + 1;
      let a = null;
      let b = null;
      for (let i = 0; i < t.length; i++) {
        if (!$currHeight) {
          $obj = {};
          $key = "";
        }
        $obj["k" + c] = tt.k;
        $obj["k" + c + "_id"] = tt.k_id;
        $obj["v" + c] = t[i].v;
        $obj["v" + c + "_id"] = t[i].v_id;

        a  =  $key +"k" + tt.k_id + "v" + t[i].v_id;
        if (c < $height) {

          this.foo(
            $arr,
            $currHeight + 1,
            $height,
            $obj,
            $attr,
            $save,
            a,
            $cacheMap
          );
        } else {
           b = Object.assign({}, $obj);

          if ($cacheMap.has(a)) {
            let m = $cacheMap.get(a);
            b.cast = m.cast;
            b.weight = m.weight;
            b.price = m.price;
            b.code = m.code;
            b.count = m.count;
            b.id = m.id;
          }
          b._id = a;

          $save.push(b);
        }
      }
    }
  }
};
</script>


<style scoped>
i.el-icon-close {
  position: relative;
  color: #ffffff00;
  padding: 2px;
  border-radius: 10px;
  left: -15px;
  top: -18px;
}

i.el-icon-close:hover {
  background-color: #aaa;
  color: white;
}

.avatar1 {
  width: 120px;
  height: 120px;
  display: inline-block;
}

.avatar-uploader-icon1 {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #eee;
}

.spuValueDiv {
  display: inline-block;
  overflow: hidden;
  padding-top: 10px;
}

.d1 {
  height: 120px;
  margin-top: 5px;
}
</style>
