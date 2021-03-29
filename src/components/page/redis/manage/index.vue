<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-emoji"></i>redis集群管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="120px">
        <el-form-item label="根据集群名查询" prop="name">
          <el-input
              v-model="queryParams.name"
              placeholder="请输入集群名(部分字符)"
              clearable
              style="width: 240px;"
              size="small"    />
        </el-form-item>
        <el-form-item label="根据集群ip查询" prop="hosts">
          <el-input
              v-model="queryParams.hosts"
              placeholder="请输入用户名称"
              clearable
              style="width: 240px;"
              size="small"
          />
        </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
      </el-form>

      <el-row :gutter="20">
        <el-col :span="3" :offset="1">
          <div class="grid-content bg-purple">
            <el-button type="primary" size="small" @click="handleDialogCreate">新增redis集群</el-button>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
          </div>
        </el-col>
        <el-col :span="6">
        </el-col>
        <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
      <server-list ref="serverListTable" :values="server" @mulselect="handleSelectionChange" @edit="handleDialogUpdate" @delete="handleDeleteServer" @operation="handleOpertionServer"></server-list>
      <el-dialog
          :visible.sync="dialogVisibleCreate"
          title="新增服务器"
          width="40%">
        <server-form ref="serverCreateForm" :bname="createString" @submit="handleSubmitCreate" @cancel="handleCreateCancel"></server-form>
      </el-dialog>
      <el-dialog
          :visible.sync="dialogVisibleUpdate"
          title="修改服务器信息"
          width="40%"
          @closed = "closedUpdateDialog">
        <server-form ref="serverUpdateForm" :form="serverInfo" :bname="updateString" @submit="handleSubmitUpdate" @cancel="handleUpdateCancel"></server-form>
      </el-dialog>
      <el-row class="bottom-class">
        <el-col :span="1">
          <div class="grid-content bg-purple sel-count">
            {{ multipleSelection.length }} 选择
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <el-button type="danger" size="mini" @click="handleMultiDeleteServer">删除</el-button>
          </div>
        </el-col>
        <el-col :span="8" :offset="6">
          <div class="pagination">
            <el-pagination
                :current-page="currentPage1"
                :page-sizes="[10, 20, 100, 200]"
                :total="totalNum"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getServerList, createServer, deleteServer, updateServer,findCluster } from '@/api/redis'
// import { getSupplierList } from '@/api/supplier'
// import { getManufactoryList } from '@/api/manufactory'
// import { getIdcList } from '@/api/idc'

import ServerList from './list'
import ServerForm from './form'

export default {
  name: 'redisManagement',
  components: { ServerList, ServerForm },
  data() {
    return {
      serverid: '',
      server: [],
      multipleSelection: [],
      manufactoryOption: [],
      serverOption: [],
      dialogVisibleCreate: false,
      dialogVisibleUpdate: false,
      updateServerInfo: {},
      serverInfo: {},
      queryParams: {},
      createString: '立即创建',
      updateString: '立即更新',
      totalNum: 0,
      currentPage1: 1,
      params: {
        page: 1,
        keywords: '',
        page_size: 10
      },
      cluster_name_list: [],
      cluster_name_options: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getServerList(this.params).then(
          // 获取redis集群列表
          res => {
            this.server = res.result
            this.totalNum = res.total
          },
          err => {
            this.$message({
              type: 'error',
              message: err
            })
          }
      ).catch(err=> {
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    handleSubmitCreate(value) {
      // 创建服务器
      createServer(value).then(
          res => {
            if(res.code === 403) {
              this.$message({
                type: 'error',
                message: res.message
              })
            }else{
              this.dialogVisibleCreate = false
              this.$refs.serverCreateForm.reset()
              this.$message({
                type: 'success',
                message: res.message
              })
              this.fetchData()
            }
          }).catch(err => {
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    handleSubmitUpdate(value) {
      // 更新服务器
      updateServer(value).then(
          res => {
             if(res.code === 403) {
               this.$message({
                 type: 'error',
                 message: res.message
               })
             }else {
               this.$message({
                 type: 'success',
                 message: res.message
               })
             }
            this.fetchData()
            this.dialogVisibleUpdate = false
          }).catch(err => {
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    handleDialogCreate() {
      // 弹出服务器新增弹框
      this.dialogVisibleCreate = true
    },
    handleDialogUpdate(server_obj) {
      this.serverInfo = server_obj
      this.dialogVisibleUpdate = true
    },
    closedUpdateDialog() {
      // this.reset = false
    },
    handleDeleteServer(id) {
      // 删除Server
      deleteServer(id).then(
            res => {
              if(res.code === 403) {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }else{
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.fetchData()
              }
            }).catch(err => {
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    handleOpertionServer(id) {
      // 操作redis 查询、删除等操作
      this.$store.state.redis.server_id = id
      this.$router.push({
        path: '/redis/ops'
      })
    },
    handleCurrentChange(val) {
      // 分页
      this.params.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      // 改变分页大小
      this.params.page_size = val
      this.fetchData()
    },
    handleCreateCancel() {
      // 取消创建
      this.dialogVisibleCreate = false
      this.fetchData()
    },
    handleUpdateCancel() {
      // 取消更新
      this.dialogVisibleUpdate = false
      this.fetchData()
    },
    handleFilter() {
      // 搜索
      this.params.page = 1
      this.fetchData()
    },
    handleSelectionChange(val) {
      // 获取表格多选的值
      this.multipleSelection = val
    },
    handleMultiDeleteServer() {
      // 批量删除
      if ((this.totalNum - this.multipleSelection.length) % this.params.page_size === 0) {
        this.params.page = this.params.page - 1
      }
      this.multipleSelection.forEach(
          (item) => {
            deleteServer(item.id).then(
                () => {
                  this.fetchData()
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                }).catch(err => {
              this.$message({
                type: 'error',
                message: err
              })
            })
          },
          err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      this.$refs.serverListTable.$refs.listTable.clearSelection()
    },
    handleQuery() {
      findCluster(this.queryParams).then(
          res => {
            this.server = res.result
            this.totalNum = res.total
          }).catch(err => {
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    resetQuery() {
      this.queryParams = {}
    }
  }
}

</script>

<style  scoped>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.bottom-class {
  margin-top: 10px;
}
.sel-count {
  font-size: 12px;
  margin-top: 7px;
}
.pagination {
    text-align: center;
}
</style>
