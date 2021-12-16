<template>
  <v-container class="mt-12">
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <h1 class="green--text text-center mt-3">
            Success !
          </h1>
        </v-col>
        <v-col>
          <h3 class="text-center mt-2">
            Viele Danke für Ihre Bestellung
          </h3>
          <h3 class="text-center mt-2">
            Wir haben Ihnen eine Email mit den Datails Ihrer Bestellung gesendet
          </h3>
        </v-col>
      </v-row>
    </v-container>
    <v-row align="center" justify="center" class="mt-6">
      <router-link class="text-decoration-none" :to="{ name: 'Shop' }">
        <v-btn dark>Zur Homeseite in {{ CountDownSekunden }}</v-btn>
      </router-link>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      CountDownSekunden: 5,
    };
  },

  created() {
    let weiterleitungsTimer = setInterval(() => {
      if (this.CountDownSekunden == 0) {
        //Intervall stoppen
        clearInterval(weiterleitungsTimer);
        //Zur Homeseite weiterleiten
        this.$router.push('/');
      } else {
        //Countdown runterzählen
        this.CountDownSekunden -= 1;
      }
    }, 1000);
  },
};
</script>

<style></style>
