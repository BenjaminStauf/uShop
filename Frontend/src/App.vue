<template>
  <!--Navbar-->
  <v-app>
    <v-app-bar color="grey darken-3" app>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-spacer></v-spacer>

      <router-link :to="{ name: 'Shop' }" class="text-decoration-none" @click="menuClick">
        <v-btn icon @click="menuClick">
          <v-icon id="HomeIcon" @click="menuClick">mdi-home</v-icon>
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'Account' }" class="text-decoration-none">
        <v-btn icon @click="menuClick">
          <v-icon id="AccountIcon" @click="menuClick">mdi-account</v-icon>
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'AboutUs' }" class="text-decoration-none">
        <v-btn icon @click="menuClick">
          <v-icon id="AboutUsIcon" @click="menuClick">mdi-account-group</v-icon>
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'Basket' }" class="text-decoration-none">
        <v-btn icon @click="menuClick">
          <v-badge
            color="orange darken-2"
            :value="WarenkorbAnzahl"
            :content="WarenkorbAnzahl"
            :v-if="WarenkorbAnzahl > 0"
          >
            <v-icon id="WarenkorbIcon" @click="menuClick">mdi-cart-outline</v-icon>
          </v-badge>
        </v-btn>
      </router-link>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import eventBus from './eventbus';

export default {
  name: 'app',
  data() {
    return {
      WarenkorbAnzahl: 0,

      iconIdListe: ['HomeIcon', 'AccountIcon', 'AboutUsIcon', 'WarenkorbIcon'],
    };
  },

  methods: {
    allToNormal() {
      //Alle per id Umfärben
      for (let index = 0; index < this.iconIdListe.length; index++) {
        let el = document.querySelector(`#${this.iconIdListe[index]}`).classList;
        el.remove('orange--text');
        el.remove('text--darken-2');
        el.add('white--text');
      }
    },

    toSelected(id) {
      let elCL = document.querySelector(`#${id}`).classList;
      elCL.remove('white--text');
      elCL.add('orange--text');
      elCL.add('text--darken-2');
    },

    menuClick({ target: { id } }) {
      //Macht alle Knöpfe mal weiß bevor eine Änderung vorgeht
      this.allToNormal();

      switch (id) {
        case 'HomeIcon':
          this.toSelected(id);
          break;
        case 'AccountIcon':
          this.toSelected(id);
          break;
        case 'AboutUsIcon':
          this.toSelected(id);
          break;
        case 'WarenkorbIcon':
          this.toSelected(id);
          break;
      }
    },
  },
  mounted() {
    //WarenkorbBatch aktuallisieren
    eventBus.$emit('UpdateLocalStorage');

    //Setzt alle Menupunkte mal auf weiß
    this.allToNormal();

    //Setzt den Start-Menüpunkt
    switch (this.$route.name) {
      case 'Shop':
        this.toSelected('HomeIcon');
        break;
      case 'Account':
        this.toSelected('AccountIcon');
        break;
      case 'Login':
        this.toSelected('AccountIcon');
        break;
      case 'Register':
        this.toSelected('AccountIcon');
        break;
      case 'AboutUs':
        this.toSelected('AboutUsIcon');
        break;
      case 'Basket':
        this.toSelected('WarenkorbIcon');
        break;
    }
  },

  created() {
    //Versucht sich alle wichtigen Daten über den Store zu laden (Prdoukte & Kategorien)
    try {
      this.$store.dispatch('LoadProducts');
    } catch (err) {
      console.log(`Beim laden der Produkte ist ein Fehler aufgetreten! Error: ${err}`);
    }

    try {
      this.$store.dispatch('LoadCategories');
    } catch (err) {
      console.log(`Beim laden der Kategorien ist ein Fehler aufgetreten! Error: ${err}`);
    }

    //Warenkorb aktuallisieren mit LocalStorage
    this.$store.dispatch('ReloadWarenkorbFromLocalStorage');

    //Warenkorbatch-UpdateFunktion über Eventbus festlegen
    eventBus.$on('UpdateLocalStorage', () => {
      this.WarenkorbAnzahl =
        this.$store.state.aktiverUser == undefined
          ? this.$store.state.GuestWarenkorb.length
          : this.$store.state.KundeWarenkorb.length;
    });
  },
};
</script>

<style>
.black {
  color: orange;
}
</style>
