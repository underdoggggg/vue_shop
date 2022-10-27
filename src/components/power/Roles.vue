<template>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="addDialogVisible = true"
          >添加角色</el-button
        >
      </el-col>
    </el-row>
    <!-- 角色列表 -->
    <el-table :data="rolesList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-row
            :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @click="removeRights(scope.row, item1.id)">{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二三级权限 -->
            <el-col :span="19">
              <el-row
                :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="removeRights(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                    closable
                    @close="removeRights(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeRole(scope.row.id)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-setting"
            @click="showSetRightsDialog(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加对话框 -->
    <el-dialog
      title="角色列表"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form :model="addForm" ref="addFormRef">
        <el-form-item label="角色名称" prop="roleName"
          ><el-input v-model="addForm.roleName"></el-input
        ></el-form-item>
        <el-form-item label="角色描述" prop="roleDesc"
          ><el-input v-model="addForm.roleDesc"></el-input
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRole()">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose()"
    >
      <el-form :data="editForm" ref="editFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色操作" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateEditRoleList()">确定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="setRightsDiaglogClose()"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKey"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取消</el-button>
        <el-button @click="allotRights()">确认</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      setRightsDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      editForm: {
        roleId: '',
        roleName: '',
        roleDesc: '',
      },
      // 权限列表
      rightsList: [],
      // 树型控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      defaultKey: [],
      // 即将分配权限的ID
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
    },
    async addRole() {
      const { data: res } = await this.$http.post('roles', this.addForm)
      if (res.meta.status !== 201) return this.$message.error('添加角色失败')
      this.$message.success('添加角色成功')
      this.addDialogVisible = false
      this.getRolesList()
    },

    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },

    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户数据失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
      // console.log(this.editForm)
    },

    async updateEditRoleList() {
      const { data: res } = await this.$http.put(
        'roles/' + this.editForm.roleId,
        {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc,
        }
      )
      if (res.meta.status != 200) {
        // console.log(this.editForm.id)
        return this.$message.error('修改角色失败')
      }
      this.editDialogVisible = false
      this.getRolesList()
      this.$message.success('修改角色成功')
    },

    // 删除角色
    async removeRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除数据，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消成功')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功')
      this.getRolesList()
    },

    // 删除权限
    async removeRights(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除数据，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消了删除')
      // console.log('没删除')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('删除权限成功')
      // 更新页面
      role.children = res.data
    },

    // 展现分配权限对话框
    showSetRightsDialog(role) {
      this.roleId = role.id
      this.$http.get('rights/tree').then((val) => {
        this.setRightsDialogVisible = true
        this.rightsList = val.data.data
        this.getRightsTree(role, this.defaultKey)
      })
    },

    // 递归函数获取权限的id
    getRightsTree(node, arr) {
      // 如果数组没有children子项，则向数组添加ID
      if (!node.children) {
        // console.log(node)
        return arr.push(node.id)
      }
      // 否则在数组的子项寻找children子项，直至没有子项为止
      node.children.forEach((item) => {
        // console.log(i++)
        this.getRightsTree(item, arr)
      })
    },

    // 关闭分配权限对话框时清空数组数据，也可以卸载递归处
    setRightsDiaglogClose() {
      this.defaultKey = []
    },

    // 分配权限
    async allotRights() {
      // 如何获取当前所在行的id
      // 如果获取所在行被勾选权限的id
      const keys = [
        ...[this.$refs.treeRef.getCheckedKeys()],
        ...[this.$refs.treeRef.getHalfCheckedKeys()],
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('分配权限错误')
      }
      this.$message.success('分配权限成功')
      this.setRightsDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>