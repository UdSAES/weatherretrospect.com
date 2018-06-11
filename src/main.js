// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import _ from 'lodash'
import superagent from 'superagent'
import moment from 'moment-timezone'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Object.defineProperty(Vue.prototype, '$_', {
  value: _
})

Object.defineProperty(Vue.prototype, '$superagent', {
  value: superagent
})

Object.defineProperty(Vue.prototype, '$moment', {
  value: moment
})

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
