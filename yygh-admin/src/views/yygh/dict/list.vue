<template>
  <div class="app-container">

    <div class="el-toolbar">
      <div class="el-toolbar-body" style="justify-content: flex-start;">
        <el-button type="text" @click="exportData">
          <i class="fa fa-plus"/> 导出
        </el-button>
          <el-button type="text" @click="importData">
          <i class="fa fa-plus"/> 导入
        </el-button>
      </div>
    </div>

    <el-dialog title="导入" :visible.sync="dialogImportVisible" width="480px">
      <el-form label-position="right" label-width="170px">
        <el-form-item label="文件">
            <!-- :action是导入所访问的后端接口地址 -->
          <el-upload
            :multiple="false"
            :on-success="onUploadSuccess"
            :action="BASE_API"
            class="upload-demo"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls文件,且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImportVisible = false">取消</el-button>
      </div>
    </el-dialog>


    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" width="150"></el-table-column>

      <el-table-column prop="dictCode" label="编码" width="150"></el-table-column>

      <el-table-column prop="value" label="值" width="150"></el-table-column>

      <el-table-column prop="createTime" label="创建时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>

import dictApi from "@/api/yygh/dict";

export default {
    data() {
        return {
            list: [],//数据字典集合
            dialogImportVisible: false,
            BASE_API:`${process.env.VUE_APP_BASE_API}admin/cmn/dict/importData`
        }
    },

    created() {
        this.getData(1)
    },

    methods: {
        //初始化查询方法
        getData(id) {
            dictApi.findChildData(id).then(response => {
                this.list = response.data.list
            })
        },

        load(tree,treeNode,resolve) {
            dictApi.findChildData(tree.id).then(response => {
                resolve(response.data.list)
            })
        },

        exportData(){
            window.open(`${process.env.VUE_APP_BASE_API}admin/cmn/dict/exportData`)
        },

        importData(){//点击上传和打开读取都是eui自动完成
            this.dialogImportVisible = true
        },

        //上传成功后
        onUploadSuccess(){
            //1关闭对话框
            this.dialogImportVisible = false

             //2上传成功提示
             this.$message({
             type: "success",
             message: "上传成功!"
         })

         //3刷新表格!!!!
         this.getData(1)
        }



    }
     
}
</script>
