<template>
  <el-menu
    background-color="#333744"
    text-color="#fff"
    active-text-color="#409eff"
    unique-opened
    :collapse="isCollapse"
    router
    :default-active="activePath"
  >
    <!-- index只接收字符串 -->
    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
      <template slot="title">
        <i :class="iconsObj[item.id]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <!-- 二级菜单 -->
      <el-menu-item
        :index="'/' + subItem.path"
        v-for="subItem in item.children"
        :key="subItem.id"
        @click="saveNavState('/' + subItem.path)"
      >
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{ subItem.authName }}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      activePath: '',
    }
  },
  name: 'Menu',
  props: ['menuList', 'isCollapse'],
  methods: {
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
}
</script>

<style>
</style>