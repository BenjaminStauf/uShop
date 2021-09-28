import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Kategorien: [],
    Warenkorb: [],
    produkte: [],
    produkte_produkteDetail: {
      warenkorb: [],
      current_Detail: [],
    },
  },

  mutations: {
    async LoadProducts(state) {
      /*Ladet daten aus dem JSON in Produkte-Liste */
      const produclist = await axios.get('http://localhost:3000/productlist');
      state.produkte = produclist.data;
    },
    async LoadCategories(state) {
      /*Ladet daten aus dem JSON in Produkte-Liste */
      const categories = await axios.get('http://localhost:3000/kategorien');
      state.Kategorien = categories.data;
    },
  },

  actions: {
    LoadProducts(context) {
      //Leitet zur mutation weiter
      context.commit('LoadProducts');
    },
    LoadCategories(context) {
      //Leitet zur mutation weiter
      context.commit('LoadCategories');
    },
  },
  modules: {},
});
