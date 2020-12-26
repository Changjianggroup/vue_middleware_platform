<template>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="登录地址" prop="remote_ip">
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
                                v-model="queryParams.username"
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
                    <el-table-column label="序号" width="100" align="center" prop="num" />
                    <el-table-column label="用户ID" width="150" align="center" prop="user_id" />
                    <el-table-column label="登录用户" width="200" align="center" prop="username" />
                    <el-table-column label="登录IP" align="center" prop="remote_ip" width="300"  />
                    <el-table-column label="登录状态" width="100" align="center" prop="login_type" :formatter="formatLoginType" />
                    <el-table-column label="更新时间" align="center" prop="datetime" width="250">
                    </el-table-column>
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
    import { getLoginList } from '@/api/audit'
    import { formatJson } from '@/utils'
    export default {
        name: 'Logininfor',
        data() {
            return {
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非多个禁用
                multiple: true,
                // 总条数
                total: 0,
                // 表格数据
                list: [],
                // 状态数据字典
                statusOptions: [],
                // 查询参数
                queryParams: {
                    page: 1,
                    page_size: 10,
                    remote_ip: undefined,
                    username: undefined,
                    login_type: undefined,
                    start_date: undefined,
                    end_date: undefined,
                },
                start_date: '',
                end_date: '',
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
            // this.getDicts('sys_common_status').then(response => {
            //     this.statusOptions = response.data
            // })
        },
        methods: {
            addDateTime(val) {

                let dateTime = new Date(val);

                dateTime = dateTime.setDate(dateTime.getDate() + 1);

                dateTime = new Date(dateTime);

                return dateTime.toLocaleDateString();

            },
            /** 查询登录日志列表 */
            getList() {
                this.loading = true
                if (this.start_date && this.end_date) {
                    this.queryParams.start_date = this.start_date
                    this.queryParams.end_date = this.addDateTime(this.end_date)
                }
                else {
                    this.queryParams.start_date = undefined
                    this.queryParams.end_date = undefined
                }
                getLoginList(this.queryParams).then(response => {
                        this.list = response.results
                        for (let i in this.list) {
                            this.list[i]['num'] = parseInt(i) + 1
                        }
                        this.total = response.count
                        this.loading = false
                    }
                )

            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.page = 1
                this.getList()
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.dateRange = []
                this.start_date = ''
                this.end_date = ''
                this.resetForm('queryForm')
                this.handleQuery()
            },
            /** 转换登录状态为中文 */
            formatLoginType(row, column) {
                if (row.login_type === 0) {
                    return '登录'
                }
                else if (row.login_type === 1) {
                    return '登出'
                }
                else if (row.login_type === 2) {
                    return '登录失败'
                }
                else {
                    return '位置状态'
                }
            },
            /** 导出按钮操作 */
            handleExport() {
                // const queryParams = this.queryParams
                this.$confirm('是否确认导出现在的登录日志表单?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.downloadLoading = true
                    import('@/utils/Export2Excel').then(excel => {
                        const tHeader = ['编号',  '用户编号','用户名称', '登陆IP',  '登陆状态', '登陆日期']
                        const filterVal = ['num', 'user_id', 'username', 'remote_ip', 'login_type', 'datetime']
                        const list = this.list
                        const data = formatJson(filterVal, list)
                        excel.export_json_to_excel({
                            header: tHeader,
                            data,
                            filename: '登陆日志',
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
