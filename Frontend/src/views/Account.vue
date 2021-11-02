<template>
  <div>
    <div v-if="this.aktiverUser">
      <v-col class="text-right">
        <v-btn outlined text class="red accent-3 justify-right" @click="abmelden">
          Abmelden
        </v-btn>
        <v-btn v-if="this.aktiverUser.IsAdmin == true" @click="adminPanel">
          Zum Admin Panel
        </v-btn>
      </v-col>

      <h1 class="text-center pt-6">Account</h1>
      <h2 class="text-center pt-6">
        Guten Tag {{ aktiverUser.Vorname }} {{ this.aktiverUser.Nachname }}
      </h2>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      aktiverUser: {},
    };
  },
  mounted() {
    //Schaut ob ein Kunde im Localstorage vorhanden ist, wenn nicht leitet er zur Register-Seite weiter
    try {
      this.aktiverUser = JSON.parse(localStorage.getItem('LoggedInKunde'));

      console.log(this.aktiverUser);
      if (this.aktiverUser.Vorname == '') {
        if (JSON.parse(localStorage.getItem('EverReg'))) {
          this.$router.push('login');
        } else {
          this.$router.push('register');
        }
      }
    } catch (err) {
      console.log('Kein Kunde im Localstorage');
      //Weiterleitugn wenn kein Kunde im Localstorage war

      if (JSON.parse(localStorage.getItem('EverReg'))) {
        this.$router.push('login');
      } else {
        this.$router.push('register');
      }
    }
  },
  methods: {
    async abmelden() {
      console.log('Abmelden clicked');
      //Server abmeldung holen
      await axios.get('http://localhost:2410/KundeLogout');
      //Eingeloggten aus Localstorage entfernen
      localStorage.removeItem('LoggedInKunde');
      //Seiten reload
      location.reload();
    },
    adminPanel() {
      this.$router.push('AdminPanel');
    },
  },
};
</script>

<style></style>
