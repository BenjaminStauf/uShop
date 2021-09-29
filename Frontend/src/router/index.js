import Vue from 'vue';
import VueRouter from 'vue-router';
import Shop from '../views/Shop.vue';
import Account from '../views/Account.vue';
import Basket from '../views/Basket.vue';
import Product_Detail from '../views/Product_Detail.vue';
import ErrorSite from '../views/Error404.vue';
import aboutUs from '../views/AboutUs.vue'
import register from '../views/Register.vue';

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
  {
    path: '/Product_Detail',
    name: 'Product_Detail',
    component: Product_Detail,
  },
  {
    path: '/aboutUs',
    name: 'AboutUs',
    component: aboutUs,
  },
  {
    path: '/register', 
    name: "Register", 
    component: register,
  }, 
  {
    path: '*',
    name: 'Error',
    component: ErrorSite,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
