<template>
  <div class="app-container">
    医院设置表单
    <el-form label-width="120px">
      <el-form-item label="医院名称">
        <el-input v-model="hospset.hosname"/>
      </el-form-item>
      <el-form-item label="医院编号">
        <el-input v-model="hospset.hoscode"/>
      </el-form-item>
      <el-form-item label="api地址">
        <el-input v-model="hospset.apiUrl"/>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="hospset.contactsName"/>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="hospset.contactsPhone"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>

import hospsetApi from "@/api/yygh/hospset";

export default {
    data() {
        return {
            hospset: {},//表单对象
            saveBtnDisabled:false//按钮是否不可操作
        }
    },

    created() {
        //判断路由里有没有参数并且是否有id这个参数
        //!!!!!!查询路由数据用的是route而不是router！！！！！
        if(this.$route.params&&this.$route.params.id){
            console.log(this.$route.params.id)
            //查询数据回显
            hospsetApi.getById(this.$route.params.id).then(response =>{
                this.hospset = response.data.hospitalSet
            })
        }
    },

    methods: {
        saveOrUpdate() {
            if(this.hospset.id){
                //修改
                this.updateHospset()
            }else{
                 //新增
                this.saveHospset()
            }       
      
        },

        saveHospset() {
            hospsetApi.save(this.hospset).then(() => {
                    this.saveBtnDisabled = true//让保存按钮不可用

                    this.$message({
                    type: "success",
                    message: "新增成功!"
                });
                //调用vue的$的自带路由去跳转页面
                this.$router.push({path:'/yygh/hospset/list'})
            })
        },

                    //修改
        updateHospset() {
            hospsetApi.update(this.hospset).then(response => {
                    this.$message({
                    type: "success",
                    message: "修改成功!"
                });
                    this.$router.push({ path: "/yygh/hospset/list" });
            });
        }


    }
    
}
</script>