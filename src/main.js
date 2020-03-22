import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import Default from '@/layouts/Default'
import NoSidebar from '@/layouts/NoSidebar'

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.component('default-layout', Default)
Vue.component('no-sidebar-layout', NoSidebar)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
