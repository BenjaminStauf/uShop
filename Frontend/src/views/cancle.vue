<template>
  <v-container>
    <h1 class=" red--text text-center mt-3">Da ist wohl etwas schiefgelaufen !</h1>
    <h3 class="text-center">Bei Ihrer Bestellung ist leider ein Fehler aufgetreten</h3>
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
