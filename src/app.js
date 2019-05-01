import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import App from '@/App.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);

import 'vuetify/src/stylus/app.styl';

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});
