<template>
  <div>
    <!--Passwort change-->
    <div v-if="show_reset_PW">
      <v-container>
        <v-alert
          style="text-align:center;"
          v-model="showPWCorrect"
          color="red"
          elevation="10"
          type="warning"
          dismissible
        >
          Ihre Passwörter stimmen leider nicht überein
        </v-alert>

        <h2 class="text-center mt-3">Hier können Sie Ihr Passwort ändern</h2>

        <v-form ref="form" v-model="validChangePW" lazy-validation>
          <v-container>
            <v-row justify="center">
              <v-col cols="6"
                ><v-text-field
                  v-model="password"
                  :append-icon="showPasswordInput ? 'xsi-eye' : 'xsi-eye-off'"
                  :rules="rules.required"
                  :type="showPasswordInput ? 'text' : 'password'"
                  label="Passwort"
                  required
                  @click:append="showPasswordInput = !showPasswordInput"
                  :tabindex="-1"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="6"
                ><v-text-field
                  v-model="password_confirm"
                  :append-icon="showPasswordInput ? 'xsi-eye' : 'xsi-eye-off'"
                  :rules="rules.required"
                  :type="showPasswordInput ? 'text' : 'password'"
                  label=" Confirm Passwort"
                  required
                  @click:append="showPasswordInput = !showPasswordInput"
                  :tabindex="-1"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-btn type="submit" class="orange darken-2" @click="changePW">Change Password</v-btn>
              <v-btn type="submit" class="red ml-2" @click="cancle">Cancle</v-btn>
            </v-row>
          </v-container>
        </v-form>
      </v-container>
    </div>
    <!-- Account -->
    <div v-bind:class="show_reset_PW ? 'BackgroundUnscharf' : 'BackgroundScharf'">
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
      <v-container class="mb-4">
        <v-row justify="center">
          <v-btn @click="show_reset_PW = true">Change Password</v-btn>
        </v-row>
      </v-container>

      <v-divider></v-divider>
      <br />
      <br />
      <h4 class="text-center">Ihre bisherigen Bestellungen:</h4>
      <v-container v-if="items.lenght != 0">
        <v-data-table
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
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: "Account",
  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,
      aktiverUser: {},
      headers: [
        { text: 'Name des Artikels', value: 'Name', class: 'cyan--text' },
        { text: 'Preis des Artikels (in EUR) ', value: 'Preis', class: 'cyan--text' },
        { text: 'Anzahl des Produkts', value: 'Anzahl', class: 'cyan--text' },
        { text: 'Bestell ID', value: 'bestell_ID', class: 'orange--text text--darken-2' },
        { text: 'Datum der Bestellung', value: 'Datum', class: 'orange--text text--darken-2' },
      ],
      rules: {
        required: [(val) => (val || '').length > 0 || 'This field is required'],
      },
      items: [],
      summe: 0,
      show_reset_PW: false,
      password: '',
      password_confirm: '',
      showPasswordInput: false,
      validChangePW: true,
      showPWCorrect: false,
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
      const post = await axios.post(`${this.serverAdress}/getOrders`, {
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
      await axios.get(`${this.serverAdress}/KundeLogout`);
      //Eingeloggten aus Localstorage & Store entfernen
      localStorage.removeItem('LoggedInKunde');
      this.$store.dispatch('LogoutKunde');
      //Seiten reload
      location.reload();
    },
    adminPanel() {
      this.$router.push('AdminPanel');
    },
    async changePW() {
      if (this.$refs.form.validate()) {
        //axios Put
        if (this.password == this.password_confirm) {
          const res = await axios.post(`${this.serverAdress}/changePW`, {
            newPassword: this.password,
            user: this.aktiverUser,
          });

          if(res.status == 200) this.show_reset_PW = false
        } else {
          this.showPWCorrect = true;
          this.password = '';
          this.password_confirm = '';
        }
        //Axios call
      }
    },
    cancle() {
      this.password = '';
      this.password_confirm = '';
      this.show_reset_PW = false;
    },
  },
};
</script>

<style>
.AuthenticatorDiv {
  display: block;
  margin-left: auto;
  margin-right: auto;
  z-index: 2;
  width: 30%;
  height: 15%;
  background: white;
  border-radius: 45px;
  padding-top: 15%;
}

.BackgroundUnscharf {
  /* filter: blur(10px); */
  visibility: hidden;
}
.BackgroundScharf {
  filter: none;
}
</style>
