<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="idc-form">
      <el-form-item label="权限组名" prop="group_name">
        <el-input v-model="form.group_name" placeholder="请输入组名"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item class="button-right">
        <el-button size="small" @click="cancelForm">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm">{{ value }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'GroupForm',
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          group_name: '',
          desc: '',
        }
      }
    },
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      rules: {
        group_name: [
          { required: true, message: '请输入权限组名', trigger: 'blur' },
          { max: 80, message: '长度不能超过80个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
          return
        }
      })
    },
    cancelForm() {
      this.$emit('cancel')
    },
    reset() {
      this.form.group_name = ''
      this.form.desc = ''
    }
  }
}
</script>

<style scoped>
.idc-form {
  position: relative;
  display: block
  }
.button-right {
      text-align: right;
  }
</style>
