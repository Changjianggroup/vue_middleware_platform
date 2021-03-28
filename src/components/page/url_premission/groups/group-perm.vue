<template>
  <div class="groupperm">
    <el-form ref="form" :model="form" label-width="100px" class="group-perm">
      <el-form-item label="组名" prop="group_name">
        <el-input v-model="form.group_name" :readonly="true" ></el-input>
      </el-form-item>
      <el-form-item label="url访问权限" prop="url_permission">
        <div class="user-transfer">
          <el-transfer
                  ref="trans"
                  v-model="groupPermList"
                  :data="list"
                  :titles="['可选权限', '已选权限']"
                  :props="{
            key: 'id',
            label: 'description'
          }"
                  filterable
                  filter-placeholder="请输入内容">
          </el-transfer>
        </div>
      </el-form-item>
      <el-form-item class="button-right">
        <el-button size="small" @click="cancelForm">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'GroupPerm',
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          username: '',
          name: '',
          email: '',
          phone: ''
        }
      }
    },
    list: {
      type: Array,
      default: () => []
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      groupPermList: this.values,
    }
  },
  watch: {
    values() {
      this.groupPermList = this.values
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form.id, this.groupPermList)
        } else {
          return
        }
      })
    },
    cancelForm() {
      this.$emit('cancel')
    }
  }
}

</script>

<style>
.group-perm {
  position: relative;
  display: block;
  }
    .button-right {
      text-align: right;
  }
/*.user-transfer >>> .el-transfer-panel {*/
/*  width:250px;*/
/*}*/


.el-transfer-panel__list.is-filterable {
  width: 280px;
  height: 500px;
}
.el-transfer-panel {
  width: 280px;
  height: 600px;
}

</style>
