<template>
  <!--Navbar-->
  <v-app>
    <v-app-bar color="grey darken-3" app>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-spacer></v-spacer>

      <router-link :to="{ name: 'Shop' }" class="text-decoration-none">
        <v-btn icon @click="clickHome">
          <v-icon :class="colorHome">mdi-home</v-icon>
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'Account' }" class="text-decoration-none">
        <v-btn icon>
          <v-icon :class="colorAccount" @click="clickAccount">mdi-account</v-icon>
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'AboutUs' }" class="text-decoration-none">
        <v-btn icon>
          <v-icon :class="colorAboutUs" @click="clickAboutUs">mdi-account-group</v-icon>
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'Basket' }" class="text-decoration-none">
        <v-btn icon>
          <v-badge :value="WarenkorbAnzahl" :content="WarenkorbAnzahl" :v-if="WarenkorbAnzahl > 0">
            <v-icon :class="colorBasket" @click="clickBasket">mdi-cart-outline</v-icon>
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
      colorHome: 'orange--text text--darken-2',
      colorAccount: 'white--text',
      colorAboutUs: 'white--text',
      colorBasket: 'white--text',
    };
  },
  methods: {
    clickHome() {
      if (this.colorHome == 'white--text') {
        this.colorHome = 'orange--text text--darken-2';
        this.colorAccount = 'white--text';
        this.colorAboutUs = 'white--text';
        this.colorBasket = 'white--text';
      }
    },
    clickAccount() {
      if (this.colorAccount == 'white--text') {
        this.colorHome = 'white--text';
        this.colorAccount = 'orange--text text--darken-2';
        this.colorAboutUs = 'white--text';
        this.colorBasket = 'white--text';
      }
    },
    clickAboutUs() {
      if (this.colorAboutUs == 'white--text') {
        this.colorHome = 'white--text';
        this.colorAccount = 'white--text';
        this.colorAboutUs = 'orange--text text--darken-2';
        this.colorBasket = 'white--text';
      }
    },
    clickBasket() {
      if (this.colorBasket == 'white--text') {
        this.colorHome = 'white--text';
        this.colorAccount = 'white--text';
        this.colorAboutUs = 'white--text';
        this.colorBasket = 'orange--text text--darken-2';
      }
    },
  },
  created() {
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

    eventBus.$on('UpdateLocalStorage', () => {
      //Warenkorbanzahl resetten
      this.WarenkorbAnzahl = 0;

      this.WarenkorbAnzahl =
        this.$store.state.AktiverUser != null
          ? this.$store.state.KundeWarenkorb.length
          : this.$store.state.GuestWarenkorb.length;
    });

    this.color = 'orange--text text--darken-2';
  },
};
</script>
