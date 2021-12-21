<template>
  <div>
    <!--Authenticator-->
    <div v-if="showAuthenticator" class="AuthenticatorDiv">
      <!--Fehlermeldung wenn Code falsch war!-->
      <div v-if="showAuthError">
        <v-alert
          style="text-align: center;"
          v-model="showAuthError"
          dismissible
          color="red"
          elevation="10"
          type="warning"
        >
          Der Authentications-Code war ungültig!
        </v-alert>
        <br />
        <br />
      </div>

      <!--Auth-Code überprüfung-->
      <h3 style="text-align:center; width:auto; ">
        Wir haben dir einen Code per Mail geschickt, gib diesen bitte ein
      </h3>
      <v-form>
        <v-container>
          <v-row class="justify-center">
            <!-- <v-text-field
							style="width: 80%"
							v-model="authenticator"
							type="text"
							required
							label="Code"
						></v-text-field> -->
            <v-otp-input length="6" v-model="authenticator" class="my-3"></v-otp-input>
          </v-row>

          <v-row class="justify-center">
            <v-btn color="#424242" @click="authenticatorClicked" dark>
              Bestätigen
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </div>

    <!--Register-->
    <div v-bind:class="showAuthenticator ? 'BackgroundUnscharf' : 'BackgroundScharf'">
      <!--Fehlermeldung wenn Email schon vorhanden ist-->
      <div v-if="showEmailInUse">
        <v-alert
          style="text-align:center;"
          v-model="showEmailInUse"
          color="red"
          elevation="10"
          type="warning"
          dismissible
        >
          Die Email ist schon in Verwendung, bitte nimm eine andere :)
        </v-alert>
        <br />
      </div>

      <!--Register-Teil-->
      <h1 class="text-center mt-3">Register</h1>
      <h3 class="text-center pt-6">
        Willkommen, wenn Sie noch kein Konto haben können sie hier kostelos eines erstellen.
      </h3>

      <v-form :disabled="showAuthenticator" ref="form_Register" v-model="valid" lazy-validation>
        <v-container class="d-flex flex-wrap justify-center">
          <!--Vor-Nachname- Inputs-->
          <v-col>
            <!--MeinSpalte wo Inputs liegen-->
            <v-row class="justify-center">
              <v-col md="4">
                <v-text-field
                  type="text"
                  label="Vorname"
                  v-model="Vorname"
                  :rules="rules.required"
                  clearable
                  required
                />
              </v-col>

              <v-col md="4">
                <v-text-field
                  label="Nachname"
                  v-model="Nachname"
                  :rules="rules.required"
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <!--Email Input-->
            <v-row class="justify-center">
              <v-col md="8">
                <v-text-field
                  label="E-Mail"
                  type="mail"
                  v-model="Email"
                  :rules="rules.EmailRules"
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <!--Passwort-->
            <v-row class="justify-center">
              <v-col md="4">
                <v-text-field
                  :append-icon="showPasswordInput ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="rules.required"
                  :type="showPasswordInput ? 'text' : 'password'"
                  label="Passwort"
                  v-model="Passwort1"
                  @click:append="showPasswordInput = !showPasswordInput"
                  required
                  clearable
                />
              </v-col>

              <v-col md="4"
                ><v-text-field
                  :append-icon="showPasswordInput ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="rules.required"
                  :type="showPasswordInput ? 'text' : 'password'"
                  label="Passwort"
                  v-model="Passwort2"
                  @click:append="showPasswordInput = !showPasswordInput"
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <!--Adresse-->
            <v-row class="justify-center">
              <v-col md="3">
                <v-text-field
                  label="Straße + Hausnr"
                  v-model="Strasse"
                  :rules="rules.required"
                  required
                  clearable
                />
              </v-col>
              <v-col md="2">
                <v-text-field
                  label="PLZ"
                  v-model="Plz"
                  :rules="rules.PlzRules"
                  required
                  clearable
                />
              </v-col>
              <v-col md="3">
                <v-text-field
                  label="Ort"
                  v-model="Ort"
                  :rules="rules.required"
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <!--Submit-Bttn-->
            <v-row class="justify-center" style="margin-top:2rem">
              <v-btn @click="Submitted">
                Register
              </v-btn>
            </v-row>
          </v-col>
        </v-container>
      </v-form>

      <br />
      <br />

      <br />
      <br />
      <router-link class="black--text text-decoration-none" :to="{ name: 'Login' }"
        ><p class="black--text text-center">
          Wenn sie bereits einen Account haben, können Sie sich hier anmelden:
          <span class="orange--text text--darken-2">Login</span>
        </p>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,
      //Inputvariablen
      authenticator: '',
      realAutheticatorCode: '',
      Vorname: '',
      Nachname: '',
      Email: '',
      Passwort1: '',
      Passwort2: '',
      Strasse: '',
      Plz: '',
      Ort: '',
      userArray: [],

      //Variablen
      showPasswordInput: false,
      showAuthenticator: false,
      showAuthError: false,
      showEmailInUse: false,
      valid: true,

      //Anorderungen an die Inputs
      rules: {
        required: [(value) => !!value || 'Required.'],
        required: [(val) => (val || '').length > 0 || 'This field is required'],
        EmailRules: [
          (value) => !!value || 'Required.',
          (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid e-mail.';
          },
        ],
        PlzRules: [
          (value) => !!value || 'Required.',
          (value) => {
            const pattern = /^\d{4,5}$/;
            return pattern.test(value);
          },
        ],
      },
    };
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('User')) != null) {
      this.userArray = JSON.parse(localStorage.getItem('User'));
      console.log(`User Array: ${this.userArray}`);
    }
  },
  methods: {
    ClearInputs() {
      this.Vorname = '';
      this.Nachname = '';
      this.Email = '';
      this.Strasse = '';
      this.Passwort1 = '';
      this.Passwort2 = '';
      this.Plz = '';
      this.Ort = '';
    },

    async authenticatorClicked() {
      if (this.realAutheticatorCode === this.authenticator) {
        // Kunden registrieren
        const { data } = await axios.post(`${this.serverAdress}/KundeRegister`, {
          Vorname: this.Vorname,
          Nachname: this.Nachname,
          Email: this.Email.toLowerCase(),
          Passwort: this.Passwort1,
          Strasse: this.Strasse,
          Plz: this.Plz,
          Ort: this.Ort,
          IsAdmin: false,
        });

        //Leert alle Inputs
        this.ClearInputs();

        //Authenticator-Mode off
        this.showAuthenticator = false;

        //Wenn fertig zur Login-Seite weiterleiten
        this.$router.push('Login');
      } else {
        this.showAuthError = true;
      }
    },

    async Submitted() {
      if (this.$refs.form_Register.validate()) {
        if (this.Passwort1 == this.Passwort2) {
          // Auth-Code bekommen
          const { data: code } = await axios.post(`${this.serverAdress}/SendCode`, {
            Vorname: this.Vorname,
            Nachname: this.Nachname,
            Email: this.Email.toLowerCase(),
          });

          //Wenn die Email (der Code in dem Fall) nicht vorhanden ist, wird man weitergeleitet
          if (code != 'vorhanden') {
            //Falls EmailvorhandenMeldung kommt false setzen
            this.showEmailInUse = false;
            //Authcode übergeben
            this.realAutheticatorCode = code;

            //Authentificator-Mode on
            this.showAuthenticator = true;
          } else {
            //Zeigt die Fehlermeldung an
            this.showEmailInUse = true;
            //Email-Input leeren
            this.Email = '';
          }
        }
      }
      //Beide Passwörter vergleichen
    },
  },
};
</script>

<style>
span {
  color: rgb(9, 156, 9);
  font-weight: bold;
}

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
  filter: blur(10px);
}
.BackgroundScharf {
  filter: none;
}
</style>
