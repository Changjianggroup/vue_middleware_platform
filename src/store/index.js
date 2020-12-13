import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import redis from './modules/redis'
import rabbitmq from './modules/rabbitmq'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    redis,
    rabbitmq
  },
  getters
})

export default store
