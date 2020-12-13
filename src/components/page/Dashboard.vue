<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb201" style="height:450px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{username}}</div>
<!--                            <div>{{role}}</div>-->
                        </div>
                    </div>
                    <div class="user-info-list">
<!--                        上次登录时间：-->
<!--                        <span>2019-11-01</span>-->
                    </div>
                    <div class="user-info-list">
<!--                        上次登录地点：-->
<!--                        <span>东莞</span>-->
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb202">
                    <el-col :span="10">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                              <router-link to="/perm/user">
                                <i class="el-icon-user grid-con-icon"></i>
                              </router-link>
                                <div class="grid-cont-right">
                                    <div class="grid-num"> {{ userNum }}</div>
                                    <div>用户数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="10">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                              <router-link to="/perm/group">
                                <i class="el-icon-user-solid grid-con-icon"></i>
                              </router-link>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ groupNum }}</div>
                                    <div>用户组</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
              <el-row :gutter="20" class="mgb203">
              <el-col :span="10">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                  <div class="grid-content grid-con-3">
                    <router-link to="/redis/management">
                      <i class="el-icon-cpu grid-con-icon"></i>
                    </router-link>
                    <div class="grid-cont-right">
                      <div class="grid-num"> {{ redisClusterNum }}</div>
                      <div>redis集群</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
                <el-col :span="10">
                  <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-3">
                      <router-link to="/rabbitmq/management">
                        <i class="el-icon-chat-dot-round grid-con-icon"></i>
                      </router-link>
                      <div class="grid-cont-right">
                        <div class="grid-num"> {{ rabbitmqClusterNum }}</div>
                        <div>rabbitmq集群</div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getServerList } from '@/api/redis_server'
import { getUserList } from '@/api/users'
import { getGroupList } from '@/api/groups'
import { getRabbitmqServerList} from '@/api/rabbitmq_server'
import { mapGetters } from 'vuex'
export default {
    name: 'dashboard',
    data() {
      return {
        redisClusterNum: '',
        rabbitmqClusterNum: '',
        userNum: '',
        groupNum: ''
      }
    },
    // components: {
    // },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'username'
    ])
  },
    created() {
      this.fetchData()
    },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
    methods: {
      fetchData() {
        getServerList().then(
            // 获取服务器个数
            res => {
              this.redisClusterNum = res.count
            }
        )
        getUserList(this.params).then(
            // 获取用户数
            res => {
              this.userNum = res.count
            }
        )
        getGroupList(this.params).then(
            // 获取所有用户组
            res => {
              this.groupNum = res.count
            }
        )
      }
        }
};
</script>


<style scoped>
/*.el-row {*/
/*    margin-bottom: 20px;*/
/*}*/

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb201 {
    margin-top: 10px;
}
.mgb202 {
  margin-top: 50px;
}
.mgb203 {
  margin-top: 50px;
}


</style>
