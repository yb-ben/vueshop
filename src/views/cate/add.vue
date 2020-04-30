<template>
  <el-form :model="form">
    <el-form-item label="分类名称" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>

    <single-selector label="图片" :formLabelWidth="formLabelWidth" @submit-images="handleSubmitImages"></single-selector>

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
        @change="onSecondCateChange"
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

    <el-form-item label="" :label-width="formLabelWidth">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onAddFormSubmit">确 定</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
    import singleSelector from "@/views/imageSelector/singleSelector";

    import { addCate, getCateList } from "@/api/cate";


    export default {
        components: {
            singleSelector
        },
        data() {
            return {
                formLabelWidth: '120px',
                first: [],
                second: [],
                form: {
                    name: "",
                    sort: 10000,
                    currFirstId: "",
                    currSecondId: "",
                    status: true,
                    image: null,
                    image_full: null,
                    image_id: null,
                    level:0
                }
            }
        },

        created() {
            this.loadData();
        },

        methods: {
            //取消返回
            onCancel(){
                this.$router.back();
            },

            //加载数据
            loadData() {
                getCateList()
                    .then(resp => {
                        resp.data.forEach((value, index) => {
                            this.first.push(value);
                        });

                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            //提交
            onAddFormSubmit() {
                addCate(this.form)
                    .then(resp => {
                        this.$message({
                            message:'添加成功',
                            type:'success',
                            duration:1000,
                            onClose:()=> {
                              this.$router.back();
                            }
                        })
                    })
                    .catch(err => {
                    });
            },
            //选中一级分类
            onFirstCateChange(val) {
                this.level = 1;
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

            //选中二级
            onSecondCateChange(){
                this.level = 2;
            },

            //图片
            handleSubmitImages(val) {
                console.log(val);
                if (val) {
                    this.form.image_full = val.image_full;
                    this.form.image = val.image;
                    this.form.image_id = val.image_id;
                }
            }

        }
    }
</script>

<style scoped>

</style>
