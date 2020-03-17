<template>
  <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="分类名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="分类" :label-width="formLabelWidth">
        <el-select
          clearable
          @clear="onFirstCateClear"
          v-model="form.currFirstId"
          placeholder="请选择一级分类"
          @change="onFirstCateChange"
        >
          <el-option v-for="item in first" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>

        <el-select
          clearable
          v-model="form.currSecondId"
          placeholder="请选择二级分类"
          v-show="second.length > 0"
        >
          <el-option v-for="item in second" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="排序" :label-width="formLabelWidth">
        <el-input v-model="form.sort" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="激活" :label-width="formLabelWidth">
        <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onAddFormSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

<script>
import { addCate } from "@/api/cate";
export default {
  name: "cateForm",
  props: ["message"],
  data() {
    return {
      first: [],
      second: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
       dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: '',
      form: {
        name: "",
        sort: 10000,
        currFirstId: "",
        currSecondId: "",
        status: true
      }
    };
  },

  created() {
    this.first = this.message.first;
    this.second = this.message.second;
  },

  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },

    onAddFormSubmit() {
      addCate(this.form)
        .then(resp => {
          this.dialogFormVisible = false;
        })
        .catch(err => {});
    },

    onFirstCateChange(val) {
      this.first.forEach((value, index) => {
        if (value.id === val) {
          if (value.children && value.children.length > 0) {
            this.second = value.children;
            this.form.currSecondId = value.children[0].id;
          } else {
            this.second = [];
          }
        }
      });
    },

    onFirstCateClear() {
      this.form.currSecondId = "";
      this.second = [];
    },

    //-------属性--------

     handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
  }
};
</script>