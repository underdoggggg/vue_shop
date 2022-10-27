import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    { path: '/', redirect: "/login" },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      meta: {
        title: "首页"
      },
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users,
          meta: {
            title: "用户列表"
          }
        },
        {
          path: '/rights',
          component: Rights,
          meta: {
            title: '权限列表'
          }
        },
        {
          path: '/roles',
          component: Roles,
          meta: {
            title: '角色列表'
          }
        }
      ]
    },
  ]
})

// to代表将要访问的路径
// from 代表从哪个路径跳转而来
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
