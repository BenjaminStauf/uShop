<template>
  <div>
    <!--Passwort vergessen-->
    <div v-if="showPasswortVergessen" class="PasswortVergessenDiv">
      <!--Auth-Code überprüfung-->
      <h1 style="text-align:center; font-size: 1.25rem;">
        Geben Sie Ihre Email von ihrem Account ein, damit wir Ihnen ein neues Passwort schicken
        können.
      </h1>
      <v-form ref="form_PW" v-model="validSendPW" lazy-validation :disable="showPasswortVergessen">
        <v-container>
          <v-row class="justify-center">
            <v-col cols="12" md="8" lg="5" xl="5">
              <v-text-field
                style="width: 100%"
                type="email"
                v-model="inputEmail"
                label="Email"
                clearable
                required
                :rules="rules.EmailRules"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="justify-center">
            <v-btn type="submit" class="ml-3 mt-3" color="#424242" dark @click="sendNewPW">
              Senden
            </v-btn>
            <v-btn color="red" dark class="ml-3 mt-3" @click="showPasswortVergessen = false">
              Abbrechen
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </div>

    <!--LoginScreen-->
    <div v-bind:class="showPasswortVergessen ? 'BackgroundUnscharf' : 'BackgroundScharf'">
      <v-alert
        style="text-align:center;"
        v-model="showUserCorrect"
        color="red"
        elevation="10"
        type="warning"
        dismissible
      >
        Der User ist leider nicht vorhanden oder die Anmeldedaten sind inkorrekt
      </v-alert>

      <h1 class="black--text text-center">Login</h1>

      <v-form ref="form" v-model="validLogin" lazy-validation :disabled="showPasswortVergessen">
        <v-container>
          <v-row class="justify-center">
            <v-col xs="10" style="margin: 3% 20%;">
              <!--Email-->
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="email"
                    label="Email"
                    clearable
                    required
                    :rules="rules.EmailRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!--Passwort-->
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="password"
                    :append-icon="showPasswordInput ? 'xsi-eye' : 'xsi-eye-off'"
                    :rules="rules.required"
                    :type="showPasswordInput ? 'text' : 'password'"
                    label="Passwort"
                    required
                    @click:append="showPasswordInput = !showPasswordInput"
                    :tabindex="-1"
                  ></v-text-field>
                  <p
                    class="orange--text text--darken-2 text-decoration-underline mt-3"
                    @click="showPasswortVergessen = true"
                  >
                    Passwort vergessen
                  </p>
                </v-col>
              </v-row>
              <!--Submit-->
              <v-row class="justify-center">
                <v-btn type="submit" @click="submit">Einloggen</v-btn>
              </v-row>

              <!--Register weiterleiten-->
              <br />
              <br />
              <v-row>
                <v-col cols="6" class="ml-3 mt-3 pa-0">
                  <p>
                    Zurück zum
                    <router-link
                      class="black--text text-decoration-none"
                      :to="{ name: 'Register' }"
                    >
                      <span class="orange--text text--darken-2">Registrieren</span>
                    </router-link>
                  </p>
                </v-col>
                <v-col xs="10"></v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,
      email: '',
      password: '',
      showPasswordInput: false,
      showPasswortVergessen: false,
      inputEmail: '',
      validLogin: true,
      validSendPW: true,
      showUserCorrect: false,

      rules: {
        required: [(val) => (val || '').length > 0 || 'This field is required'],
        EmailRules: [
          (value) => !!value || 'This field is required.',
          (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid e-mail.';
          },
        ],
      },
    };
  },
  methods: {
    async sendNewPW() {
      if (this.$refs.form_PW.validate()) {
        try {
          //alert('Click');
          await axios.post(`${this.serverAdress}/newPW`, { email: this.inputEmail.toLowerCase() });
          alert(`Email wurde an: ${this.inputEmail.toLowerCase()} gesendet`);
          setTimeout(() => (this.showPasswortVergessen = false), 2000);
        } catch (error) {
          alert('Leider ist etwas schief gelaufen');
        }
      }
    },
    ClearInputs() {
      this.email = '';
      this.password = '';
    },

    async submit() {
      if (this.$refs.form.validate()) {
        try {
          alert(this.password);
          //Anfrage auf den Server, um sich einzuloggen
          let res = await axios.post(`${this.serverAdress}/KundenLogin`, {
            Email: this.email,
            Passwort: this.password,
          });

          //Inputs leeren
          this.ClearInputs();

          //Wenn auch von Serverseite alles passt, wird man auch weitergeleitet
          if (res.status == 200) {
            //Eingeloggten Kunden setzen (LocalStorage & Store)
            await localStorage.setItem('LoggedInKunde', JSON.stringify(res.data.FoundUser));
            await localStorage.setItem('EverReg', true);
            this.$store.dispatch('LoginKunde', res.data.FoundUser);
            //Zur Account seite weiterleiten, die alles dann Managed
            this.$router.push('account');
          }
        } catch {
          this.showUserCorrect = true;
          this.ClearInputs();
        }
      }
    },
  },
};
</script>

<style>
span {
  color: rgb(9, 156, 9);
  font-weight: bold;
}

.PasswortVergessenDiv {
  display: block;
  margin-left: auto;
  margin-right: auto;
  z-index: 2;
  width: 50%;
  height: 15%;
  background: white;
  border-radius: 45px;
  padding-top: 15%;
}

.BackgroundUnscharf {
  filter: blur(10px);
}
.BackgroundScharf {
  filter: none;
}
</style>
