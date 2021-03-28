<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px" class="update-ugroup">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" :readonly="true" ></el-input>
      </el-form-item>
      <el-form-item label="用户组" prop="groups">
        <el-select v-model="currentGobj"  placeholder="请选择用户组" style="width: 100%">
          <el-option v-for="(item,index) in goption" :value="item.id" :label="item.group_name" :key="index" />
        </el-select>
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
  name: 'UpdateUgroup',
  props: {
    form: {
      type: Object,
      default: function() {
        return {
          username: '',
        }
      }
    },
    gobj: {
      type: Object,
      default: () => {}
    },
    goption: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentGobj: this.gobj
    }
  },
  watch: {
    gobj() {
        this.currentGobj = this.gobj.id
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (typeof this.currentGobj === Object) {
            this.$emit('submit', this.currentGobj.id, this.form.id)
          }else {
            this.$emit('submit', this.currentGobj, this.form.id)
          }
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
.update-ugroup {
  position: relative;
  display: block
}
.button-right {
  text-align: right;
}
</style>
