<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="server-form">
      <el-form-item label="redis集群名" prop="cluster_name">
        <el-input v-model="form.cluster_name" placeholder="请输入redis集群名"></el-input>
      </el-form-item>
      <el-form-item label="redis host列表" prop="hosts" >
        <el-input v-model="form.hosts" placeholder="请输入hosts列表，如['ip1:port1','ip2:port2']这种形式"></el-input>
      </el-form-item>
      <el-form-item label="访问密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入集群访问密码"></el-input>
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
          hosts: '',
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
          { required: true, message: '请输入redis集群名字', trigger: 'blur' }],
        hosts: [
          { required: true, message: '请输入redis hosts列表', trigger: 'blur' },
          { validator: function(rule, value, callback) {
            // 校验中文的正则：/^\[(('|")(\d{1,3}\.){3}\d{1,3}:\d{1,5}('|"),?)+\]$/
            if (/^\[('(\d{1,3}\.){3}\d{1,3}:\d{1,5}'\,?)+\]$/.test(value) === false) {
              callback(new Error("请按要求输入redis列表，要求['ip1:port1','ip2:port2',...]"))
            } else {
              // 校验通过
              callback()
            }
          }, trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入redis访问密码', trigger: 'blur' }
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
