<template>
  <div class="server-list">
    <el-table
      ref="listTable"
      :data="values"
      style="width: 100%"
      @selection-change="schange">
      <el-table-column
        type="selection"
        width="35">
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="id:">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="redis集群名:">
              <span>{{ props.row.cluster_name }}</span>
            </el-form-item>
            <el-form-item label="host列表:">
              <span>{{ props.row.hosts }}</span>
            </el-form-item>
            <el-form-item label="描述:">
              <span>{{ props.row.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="id"
        min-width="20">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="redis集群名"
        min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.cluster_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="hosts列表"
        min-width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.hosts }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="集群描述"
        min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="控制" min-width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="serverEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="success"
            @click="serverOperation(scope.row)">操作</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="serverDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'ServerList',
  props: {
    values: {
      type: Array,
      default: function() {
        return []
      }
    },
    mulselect: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    schange(val) {
      this.$emit('mulselect', val)
    },
    serverEdit(server) {
      this.$emit('edit', server)
    },
    serverDelete(server) {
      this.$confirm(`此操作将删除该${server.cluster_name} 集群记录, 是否继续?`, '删除redis集群', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', server.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    serverOperation(server) {
      this.$emit('request', server.id)
    }
  }
}

</script>

<style  scoped>

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
