<template>
    <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
            <el-form-item label="访问地址" prop="remote_ip">
                <el-input
                        v-model="queryParams.remote_ip"
                        placeholder="请输入登录地址"
                        clearable
                        style="width: 240px;"
                        size="small"    />
                <!--                                @keyup.enter.native="handleQuery"-->

            </el-form-item>
            <el-form-item label="用户名称" prop="username">
                <el-input
                        v-model="username"
                        placeholder="请输入用户名称"
                        clearable
                        style="width: 240px;"
                        size="small"
                />
                <!--                                @keyup.enter.native="handleQuery"-->

            </el-form-item>
            <div class="block">
                <span class="demonstration">开始时间  </span>
                <el-date-picker
                        v-model="start_date"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
                <span class="demonstration">  结束时间  </span>
                <el-date-picker
                        v-model="end_date"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
            <el-option
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
            />
                <span class="span">&nbsp;&nbsp;</span>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
            </div>
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
            <el-table-column label="序号" width="50" align="center" prop="num" />
            <el-table-column label="id" width="50" align="center" prop="id"  />
            <el-table-column label="请求相对路径" width="180" align="center" prop="url"  />
            <el-table-column label="请求方法" align="center" prop="method" width="150"  />
            <el-table-column label="请求参数" width="200" align="center" prop="query_string"  />
            <el-table-column label="请求IP地址" align="center" prop="remote_ip" width="200" />
            <el-table-column label="操作时间" align="center" prop="datetime" width="250" />
            <!--            <el-table-column label="用户名" align="center" prop="user_id" width="50" :formatter="formatLoginType">-->
            <el-table-column label="用户名" align="center" prop="user_id" width="80" :formatter="formatuserID" />
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
    import { getRequestList } from '@/api/audit'
    import { getUserList } from '@/api/users'
    import { formatJson } from '@/utils'
    export default {
        name: 'Requestinfor',
        data() {
            return {
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非多个禁用
                multiple: true,
                // 查询用户
                username: '',
                // 总条数
                total: 0,
                // 表格数据
                list: [],
                // 用户数据
                userList: [],
                // 状态数据字典
                statusOptions: [],
                // 查询参数
                queryParams: {
                    page: 1,
                    page_size: 10,
                    user_id: undefined,
                    remote_ip: undefined
                }
            }
        },
        created() {
            this.getUser()
            this.getList()
            // this.getDicts('sys_common_status').then(response => {
            //     this.statusOptions = response.data
            // })
        },
        methods: {
            /** 查询数据库变更记录 */
            getList() {
                this.loading = true
                getRequestList(this.queryParams).then(response => {
                        this.list = response.results
                        for (let i in this.list) {
                            this.list[i]['num'] = parseInt(i) + 1
                        }
                        this.total = response.count
                        this.loading = false
                    }
                )

            },
            /** 获取用户列表 */
            getUser() {
                getUserList().then(response => {
                        this.userList = response.results
                    }
                )
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.page = 1
                for (let i in this.userList) {
                    if (this.username === this.userList[i]['username']) {
                        this.queryParams.user_id = this.userList[i]['id']
                    }
                }
                this.queryParams.event_type = this.event_type_value
                this.getList()
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.username = ''
                this.queryParams.remote_ip = ''
                this.queryParams.user_id = ''
                this.handleQuery()
            },
            /** 转换用户id状态为用户名 */
            formatuserID(row, column) {
                let val = ''
                for (let i in this.userList) {
                    if (row.user_id === this.userList[i]['id']) {
                        val = this.userList[i]['username']
                    }
                }
                return val
            },
            /** 导出按钮操作 */
            handleExport() {
                // const queryParams = this.queryParams
                this.$confirm('是否确认导出API请求数据表单?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.downloadLoading = true
                    import('@/utils/Export2Excel').then(excel => {
                        const tHeader = ['编号', 'id', '请求相对路径','请求方法', '请求参数', '请求IP地址', '操作时间','用户ID','用户名']
                        const filterVal = ['num', 'id','url', 'remote_ip', 'method', 'query_string','datetime','user_id', 'username']
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
                        this.downloadLoading = false
                    })
                })
            }
        }
    }
</script>

<style scoped>
</style>
