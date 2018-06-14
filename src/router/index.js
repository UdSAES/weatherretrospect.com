import Vue from 'vue'
import Router from 'vue-router'
import StationMap from '@/components/StationMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StationMap',
      component: StationMap
    }
  ]
})
