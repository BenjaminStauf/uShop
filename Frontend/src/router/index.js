import Vue from 'vue';
import VueRouter from 'vue-router';
import Shop from '../views/Shop.vue';
import Account from '../views/Account.vue';
import Basket from '../views/Basket.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Shop',
		component: Shop,
	},
	{
		path: '/Account',
		name: 'Account',
		component: Account,
	},
	{
		path: '/Basket',
		name: 'Basket',
		component: Basket,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
