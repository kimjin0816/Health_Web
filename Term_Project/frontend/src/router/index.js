import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HealthAPI from '../views/HealthAPI.vue'
import Routineroute from '../views/Routineroute.vue'
import Loginroute from '../views/Loginroute.vue'
import Logonroute from '../views/Logonroute.vue'
import Postingroute from '../views/Postingroute.vue'



Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'HomeView', component: HomeView },
  { path: '/HealthAPI', name: 'HealthAPI', component: HealthAPI },
  { path: '/Logon', name: 'LogonRoute', component: Logonroute },
  { path: '/Login', name: 'LoginRoute', component: Loginroute },
  { path: '/Routine', name: 'RoutineRoute', component: Routineroute },
  { path: '/Posting', name: 'PostingRoute', component: Postingroute }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
