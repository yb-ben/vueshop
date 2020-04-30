<template>
  <el-form :model="form">
    <el-form-item label="分类名称" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>

    <single-selector label="图片" :formLabelWidth="formLabelWidth" :defaultImage="form.image_full"
                     @submit-images="handleSubmitImages"></single-selector>

    <el-form-item label="分类" :label-width="formLabelWidth">
      <el-select
        clearable
        @clear="onFirstCateClear"
        v-model="form.currFirstId"
        placeholder="请选择一级分类"
        @change="onFirstCateChange"
        disabled
      >
        <el-option v-for="item in first" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>

      <el-select
        clearable
        v-model="form.currSecondId"
        placeholder="请选择二级分类"
        v-show="form.currSecondId"
        @change="onSecondCateChange"
        disabled
      >
        <el-option v-for="item in second" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>


    <el-form-item label="排序" :label-width="formLabelWidth">
      <el-input v-model="form.sort" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="激活" :label-width="formLabelWidth">
      <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-color="#13ce66"
                 inactive-color="#ff4949"></el-switch>
    </el-form-item>

    <el-form-item label="" :label-width="formLabelWidth">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
    import singleSelector from "@/views/imageSelector/singleSelector";

    import { editCate, getCateList, detail } from "@/api/cate";

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
                    id: "",
                    name: "",
                    sort: 10000,
                    currFirstId: "",
                    currSecondId: "",
                    status: 1,
                    image: null,
                    image_full: null,
                    image_id: null,
                    level: 0,
                    path_array:[]
                }
            }
        },

        created() {
            detail(this.$route.params.id)
                .then(resp => {
                    let d = resp.data;
                    this.form = Object.assign(this.form, d);
                    if (this.form.image) {
                        this.form.image_full = d.image.url_full;
                    }

                    this.$forceUpdate();

                }).then(() => {

                return getCateList()

            }).then(resp => {
                resp.data.forEach((value, index) => {
                    this.first.push(value);
                })

            }).then(() => {
                if (this.form.path_array[1]) {
                    this.onFirstCateChange(this.form.path_array[1]);
                    this.form.currFirstId = this.form.path_array[1];
                    if (this.form.path_array[2]) {
                        this.form.currSecondId = this.form.path_array[2];
                        this.onSecondCateChange()
                    }
                }
                this.$forceUpdate()
            });


        },

        methods: {
            //取消返回
            onCancel() {
                this.$router.back();
            },


            //提交
            onSubmit() {
                editCate(this.form, this.form.id)
                    .then(resp => {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            duration: 1000,
                            onClose: () => {
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
                           // this.form.currSecondId = value.children[0].id;
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
            onSecondCateChange() {
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
