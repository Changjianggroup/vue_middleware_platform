<template>
    <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
            <el-form-item label="访问ip" prop="remote_ip">
                <el-input
                        v-model="queryParams.remote_ip"
                        placeholder="请输入访问的ip地址"
                        clearable
                        style="width: 240px;"
                        size="small"    />
                <!--                                @keyup.enter.native="handleQuery"-->

            </el-form-item>
            <el-form-item label="操作用户" prop="create_by">
                <el-input
                        v-model="queryParams.create_by"
                        placeholder="请输入用户名称"
                        clearable
                        style="width: 240px;"
                        size="small"
                />

            </el-form-item>
          <el-form-item label="请求方法" prop="method">
            <el-select v-model="queryParams.method" placeholder="选择请求方法" :clearable=true >
              <el-option
                  v-for="item in method_options"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
              </el-option>
            </el-select>

          </el-form-item>
          <el-row>
          <el-form-item label="开始时间" prop="start_date">
                <el-date-picker
                        v-model="queryParams.start_date"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="end_date">
                <el-date-picker
                        v-model="queryParams.end_date"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
          </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                        type="warning"
                        icon="el-icon-download"
                        size="mini"
                        @click="handleExport"
                >导出</el-button>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="list">
            <el-table-column label="id" width="60"  prop="id"  />
            <el-table-column label="请求相对路径" width="120" prop="path"  />
          <el-table-column label="操作用户" width="70" prop="create_by"  />
            <el-table-column label="请求方法" width="70" prop="method"  />
            <el-table-column label="请求参数" width="220" prop="param"  />
            <el-table-column label="请求IP地址" width="120"  prop="remote_ip"  />
            <el-table-column label="更新时间" width="220" align="center" prop="update_time"  />
          <el-table-column label="返回码" width="60" align="center" prop="resp_code"  />
          <el-table-column label="返回消息" width="140" align="center" prop="resp_message"  />
            <el-table-column label="描述" width="120" align="center" prop="description"  />
        </el-table>
        <pagination
                v-show="total>0"
                :total="total"
                :page.sync="queryParams.page"
                :limit.sync="queryParams.page_size"
                @pagination="getList"
        />
    </el-card>
</template>

<script>
    import { getAuditRecordList } from '@/api/audit'
    import { formatJson } from '@/utils'
    export default {
        name: 'AuditList',
        data() {
            return {
                // 遮罩层
                loading: true,
                // 总条数
                total: 0,
                // 表格数据
                list: [],
                // 查询参数
                queryParams: {
                    page: 1,
                    page_size: 10,
                    start_date: undefined,
                    end_date: undefined,
                    create_by: undefined,
                    remote_ip: undefined,
                    method: undefined,
                },
              method_options:[
                {value: 'GET'},
                {value: 'POST'},
                {value: 'DELETE'},
                {value: 'PATCH'},
              ],
              pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                },
                shortcuts: [{
                  text: '今天',
                  onClick(picker) {
                    picker.$emit('pick', new Date());
                  }
                }, {
                  text: '昨天',
                  onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '一周前',
                  onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                  }
                }]
              }, 
            }
        },
        created() {
            this.getList()
        },
        methods: {
            /** 查询数据库变更记录 */
            getList() {
                this.loading = true
              getAuditRecordList(this.queryParams).then(response => {
                        // console.log(response)
                        this.list = response.result
                        this.total = response.total
                        this.loading = false
                    }
                )

            },
            /** 搜索按钮操作 */
            handleQuery() {
              this.getList()

            },
            /** 重置按钮操作 */
            resetQuery() {
                this.queryParams.remote_ip = ''
                this.queryParams.user_id = ''
                this.queryParams.create_by = ''
                this.queryParams.start_date = undefined
                this.queryParams.end_date = undefined
                this.handleQuery()
            },
            /** 导出按钮操作 */
            handleExport() {
                // const queryParams = this.queryParams
                this.$confirm('是否确认导出API请求表单?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    import('@/utils/Export2Excel').then(excel => {
                        const tHeader = ['id', '请求相对路径','操作用户','请求方法', '请求参数', '请求IP地址', '操作时间','返回码','返回消息','请求描述']
                        const filterVal = ['id','path', 'create_by', 'method', 'param', 'remote_ip','update_time','resp_code', 'resp_message','description']
                        for (let i in this.list ) {
                            for ( let j in this.userList){
                                if (this.list[i]['user_id'] === this.userList[j]['id']) {
                                    this.list[i]['username'] = this.userList[j]['username']
                            }
                            }
                        }
                        const list = this.list
                        const data = formatJson(filterVal, list)
                        excel.export_json_to_excel({
                            header: tHeader,
                            data,
                            filename: 'API请求日志',
                            autoWidth: true, // Optional
                            bookType: 'xlsx' // Optional
                        })
                    }).catch(err => {
                      this.$message({
                        type: 'error',
                        message: err
                      })
                    })
                })
            }
        }
    }
</script>

<style scoped>
</style>
