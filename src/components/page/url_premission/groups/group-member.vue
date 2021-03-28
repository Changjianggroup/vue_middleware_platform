<template>
  <div class="groupmember">

    <el-table
      :data="values"
      style="width: 100%">
      <el-table-column
        label="用户id"
        min-width= "80"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="60">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="MemberDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getUserList} from '@/api/users'
export default {
  name: 'GroupMember',
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      users_list: [],
    }
  },
  methods: {
    MemberDelete(value) {
      this.$confirm(`此操作将${value.username}用户移出该成员组, 是否继续?`, '删除机房', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', value)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getUsername(id) {
      const queryParams = {id: id}
      getUserList(queryParams).then( res =>{
            const user_dict = {id: id, user_name: res}
            this.users_list.push(user_dict)
          }
      ).catch(() => {
        const user_dict = {id: id, user_name: 'unkonw'}
        this.users_list.push(user_dict)
      })
    },
  },

}

</script>

<style  scoped>

</style>
