import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import * as VueGoogleMaps from 'vue2-google-maps';
import './registerServiceWorker'

require('dotenv').config()

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
	load: {
		key: process.env.VUE_APP_APIKEY,
		libraries: 'places',
	},
});

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');
