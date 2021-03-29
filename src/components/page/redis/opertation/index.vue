<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-emoji"></i>redis集群操作</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="wrapper">
        <div class="grid-one">
          <div class="redis_cluster_select">
            <div class="name_select">
              <el-tag>redis集群选择（name)</el-tag>
              <el-select
                  v-model="value_cluster_name"
                  :remote-method="remoteSearchRedisClusterName"
                  :loading="loading"
                  size="medium"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  default-first-option
                  placeholder="redis集群名关键词选择"
                  style="width: 60%"
                  @change="setSelectedHosts">
                <el-option
                    v-for="item in cluster_options"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
            </div>
            <div class="host_select">
              <el-tag>redis集群选择（hosts)</el-tag>
              <el-select
                  v-model="value_hosts"
                  :remote-method="remoteSearchRedisClusterHosts"
                  :loading="loading"
                  size="medium"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  default-first-option
                  placeholder="redis集群hosts关键词选择"
                  style="width: 70%"
                  @change="setSelectedClusterName">
                <el-option
                    v-for="item in cluster_options"
                    :key="item.hosts"
                    :label="item.hosts"
                    :value="item.hosts">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="grid-two">
          <el-tag style="width: 90%; text-align: center">结果输出</el-tag>
          <div class="reslut" >
            <pre>{{ result_code }}<br>{{ result_msg }}</pre>
          </div>
        </div>
        <div class="grid-three">
          <div class="search_all_key">
<!--            <el-button type="primary" @click="handlershowALLKey">查看所有key</el-button>-->
            <el-button type="primary" @click="handlershowDBSize">查看key数量(dbsize)</el-button>
            <el-button type="primary" @click="handlershowClusterInfo">查看集群信息(cluster info)</el-button>
            <el-button type="primary" @click="handlershowClusterNode">查看集群节点(cluster node)</el-button>
          </div>
        </div>
        <div class="grid-four">
          <div class="get_key_value">
            <el-collapse>
              <el-collapse-item title="查询键值" name="1">
               <el-col>
                 <el-input
                     v-model="input_pattern_for_key_value"
                     placeholder="请输入要查询的key,模糊字符串以‘*’代替"
                     clearable
                     style="width: 40%">
                 </el-input>
                 <el-button type="primary" plain @click="handleGetKeys">查询</el-button>
                 <el-tag type="danger">模糊查询请以'*'代替查询key中的模糊字符串,'*'匹配0-N个字符</el-tag>
               </el-col>
              </el-collapse-item>
              <el-collapse-item title="TTL查询" name="2">
                <el-input
                    v-model="input_key_for_ttl"
                    placeholder="请输入要查询的键(key)"
                    clearable
                    style="width: 40%">
                </el-input>
                <el-button type="primary" plain @click="handleGetKeyTTL">开始查询</el-button>
              </el-collapse-item>
              <el-collapse-item title="删除键-值(key-value)" name="3">
                <el-col>
                  <el-tag>精确删除</el-tag>
                  <el-input
                      v-model="input_key_for_del"
                      placeholder="请输入要删除的键(key)"
                      clearable
                      style="width: 40%">
                  </el-input>
                  <el-popconfirm
                      confirm-button-text="好的"
                      cancel-button-text="不用了"
                      icon="el-icon-info"
                      icon-color="red"
                      title="确定删除吗？"
                      @confirm="handleDelKey"
                  >
                    <el-button slot="reference" type="danger">删除</el-button>
                  </el-popconfirm>
                </el-col>
             <el-col>
               <el-tag>模糊删除</el-tag>
               <el-input
                   v-model="input_pattern_key_for_del"
                   placeholder="请输入要删除的模糊键(key)，'*'代替模糊字符串"
                   clearable
                   style="width: 40%">
               </el-input>
               <el-popconfirm
                   confirm-button-text="好的"
                   cancel-button-text="不用了"
                   icon="el-icon-info"
                   icon-color="red"
                   title="确定删除吗？"
                   @confirm="handleDelPatternKey"
               >
                 <el-button slot="reference" type="danger">删除</el-button>
               </el-popconfirm>
             </el-col>
              </el-collapse-item>
              <el-collapse-item title="新建键-值(key-value)" name="4">
                <el-input
                    v-model="input_key_for_create"
                    placeholder="请输入要新建的键(key)"
                    clearable
                    style="width: 40%">
                </el-input>
                <el-input
                    v-model="input_value_for_create"
                    placeholder="请输入要新建的值(value)"
                    clearable
                    style="width: 40%">
                </el-input>
                <el-button type="primary" plain @click="handleCreateKey">新建</el-button>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getServerList, showDBSize, getKeys, getKeyTTL, delKey, delPatternKeys,createKey, clusterNode, clusterInfo } from '@/api/redis'
// import { getSupplierList } from '@/api/supplier'
// import { getManufactoryList } from '@/api/manufactory'
// import { getIdcList } from '@/api/idc'

export default {
  name: 'redisOperation',
  data() {
    return {
      cluster_options: [],
      value_id: '',
      value_cluster_name: '',
      value_hosts: '',
      server_list: [],
      loading: false,
      result_code: '',
      result_msg: '',
      totalNum: 0,
      input_pattern_for_key_value: '',
      input_key_for_ttl: '',
      input_key_for_del: '',
      input_key_for_create: '',
      input_value_for_create: '',
      input_pattern_key_for_del: '',
      selected_server_id: null,
      params: {
        page: 1,
        keywords: '',
        page_size: 10000
      },
      kwargs: {}
    }
  },
  created() {
    this.fetchData()
    this.value_id = this.$store.state.redis.server_id
  },
  methods: {
    fetchData() {
      getServerList(this.params).then(
          // 获取redis集群列表
          res => {
            this.server_list = res.result
            this.totalNum = res.total
            //
            if (this.$store.state.redis.server_id !== 0) {
              this.value_cluster_name = this.server_list.find(item => {
                if (parseInt(item.id) === this.$store.state.redis.server_id) {
                  return item
                }
              }).name
              this.value_hosts = this.server_list.find(item => {
                if (parseInt(item.id) === this.$store.state.redis.server_id) {
                  return item
                }
              }).hosts
            }
          },
          err => {
            this.$message({
              type: 'error',
              message: err
            })
          }
      ).catch( err => {
        this.$message({
        type: 'error',
        message: err
      })})
    },
    remoteSearchRedisClusterName(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.cluster_options = this.server_list.filter(item => {
            return item.name.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.cluster_options = []
      }
    },
    remoteSearchRedisClusterHosts(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.cluster_options = this.server_list.filter(item => {
            return item.hosts.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.cluster_options = []
      }
    },
    setSelectedClusterName() {
      this.value_cluster_name = this.cluster_options.find(item => {
        if (item.hosts === this.value_hosts) {
          return item
        }
      }).name
    },
    setSelectedHosts() {
      this.value_hosts = this.cluster_options.find(item => {
        if (item.name === this.value_cluster_name) {
          return item
        }
      }).hosts
    },
    handlershowDBSize() {
      const obj_item = this.server_list.find(item => {
        if (item.name === this.value_cluster_name) {
          return item
        }
      }).id
      showDBSize(obj_item).then(
          // 获取redis集群列表
          res => {
            if(res.code === 403) {
                this.$message({
                  type: 'error',
                  message: res.message
                })
            }else {
              let msg = "\n"
              if ( res.result instanceof Object) {
                for(var key in  res.result){
                  msg = msg + key + ":" + '\n'
                  msg = msg + res.result[key] + '\n'
                }
                // msg = JSON.stringify(res.result).toString()
              } else {
                msg = res.result
              }
              this.result_code = '返回code：' + res.code
              this.result_msg = '返回结果：' + msg
            }
            }).catch( err => {
        this.$message({
          type: 'error',
          message: err
        })
    })},
    handleGetKeys() {
      this.value_id = this.server_list.find(item => {
        if (item.name === this.value_cluster_name) {
          return item
        }
      }).id
      this.kwargs.id = this.value_id
      this.kwargs.pattern = this.input_pattern_for_key_value
      if (this.input_pattern_for_key_value === '*') {
        this.$message({
          type: 'error',
          message: '无法查询所有键值对'
      })}else {
      getKeys(this.kwargs).then(
          res => {
            if (res.code === 403) {
              this.$message({
                type: 'error',
                message: res.message
              })
            } else {
              const key_list = res.message
              if (key_list.length === 0) {
                this.result_code = '返回code：' + res.code
                this.result_msg = '返回结果：\n' + 'None'
              } else if (typeof key_list === "string") {
                this.result_code = '返回code：' + res.code
                this.result_msg = '返回结果：\n' + res.message
              } else {
                this.result_msg = '返回结果：\n'
                for (var index = 0; index < key_list.length; index++) {
                  this.result_msg = this.result_msg + JSON.stringify(key_list[index]) + '\n'
                }
              }
            }
          }).catch( err =>  {
        this.$message({
          type: 'error',
          message: err
        })
      })}
    },
    handleGetKeyTTL() {
      this.value_id = this.server_list.find(item => {
        if (item.name === this.value_cluster_name) {
          return item
        }
      }).id
      this.kwargs.id = this.value_id
      this.kwargs.key = this.input_key_for_ttl
      getKeyTTL(this.kwargs).then(
          // 获取redis集群列表
          res => {
            if (res.code === 403) {
            this.$message({
              type: 'error',
              message: res.message
            })
          } else {
              this.result_code = '返回code：' + res.code
              this.result_msg = '返回结果：' + res.message
            }

          }).catch(
          err => {
            this.$message({
              type: 'error',
              message: err
            })
          }
      )
    },
    handleDelKey() {
      this.value_id = this.server_list.find(item => {
        if (item.name === this.value_cluster_name) {
          return item
        }
      }).id
      this.kwargs.id = this.value_id
      this.kwargs.key = this.input_key_for_del
      delKey(this.kwargs).then(
          // 获取redis集群列表
          res => {
            if (res.code === 403) {
              this.$message({
                type: 'error',
                message: res.message
              })
            } else {
            this.result_code = '返回code：' + res.code
            if (parseInt(res.message) === 1) {
              this.result_msg = '返回结果：成功删除'
            }
            if (parseInt(res.message) === 0) {
              this.result_msg = '返回结果：不存在该键'
            }
          }}).catch(
          err => {
            this.$message({
              type: 'error',
              message: err
            })
          }
      )
    },
    handleDelPatternKey() {
      this.value_id = this.server_list.find(item => {
        if (item.name === this.value_cluster_name) {
          return item
        }
      }).id
      this.kwargs.id = this.value_id
      this.kwargs.pattern = this.input_pattern_key_for_del
      delPatternKeys(this.kwargs).then(
            res => {
              if (res.code === 403) {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              } else {
                const key_list = res.message
                if (typeof key_list === "string") {
                  this.result_code = '返回code：' + res.code
                  this.result_msg = '返回结果：\n' + res.message
                } else {
                  this.result_msg = '返回结果：\n'
                  for (var index = 0; index < key_list.length; index++) {
                    this.result_msg = this.result_msg + JSON.stringify(key_list[index]) + '\n'
                  }
                }
              }
            }).catch( err => {
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    handleCreateKey() {
      this.value_id = this.server_list.find(item => {
        if (item.name === this.value_cluster_name) {
          return item
        }
      }).id
      this.kwargs.id = this.value_id
      this.kwargs.key = this.input_key_for_create
      this.kwargs.value = this.input_value_for_create
      createKey(this.kwargs).then(
          // 获取redis集群列表
          res => {
            if (res.code === 403) {
              this.$message({
                type: 'error',
                message: res.message
              })
            } else {
              this.result_code = '返回结果：' + res.code
              this.result_msg = res.message
            }
          }).catch(
          err => {
            this.$message({
              type: 'error',
              message: err
            })
          }
      )
    },
    handlershowClusterInfo() {
      this.value_id = this.server_list.find(item => {
        if (item.name === this.value_cluster_name) {
          return item
        }
      }).id
      clusterInfo(this.value_id).then(
              // 获取cluster info
              res => {
                if (res.code === 403) {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              } else {
                let msg = ""
                if ( res.result instanceof Object) {
                  for(var key in  res.result){
                    msg = msg + '\n'
                    msg = msg + "集群节点" + key + ":" + '\n'
                    if (res.result[key] instanceof Object){
                      for (var value_key in res.result[key]) {
                        msg = msg + value_key + ":" + '\n'
                        msg = msg + res.result[key][value_key] + '\n'
                      }
                    } else {
                      msg = msg + res.result[key] + '\n'
                    }

                  }
                  // msg = JSON.stringify(res.msg).toString()
                } else {
                  msg = res.msg
                }
                this.result_code = '返回code：' + res.code
                this.result_msg = '返回结果：' + msg
              }}).catch(
              err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
    },
    handlershowClusterNode() {
      this.value_id = this.server_list.find(item => {
        if (item.name === this.value_cluster_name) {
          return item
        }
      }).id
      clusterNode(this.value_id).then(
              // 获取cluster info
              res => {
                if (res.code === 403 || res.code === 500) {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                } else {
                let msg = ""
                if (res.code === 200){
                  for (var i in res.result)
                  {
                    msg = msg + '\n'
                    msg = msg + "集群节点" + res.result[i]['host'] + ":" + res.result[i]['port'] + "\n"
                    msg = msg + 'id:' + res.result[i]['id'] + '\n'
                    msg = msg + 'cluster-bus-port:' + res.result[i]['cluster-bus-port'] + '\n'
                    msg = msg + 'flags:' + res.result[i]['flags'] + '\n'
                    msg = msg + 'master:' + res.result[i]['master'] + '\n'
                    msg = msg + 'ping-sent:' + res.result[i]['ping-sent'] + '\n'
                    msg = msg + 'pong-recv:' + res.result[i]['pong-recv'] + '\n'
                    msg = msg + 'link-state:' + res.result[i]['link-state'] + '\n'
                    msg = msg + 'migrations:' + res.result[i]['migrations'] + '\n'
                  }
                } else {
                  msg = msg + res.msg
                }
                this.result_code = '返回code：' + res.code
                this.result_msg = '返回结果：' + msg
              }}).catch(
              err => {
            this.$message({
              type: 'error',
              message: err.response
            })
          }
      )
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 30% 30% 40%;
  grid-template-rows: 30% 10% 40% 60%;
}
.grid-one {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
.grid-two {
  grid-column: 3 / 4;
  grid-row: 1 / 5;
}
.grid-three {
  grid-column: 1 / 2;
  grid-row:  2 / 3 ;
}
.grid-four {
  grid-column: 1 / 3;
  grid-row: 3/ 4;
}
.redis_cluster_select {
  padding: 10px;
  margin-top: 2px;
}
.name_select {
  margin-top: 10px;
}
.host_select {
  /*padding: 10px;*/
  margin-top: 10px;
}
.search_all_key {
  margin-left: 20px;
  padding: 5px;
  width: 200%
}
.get_key_value {
  margin-left: 20px;
  margin-top: 10px;
}
.reslut {
  background: darkgrey;
  width: 90%;
  height: 120%;
  margin: 0px;
  padding: 0px;
}
pre {
  margin: 0px;
  max-height: 400px;
  max-width: 500px;
  overflow: auto;
  background-color: darkgrey;
  word-break: normal !important;
  word-wrap: normal !important;
  white-space: pre !important;
}
</style>
