import Vue from 'vue'
import VueMdl from 'vue-mdl'
import App from './App'
import VModal from 'vue-js-modal'

Vue.use(VModal, { dialog: true })

Vue.use(VueMdl)

new Vue({
  el: '#app',
  template: "<app/>",
  components: { App }
});

// const app = new Vue(App);
// app.$mount('#root');