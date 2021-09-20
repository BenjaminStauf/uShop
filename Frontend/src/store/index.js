import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios"


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Kategorien: [
      { ID: 1, Name: 'Tisch' },
      { ID: 2, Name: 'Sessel' },
      { ID: 3, Name: 'Bett' },
      { ID: 4, Name: 'Couch' },
      { ID: 5, Name: 'Küche' },
    ],
    Warenkorb: [],
    produkte: [],
  },
  
  mutations: {
    async LoadProducts(state) {
      /*Ladet daten aus dem JSON in Produkte-Liste */
      const produclist = await axios.get("http://localhost:3000/productlist")
      state.produkte = produclist.data
    }
  },

  actions: {
    LoadProducts(context) {
      //Leitet zur mutation weiter
      context.commit('LoadProducts');
    }
  },
  modules: {},
});