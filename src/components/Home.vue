<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" /><span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <Menu :menuList="menuList" :isCollapse="isCollapse"></Menu>
      </el-aside>
      <el-main>
        <Breadcrumbs
          v-show="
            $route.path == '/welcome'
              ? (breadcrumbIsShow = false)
              : (breadcrumbIsShow = true)
          "
        ></Breadcrumbs>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Menu from './Menu.vue'
import Breadcrumbs from './Breadcrumbs.vue'
export default {
  data() {
    return {
      menuList: {},
      isCollapse: false,
      breadcrumbIsShow: '',
    }
  },
  created() {
    this.getMenuItem()
  },
  components: { Menu, Breadcrumbs },
  // updated() {
  //   if ((this.$route.path = '/welcome')) return (breadcrumbIsShow = false)
  //   else return (breadcrumbIsShow = true)
  // },

  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuItem() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮控制菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  transition: 0.5s;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.home_container {
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>