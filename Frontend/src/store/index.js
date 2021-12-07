import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import eventBus from '../eventbus';

const serverAdress = process.env.VUE_APP_SERVER_ADRESS;
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //Produktdinge
    Kategorien: [],
    produkte: [],

    //User zugehörige Variablen
    aktiverUser: null, //Wenn null, dann nutz man GuestWarenkorb
    GuestWarenkorb: [],
    KundeWarenkorb: [],

    //Speichert Warenkorb im LS
    WarenkorbSpeichern() {
      console.log('Daten im LocalStorage speichern!');

      if (this.aktiverUser != null) {
        //Wenn ein Kunde eingeloggt ist
        localStorage.setItem(
          `${this.aktiverUser.Vorname + this.aktiverUser.Nachname}-Warenkorb`,
          JSON.stringify(this.KundeWarenkorb),
        );
      } else {
        //Wenn der Kunde ein Guest ist
        localStorage.setItem(`Guest-Warenkorb`, JSON.stringify(this.GuestWarenkorb));
      }
    },
  },

  getters: {
    //Hier bekommt man zurück, ob der User Adminrechte hat
    getAdmin(state) {
      try {
        return state.aktiverUser.IsAdmin ? true : false;
      } catch {
        return false;
      }
    },
  },

  actions: {
    //ProduktDinge
    LoadProducts(context) {
      //Leitet zur mutation weiter
      context.commit('loadProducts');
    },
    LoadCategories(context) {
      //Leitet zur mutation weiter
      context.commit('loadCategories');
    },

    //KundenDinge
    LoginKunde(context, item) {
      //Übergibt eingeloggten Kunde um diesen im Store abzuspeichern
      context.commit('loginKunde', item);
    },
    LogoutKunde(context) {
      //Entfernt den Kunde vom Store
      context.commit('logoutKunde');
    },

    //Warenkorbdinge
    WarenkorbSummeErhalten(context) {
      try {
        if (this.state.aktiverUser != null) {
          //Wenn Kunde eingeloggt ist
          return this.state.KundeWarenkorb.reduce(
            (prev, curr) => (prev += curr.Preis * curr.Anzahl),
            0,
          );
        } else {
          //Wenn Kunde als Guest arbeitet
          return this.state.GuestWarenkorb.reduce(
            (prev, curr) => (prev += curr.Preis * curr.Anzahl),
            0,
          );
        }
      } catch (err) {
        throw err;
      }
    },
    PushInWarenkorb(context, item) {
      //Um in den GuestWarenkorb zu pushen
      context.commit('pushInWarenkorb', item);
    },
    RemoveFromWarenkorb(context, delID) {
      context.commit('removeFromWarenkorb', delID);
    },
    ReloadWarenkorbFromLocalStorage(context) {
      context.commit('reloadWarenkorbFromLocalStorage');
    },
    ClearBasketAfterBuy(context) {
      context.commit('clearBasketAfterBuy');
    },
  },

  mutations: {
    //------ProduktDinge------
    /*Ladet daten aus dem JSON in Produkte-Liste */
    async loadProducts(state) {
      const produclist = await axios.get(`${serverAdress}/getProducts`);
      state.produkte = produclist.data;
    },
    /*Ladet daten aus dem JSON in Produkte-Liste */
    async loadCategories(state) {
      const categories = await axios.get(`${serverAdress}/getCategories`);
      state.Kategorien = categories.data;
    },

    //------KundenDinge--------
    async loginKunde(state, payload) {
      //Setzt im state den aktiven User
      state.aktiverUser = payload;
      //Dem Engelogten User den Guest Warenkorb übergeben
      try {
        if (
          JSON.parse(
            localStorage.getItem(
              `${state.aktiverUser.Vorname + state.aktiverUser.Nachname}-Warenkorb`,
            ),
          ).length == 0
        ) {
          state.KundeWarenkorb = state.GuestWarenkorb;
        }

        //Guestwarenkorb leeren bzw. Löschen
        state.GuestWarenkorb = [];

        //Abspeichern
        state.WarenkorbSpeichern();
      } catch {
        //Wenn der Kunden noch nie was im Warenkorb hatte, und sein LS noch nicht angelegt wurde
        console.log('LS ist leer');
        //LS setzen
        localStorage.setItem(
          `${state.aktiverUser.Vorname + state.aktiverUser.Nachname}-Warenkorb`,
          state.GuestWarenkorb,
        );
        //Guest-Daten bekommen
        state.KundeWarenkorb = state.GuestWarenkorb;
        //Abspeichern
        state.WarenkorbSpeichern();
      }
    },
    async logoutKunde(state) {
      state.aktiverUser = null;
      state.KundeWarenkorb = [];
    },

    //-----Warenkorbdinge------
    pushInWarenkorb(state, payload) {
      //Wenn es einen User gibt
      if (state.aktiverUser != null) {
        //Wenn es einen eingeloggten User gibt
        state.KundeWarenkorb.push(payload);
      } else {
        //Wenn es nur einen Guest gibt
        state.GuestWarenkorb.push(payload);
      }

      //Batch aktuallisieren
      eventBus.$emit('UpdateLocalStorage');

      //LocalStorage speichern
      state.WarenkorbSpeichern();
    },
    removeFromWarenkorb(state, delID) {
      //Item wird gesucht und aus dem Warenkorb gelöscht
      if (state.aktiverUser != null) {
        //Wenn Kunde eingeloggt
        state.KundeWarenkorb = state.KundeWarenkorb.filter(({ ID }) => ID != delID);
      } else {
        //Wenn Kunde als Guest
        state.GuestWarenkorb = state.GuestWarenkorb.filter(({ ID }) => ID != delID);
      }

      //LocalStorage speichern
      state.WarenkorbSpeichern();
    },
    reloadWarenkorbFromLocalStorage(state) {
      console.log('Lade Daten aus dem LocalStorage');

      //Eingeloggten User laden
      state.aktiverUser = JSON.parse(localStorage.getItem('LoggedInKunde'));

      //Warenkorb mit richtigen LocalstorageDaten füllen
      if (state.aktiverUser != null) {
        //Wenn Kunde eingeloggt wird überprüft ob es das Item im LocalStorage überhaupt gibt
        if (
          localStorage.getItem(
            `${state.aktiverUser.Vorname + state.aktiverUser.Nachname}-Warenkorb`,
          ) != null
        ) {
          //Ausgabe
          console.log('KundenwarenKorb aktualisiert');
          //Kundenwarenkorb mit Kundenwarenkorb aus dem LocalStorage befüllen
          state.KundeWarenkorb = JSON.parse(
            localStorage.getItem(
              `${state.aktiverUser.Vorname + state.aktiverUser.Nachname}-Warenkorb`,
            ),
          );
        }
      } else {
        //Wenn Kunde als Guest wird überprüft ob es das Item im LocalStorage überhaupt gibt
        if (localStorage.getItem(`Guest-Warenkorb`) != null) {
          //Ausgabe
          console.log('GuestKorb aktualisiert');
          //Guestwarenkorb mit Guestwarenkorb ausm LocalStorage befüllen
          state.GuestWarenkorb = JSON.parse(localStorage.getItem(`Guest-Warenkorb`));
        }
      }

      console.log('Kundenwarenkorb-Länge: ' + state.KundeWarenkorb.length);
    },
    clearBasketAfterBuy(state) {
      console.log('State LöschenFunktion');
      //Kundenwarenkorb löschen
      state.KundeWarenkorb = [];

      //bearbeiteten Kundenwarenkorb speichern
      state.WarenkorbSpeichern();
    },
  },
});
