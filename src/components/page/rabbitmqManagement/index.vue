<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-emoji"></i>rabbitmq集群管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="3" :offset="1">
          <div class="grid-content bg-purple">
            <el-button type="primary" size="small" @click="handleDialogCreate">新增rabbitmq集群</el-button>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <!--          <el-input v-model="params.keywords" size="small" clearable placeholder="IP、port" class="input-with-select" @keyup.enter.native="handleFilter">-->
            <!--            <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>-->
            <!--          </el-input>-->
          </div>
        </el-col>
        <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
      <server-list ref="serverListTable" :values="server" @mulselect="handleSelectionChange" @edit="handleDialogUpdate" @delete="handleDeleteServer" @operation="handleOpertionServer" @copyUsername="handleCopyUsername" @copyPassword="handleCopyPassword"></server-list>
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
import { getRabbitmqServerList, createRabbitmqServer, deleteRabbitmqServer, updateRabbitmqServer } from '@/api/rabbitmq_server'
import ServerList from './list'
import ServerForm from './form'

export default {
  name: 'rabbitmqManagement',
  components: { ServerList, ServerForm },
  data() {
    return {
      serverid: '',
      vauleUsername: '',
      vaulePassword: '',
      server: [],
      multipleSelection: [],
      serverOption: [],
      dialogVisibleCreate: false,
      dialogVisibleUpdate: false,
      updateServerInfo: {},
      serverInfo: {},
      // detailForm: {},
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
      getRabbitmqServerList(this.params).then(
          // 获取rabbitmq集群列表
          res => {
            this.server = res.results
            this.totalNum = res.count
          },
          err => {
            this.$message({
              type: 'error',
              message: err
            })
          }
      )
    },
    handleSubmitCreate(value) {
      // 创建服务器
      createRabbitmqServer(value).then(
          () => {
            this.fetchData()
            this.dialogVisibleCreate = false
            this.$refs.serverCreateForm.form.resetFields().catch(err => {})
            this.$message({
              type: 'success',
              message: '创建成功'
            })
          },
          error => {
            this.$message({
              type: 'error',
              message: error
            })
          }
      )
    },
    handleSubmitUpdate(value) {
      // 更新服务器
      updateRabbitmqServer(value).then(
          () => {
            this.fetchData()
            this.dialogVisibleUpdate = false
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          },
          err => {
            this.$message({
              type: 'error',
              message: err.response
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
      deleteRabbitmqServer(id).then(
          () => {
            if (this.totalNum % this.params.page_size === 1) {
              this.params.page = this.params.page - 1
            }
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          },
          err => {
            this.$message({
              type: 'error',
              message: err
            })
          }
      )
    },
    handleOpertionServer(params) {
      // 打开rabbitmq-management页面进行操作
      window.open(params.url,'_blank')
    },
    handleCopyUsername(username) {
      const input = document.createElement('input') // 新增一个input
      input.style.position = 'relative' // 将它隐藏（注意不能使用display或者visibility，否则粘贴不上）
      input.style.zIndex = '-9'
      document.body.appendChild(input) // 追加
      input.value = username // 设置文本框的内容
      input.select() // 选中文本
      document.execCommand('copy') // 执行浏览器复制命令
      document.body.removeChild(input)
      this.$message({
        type: 'success',
        message: '账户复制成功'
      });
    },
    handleCopyPassword(password) {
      const input = document.createElement('input') // 新增一个input
      input.style.position = 'relative' // 将它隐藏（注意不能使用display或者visibility，否则粘贴不上）
      input.style.zIndex = '-9'
      document.body.appendChild(input) // 追加
      input.value = password // 设置文本框的内容
      input.select() // 选中文本
      document.execCommand('copy') // 执行浏览器复制命令
      document.body.removeChild(input)
      this.$message({
        type: 'success',
        message: '密码复制成功'
      });
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
                })
          },
          err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
      this.$refs.serverListTable.$refs.listTable.clearSelection()
    }
  }
}

</script>

<style  scoped>
/*.server {*/
/*  padding: 10px;*/
/*  margin-top: 10px;*/
/*}*/
/*.el-col {*/
/*  border-radius: 4px;*/
/*}*/
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
