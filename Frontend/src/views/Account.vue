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

    <br />
    <br />
    <h4 class="text-center">Ihre bisherigen Bestellungen:</h4>
    <v-container v-if="items.lenght != 0">
      <v-data-table
        dark
        :headers="headers"
        :items="changeDaten"
        :items-per-page="5"
        class="elevation-1"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:body.append="{ headers }">
          <tr>
            <td :colspan="headers.lenght">Summe:</td>
            <td :colspan="headers.lenght">
              <b>{{ summeAllerBestellungen }}</b>
            </td>
            <td :colspan="headers.lenght">
              <b>{{ anzahlAllerProdukte }}</b>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      aktiverUser: {},
      headers: [
        { text: 'Name des Artikels', value: 'Name', class: 'cyan--text' },
        { text: 'Preis des Artikels (in EUR) ', value: 'Preis', class: 'cyan--text' },
        { text: 'Anzahl des Produkts', value: 'Anzahl', class: 'cyan--text' },
        { text: 'Bestell ID', value: 'bestell_ID', class: 'orange--text text--darken-2' },
        { text: 'Datum der Bestellung', value: 'Datum', class: 'orange--text text--darken-2' },
      ],
      items: [],
      summe: 0,
    };
  },
  async mounted() {
    //Überprüfen für richtige Weiterleitung
    if ((await localStorage.getItem('LoggedInKunde')) != undefined) {
      //Wenn ein kunde angemeldet ist, diesen als aktiven User festlegen
      //Aktiven user hier im Account festlegen
      this.aktiverUser = JSON.parse(localStorage.getItem('LoggedInKunde'));
      //Aktiven User im Store speichern
      this.$store.state.aktiverUser = this.aktiverUser;
      console.log(this.aktiverUser);

      //Daten von DB holen (Bestellhistorie)
      const post = await axios.post('http://localhost:2410/getOrders', {
        KundenID: this.aktiverUser.Kunden_ID,
      });
      this.items = post.data;
    } else {
      console.log('Kein Kunde im Localstorage');
      //Wenn kein Kunde angemeldet ist
      if ((await localStorage.getItem('EverReg')) != undefined) {
        this.$router.push('login');
      } else {
        this.$router.push('register');
      }
    }
  },
  computed: {
    summeAllerBestellungen() {
      let summe = 0;
      this.items.forEach((element) => (summe += element.Preis * element.Anzahl));
      return summe;
    },
    anzahlAllerProdukte() {
      let anzahl = 0;
      this.items.forEach((element) => (anzahl += element.Anzahl));
      return anzahl;
    },
    changeDaten() {
      let erg = this.items;
      for (const iterator of erg) {
        iterator.Datum = new Date(iterator.Datum).toISOString().slice(0, 10);
      }
      return erg;
    },
  },
  methods: {
    async abmelden() {
      console.log('Abmelden clicked');
      //Server abmeldung holen
      await axios.get('http://localhost:2410/KundeLogout');
      //Eingeloggten aus Localstorage & Store entfernen
      localStorage.removeItem('LoggedInKunde');
      this.$store.dispatch('LogoutKunde');
      //Seiten reload
      location.reload();
    },
    adminPanel() {
      this.$router.push('AdminPanel');
    },
  },
};
</script>
