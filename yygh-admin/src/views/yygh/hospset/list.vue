<template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="searchObj.hosname" placeholder="医院名称"/>
        </el-form-item>

        <el-form-item>
            <el-input v-model="searchObj.hoscode" placeholder="医院编号"/>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 工具条 -->
    <div>
      <el-button type="danger" size="mini" @click="removeRows()">批量删除</el-button>
    </div>




    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>

    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="hosname" label="医院名称" width="180"/>

      <el-table-column prop="hoscode" label="医院编号" width="160"/>

      <el-table-column prop="apiUrl" label="地址" width="200"/>

      <el-table-column prop="contactsName" label="联系人"/>

      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{ scope.row.status===1?'可用':'不可用' }}</template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/yygh/hospset/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
          <el-button v-if="scope.row.status==1" type="primary" size="mini" 
         icon="el-icon-delete" @click="lockHostSet(scope.row.id,0)">锁定</el-button>
      <el-button v-if="scope.row.status==0" type="danger" size="mini" 
         icon="el-icon-delete" @click="lockHostSet(scope.row.id,1)">取消锁定</el-button>
        </template>
      </el-table-column>

    </el-table>

  <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />


  </div>
</template>

<script>

import hospsetApi from "@/api/yygh/hospset"

export default {
    data () {
        return {
            listLoading:true,//表格加载状态
            list:[],//表格数据
            page:1,//当前页
            limit:3,//每页记录数
            total:0,//总记录数
            searchObj:{},//查询条件
            multipleSelection: []
        };
    },

    created () {
        this.fetchData()
    },

    methods: {
        fetchData(page = 1) {
          this.page = page

            hospsetApi.pageQuery(this.page,this.limit,this.searchObj)
            .then(response => {
                console.log(response)
                this.list = response.data.rows
                this.total = response.data.total
                this.listLoading = false
            })
        },

        resetData(){
          this.searchObj = {}
          this.fetchData()
        },

    //     removeDataById(id){
    //     hospsetApi.removeById(id).then(response=>{
    //         this.fetchData();
    //     })
    // }

    //  优化删除
    removeDataById(id){

      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        .then(() => {
           hospsetApi.removeById(id).then(response=>{
             this.fetchData();
             
              this.$message({
              type: "success",
              message: "删除成功!"
            });

         })

        })

        .catch(() => {
            this.$message({
            type: "info",
            message: "已取消删除"
          })
        }) 
     },


    handleSelectionChange(selection){
      console.log(selection)
      this.multipleSelection = selection
    },



    removeRows() {

      this.$confirm("此操作将永久删除这些数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      
      .then(() => {
        //1.创建参数集合idList
        let idList = []
        //2.遍历multipleSelection集合,取出id
        //!!!!!!!!全局属性必须用this指明！！！！！
        for(let i = 0; i < this.multipleSelection.length; i++) {
          //获取集合中的每一个对象
          let hospset = this.multipleSelection[i]
          //将对应对象的id取出
          let id = hospset.id
          //3.将id存入集合idList
          idList.push(id);
        }

        console.log(idList);
        
        //4.调用接口进行批量删除
        hospsetApi.batchRemove(idList).then(response => {
          this.fetchData()

           this.$message({
              type: "success",
              message: "删除成功!"
            })
        })
      })

      .catch(() => {

         this.$message({
            type: "info",
            message: "已取消删除"
          })

      })
    },


    lockHostSet(id,status){
      hospsetApi.lockHospSet(id,status).then(response => {
        this.fetchData()

         this.$message({
              type: "success",
              message: "操作成功!"
        })

      })

    }




    }

    
}
</script>