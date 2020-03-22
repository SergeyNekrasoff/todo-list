import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import { NotFoundComponent } from '@/views/NotFoundComponent.js'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { layout: 'no-sidebar' },
    component: Home
  },
  {
    path: '/todos',
    name: 'Todos',
    component: () => 
      import(/* webpackChunkName: "index" */ '@/views/Todos/index.vue'),
    meta: { 
      layout: 'default',
      title: 'Notes Page'
    }
  },
  {
    path: '/todos/:id',
    name: 'Todo',
    component: () => 
      import(/* webpackChunkName: "id" */ '@/views/Todos/id.vue'),
    meta: { 
      layout: 'default',
      title: 'Note Page'
    }
  },
  {
    path: '/create',
    component: () => 
      import(/* webpackChunkName: "create" */ '@/views/Todos/create.vue'),
    meta: { 
      layout: 'default',
      title: 'Create Note'
    }
  },
  {
    path: '*',
    component: NotFoundComponent
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

export default router
