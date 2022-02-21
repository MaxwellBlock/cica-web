import Vue from 'vue'
import App from './App.vue'
import http from './mixins/http.mixin'


Vue.mixin(http)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
