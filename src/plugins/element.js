import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Header, Container, Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option } from 'element-ui'

const element = [Button, Form, FormItem, Input, Header, Container, Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, Tag, Tree, Select, Option]
element.forEach(item => Vue.use(item))
// Vue.use(Button)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)
// Message需要全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm