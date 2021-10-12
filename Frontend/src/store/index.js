import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import eventBus from '../eventbus';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    warenkorb: [],
    Kategorien: [],
    produkte: [],
  },

  actions: {
    LoadProducts(context) {
      //Leitet zur mutation weiter
      context.commit('loadProducts');
    },
    LoadCategories(context) {
      //Leitet zur mutation weiter
      context.commit('loadCategories');
    },
    PushInWarenkorb(context, item) {
      //Um in den warenkorb zu pushen
      context.commit('pushInWarenkorb', item);
    },
    ReloadWarenkorbFromLocalStorage(context) {
      context.commit('reloadWarenkorbFromLocalStorage');
    },
  },

  mutations: {
    /*Ladet daten aus dem JSON in Produkte-Liste */
    async loadProducts(state) {
      const produclist = await axios.get('http://localhost:2410/getProducts');
      state.produkte = produclist.data;
    },
    /*Ladet daten aus dem JSON in Produkte-Liste */
    async loadCategories(state) {
      const categories = await axios.get('http://localhost:2410/getCategories');
      state.Kategorien = categories.data;
    },
    //Pusht item in den Warenkorb
    pushInWarenkorb(state, payload) {
      state.warenkorb.push(payload);
      //Warenkorb auch im LocalStorage speichern
      localStorage.setItem('WarenkorbStorage', JSON.stringify(state.warenkorb));
      //Batch aktuallisieren
      eventBus.$emit('UpdateLocalStorage');
    },
    reloadWarenkorbFromLocalStorage(state) {
      //Warenkorb mit LocalstorageDaten füllen
      try{
        let StorageWarenkorb = JSON.parse(localStorage.getItem('WarenkorbStorage'));
        for (const i of StorageWarenkorb) {
          state.warenkorb.push(i);
        }
        //Batch updaten
        eventBus.$emit('UpdateLocalStorage');
      }
      catch{
        console.log("Warenkorb noch leer!")
      }
    },
  },
});
