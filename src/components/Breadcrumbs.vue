<template>
  <el-breadcrumb>
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <!-- <el-breadcrumb-item v-for="item in breadList" :key="item.path">{{
      item.meta.title
    }}</el-breadcrumb-item> -->
    <el-breadcrumb-item>{{ twoMenu }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ breadList.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  // name: 'Breadcrumbs',
  // created() {
  //   console.log(this.$route.matched)
  //   console.log(this.$route.path)
  // },
  computed: {
    breadList() {
      return this.$route.matched[1]
    },
    twoMenu() {
      if (this.$route.path == '/users') return '用户管理'
      else if (this.$route.path == '/rights' || '/roles') return '权限管理'
    },
  },
}
</script>

<style>
</style>