<template>
  <!--Navbar-->
  <v-app>
    <v-app-bar color="cyan accent-2" app>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-spacer></v-spacer>

      <router-link :to="{ name: 'Shop' }" class="text-decoration-none">
        <v-btn icon>
          <v-icon class="black--text">mdi-home</v-icon>
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'Account' }" class="text-decoration-none">
        <v-btn icon>
          <v-icon class="black--text">mdi-account</v-icon>
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'AboutUs' }" class="text-decoration-none">
        <v-btn icon>
          <v-icon class="black--text">mdi-account-group</v-icon>
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'Basket' }" class="text-decoration-none">
        <v-btn icon>
          <v-badge :value="WarenkorbAnzahl" :content="WarenkorbAnzahl" :v-if="WarenkorbAnzahl > 0">
            <v-icon class="black--text">mdi-cart-outline</v-icon>
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
    };
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
      console.log();
      this.WarenkorbAnzahl = this.$store.state.warenkorb.length;
    });
  },
};
</script>
