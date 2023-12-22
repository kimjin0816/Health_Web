import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import axios from 'axios';
import io from 'socket.io-client'; // 'io'로 이름 변경

const socket = io('http://localhost:8000', { withCredentials: true });
Vue.prototype.$socket = socket;

Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue()  // 이벤트 버스용 빈 인스턴스
Vue.prototype.$axios = axios;

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app');