<template>
  <v-app>
    <v-app-bar color="cyan accent-2" app>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

      <v-spacer></v-spacer>

      <v-btn icon>
        <router-link :to="{ name: 'Shop' }" class="text-decoration-none">
          <v-icon class="black--text">mdi-home</v-icon>
        </router-link>
      </v-btn>

      <v-btn icon>
        <router-link :to="{ name: 'Account' }" class="text-decoration-none">
          <v-icon class="black--text">mdi-account</v-icon>
        </router-link>
      </v-btn>

      <v-btn icon>
        <router-link :to="{ name: 'Basket' }" class="text-decoration-none"
          ><v-icon class="black--text">mdi-cart-outline</v-icon>
        </router-link>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'app',
};
</script>
