<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-emoji"></i>权限组设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="group">
        <div class="header-class">
          <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple">
              <el-button type="primary" size="mini" @click="dialogVisibleCreate = true">创建权限组</el-button>
            </div>
            </el-col>
            <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
<!--            <el-col :span="6">-->
<!--              <div class="grid-content bg-purple">-->
<!--                <el-input v-model="params.name" placeholder="请输入内容" class="input-with-select" @keyup.enter.native="handleFilter">-->
<!--                  <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>-->
<!--                </el-input>-->
<!--              </div>-->
<!--            </el-col>-->
            <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
          </el-row>
          <group-list :values="group" :loading="loading" @edit="handleUpdate" @editPerm="handleEditPerm" @delete="handleDelete" @list="handlelistMember"></group-list>
          <el-dialog
              :visible.sync="dialogVisibleCreate"
              title="创建用户"
              width="50%">
            <group-form ref="gform" :value="createString" @submit="handleSubmitCreate" @cancel="handleCreateCancel"></group-form>
          </el-dialog>
          <el-dialog
              :visible.sync="dialogVisibleUpdate"
              title="修改权限组信息"
              width="50%">
            <group-form :form="detailForm" :value="updateString" @submit="handleSubmitUpdate" @cancel="handleUpdateCancel"></group-form>
          </el-dialog>
          <div class="pagination">
            <el-pagination
                :current-page="currentPage1"
                :total="totalNum"
                layout="total, prev, pager, next"
                @current-change="handleCurrentChange">
            </el-pagination>
          </div>
          <el-dialog
              :visible.sync="dialogVisibleUser"
              :title="group_name"
              width="50%">
            <group-member :values="member" @delete="handleDeleteGroupMember"></group-member>
          </el-dialog>
          <el-dialog
              :visible.sync="dialogVisiblePerm"
              :title="perDialogTitle"
              width="70%">
            <group-perm ref="permform" :form="groupForms" :values="groupPerms" :list="permsList" @submit="handleSubmitGroupPerm" @cancel="handlePermCancel"></group-perm>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { getPermissionGroupList, createPermissionGroup, deletePermissionGroup, getUrlPermission,updateGroupPerm, deleteGroupUserMember,updatePermissionGroup} from '@/api/url_premission'
import GroupList from './group-list'
import GroupForm from './group-form'
import GroupMember from './group-member'
import GroupPerm from './group-perm'

export default {
  name: 'Group',
  components: { GroupList, GroupForm, GroupMember, GroupPerm },
  data() {
    return {
      groupForms: [],
      group: [],
      member: [],
      permsList: [],
      group_name: '',
      perDialogTitle: '',
      group_id: '',
      groupPerms: [],
      dialogVisibleCreate: false,
      dialogVisibleUpdate: false,
      dialogVisibleUser: false,
      dialogVisiblePerm: false,
      loading: true,
      detailForm: {},
      createString: '立即创建',
      updateString: '立即更新',
      totalNum: 0,
      currentPage1: 1,
      params: {
        page: 1,
        group_name: undefined,
        page_size: 10
      },
      queryUrlAllParams: {
        control: true,
      },
      queryUrlParams: {
        control: true,
        group_id: '',
      },
      all_perm: [],
      disable_perm: [],
      active_perm:[],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getPermissionGroupList(this.params).then(
        // 获取所有用户组
        res => {
          this.group = res.result
          this.totalNum = res.total
          this.loading = false
        },
        err => {
          this.$message({
            type: 'error',
            message: err.response.data.detail
          })
        }
      )
    },
    handleSubmitCreate(value) {
      // 创建用户组
      value.users = [0]
      createPermissionGroup(value).then(
        result => {
          this.fetchData()
          this.dialogVisibleCreate = false
          this.$message({
            type: 'success',
            message: result.message
          })
        },
        err => {
          this.$message({
            type: 'error',
            message: err.response.message
          })
        }
      )
    },
    handleSubmitUpdate(value) {
      // 编辑更新用户组updatePermissionGroup
      const data = {id: value.id, group_name:value.group_name, desc: value.desc}
      updatePermissionGroup(data).then(
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
            message: err.response.data.detail
          })
        })
    },
   getDiffrenceSetData (dataA, dataB) {
    for (let i = dataA.length - 1; i >= 0; i--) {
    for (let j = 0; j  < dataB.length; j++) {
      if (dataA[i].id === dataB[j].id) {
        dataA.splice(i, 1);
        break;
       }
      }
    }
  return dataA;
  },
    handleEditPerm(value) {
      // 更新用户组的权限
      this.groupForms = value
      this.perDialogTitle = value.group_name + '组权限修改'
      getUrlPermission(this.queryUrlAllParams).then( response1=> {
        console.log(response1)
           this.all_perm = response1.result
        const all_perm_list = Object.assign({}, this.all_perm);
        this.queryUrlParams.group_id = value.id
        getUrlPermission(this.queryUrlParams).then(response2 => {
          this.active_perm = response2.result
          this.disable_perm = this.getDiffrenceSetData(all_perm_list , this.active_perm)
          if(this.active_perm === "") {
            this.active_perm = []
          }
          if (this.disable_perm === "") {
            this.disable_perm = []
          }
          const active_lst = []
          for(let index in this.active_perm) {
            active_lst.push(this.active_perm[index].id)
          }
          this.groupPerms = active_lst
          this.permsList = this.all_perm
          this.dialogVisiblePerm = true
          // this.$refs.permform.$forceUpdate()
        }).catch(err2=> {this.$message({
          type: 'error',
          message: err2
        })})
      }).catch(err1=> {this.$message({
        type: 'error',
        message: err1
      })})
      // this.groupPerms = value.perm.map(item => item.id)
    },
    handleUpdate(value) {
      // 弹出用户组更新对话框
      this.dialogVisibleUpdate = true
      this.detailForm = value
    },
    handleDelete(id) {
      // 删除用户组
      deletePermissionGroup(id).then(
        () => {
          if (this.totalNum % this.params.page_size === 1) {
            this.params.page = this.params.page - 1
          }
          this.fetchData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(
          err => {
            this.$message({
              type: 'error',
              message: err.response.data.detail
            })
          }
      )
    },
    handleSubmitGroupPerm(id, value) {
      // 更新用户组权限
      const data = {id: id , urls: value}
      updateGroupPerm(data).then(
        response => {
          this.dialogVisiblePerm = false
          this.fetchData()
          if(response.code === 200 || response.code === 201)
          {
            this.$message({
              type: 'success',
              message: response.message
            })
          }else{
            this.$message({
              type: 'error',
              message: response.message
            })
          }
    }).catch( err=> {
        this.$message({
          type: 'error',
          message: err
        })})
      this.$refs.permform.$refs.trans.clearQuery('left')
      this.$refs.permform.$refs.trans.clearQuery('right')
    },
    handlelistMember(value) {
      // 获取用户组成员列表
      this.group_id = value.id
      this.group_name = value.group_name + '组成员列表'
      this.dialogVisibleUser = true
      this.member = value.users
    },
    handleDeleteGroupMember(value) {
      // 删除用户组成员
      const data = {id: this.group_id, user_id: value.id}
      deleteGroupUserMember(data).then(
          response => {
            if(response.code === 200 || response.code === 201){
              this.$message({
                type: 'success',
                message: response.message
              })
            }else{
              this.$message({
                type: 'error',
                message: response.message
              })
            }
          }).catch( err=> {
        this.$message({
          type: 'error',
          message: err
        })})
            this.dialogVisibleUser = false
            this.fetchData()
    },
    handleCurrentChange(val) {
      // 分页跳转
      this.params.page = val
      this.fetchData()
    },
    handleFilter() {
      // 用户组搜索功能
      this.params.page = 1
      this.fetchData()
    },
    handleCreateCancel() {
      // 对话框取消实现
      this.dialogVisibleCreate = false
      this.fetchData()
    },
    handleUpdateCancel() {
      // 对话框取消实现
      this.dialogVisibleUpdate = false
      this.fetchData()
    },
    handlePermCancel() {
      // 对话框取消实现
      this.dialogVisiblePerm = false
      this.$refs.permform.$refs.trans.clearQuery('left')
      this.$refs.permform.$refs.trans.clearQuery('right')
      this.fetchData()
    }
  }
}

</script>

<style scoped>
.group {
  padding: 10px;
}
  .header-class {
    margin-top: 10px;
  }
    /*.el-col {*/
    /*  border-radius: 4px;*/
    /*}*/
    .grid-content {
      border-radius: 4px;
      min-height: 36px;
    }
  .pagination {
      text-align: center;
      margin-top: 10px;
    }
</style>
