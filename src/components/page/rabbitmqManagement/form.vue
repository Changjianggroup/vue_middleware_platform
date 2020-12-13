<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="server-form">
      <el-form-item label="rabbitmq集群名" prop="cluster_name">
        <el-input v-model="form.cluster_name" placeholder="请输入rabbitmq集群名"></el-input>
      </el-form-item>
      <el-form-item label="web管理界面url" prop="url" >
        <el-input v-model="form.url" placeholder="请输入web管理界面地址"></el-input>
      </el-form-item>
      <el-form-item label="访问账户" prop="username">
        <el-input v-model="form.username" placeholder="请输入web管理界面访问用户名"></el-input>
      </el-form-item>
      <el-form-item label="访问密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入web管理界面访问密码"></el-input>
      </el-form-item>
      <el-form-item label="集群描述" prop="description">
        <el-input v-model="form.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item class="button-right">
        <el-button size="small" @click="cancelForm">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm">{{ bname }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'ServerForm',
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          cluster_name: '',
          url: '',
          username: '',
          password: '',
          description: ''
        }
      }
    },
    bname: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      rules: {
        cluster_name: [
          { required: true, message: '请输入rabbitmq集群名字', trigger: 'blur' }],
        url: [
          { required: true, message: '请输入rabbitmq网页管理界面地址', trigger: 'blur' },
          { validator: function(rule, value, callback) {
            // 校验中文的正则：/^\[(('|")(\d{1,3}\.){3}\d{1,3}:\d{1,5}('|"),?)+\]$/
            if (/^http(s)?:\/\/.*$/.test(value) === false) {
              callback(new Error("请按要求输入rabbitmq网页管理界面地址，要求http(s)://开头"))
            } else {
              // 校验通过
              callback()
            }
          }, trigger: 'blur'
          }
        ],
        username: [
          { required: true, message: '请输入web管理界面账户', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入web管理界面密码', trigger: 'blur' }
        ],
        description: [
          { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }

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
    }
  }
}
</script>

<style scoped>
.server-form {
  position: relative;
  display: block
  }
  .button-right {
      text-align: right;
  }
</style>
