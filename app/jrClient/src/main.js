// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Resource from 'vue-resource'
import Router from 'vue-router'

import App from './App'

Vue.use(Router)
Vue.use(Resource)

import List from './components/List'
import Detail from './components/Detail'
import Home from './components/Home'

const routes = [
  { name: 'detail', path: '/j/:id', component: Detail },
  { name: 'home', path: '/', component: Home }
]

const router = new Router({
  routes
})

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
}).$mount("#app")
