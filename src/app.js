import Vue from 'vue';
import Vuetify from 'vuetify';

import App from '@/App.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);

import 'vuetify/dist/vuetify.min.css';

new Vue({
	el: '#app',
	components: { App },
	template: '<App/>'
});
