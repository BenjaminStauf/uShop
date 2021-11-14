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
      <h1 style="text-align:center;">Bitte gib deinen Authenticatorcode ein:</h1>
      <v-form>
        <v-container>
          <v-row>
            <v-col md="2"></v-col>
            <v-col md="10"
              ><v-text-field style="width: 80%" v-model="authenticator" type="text"></v-text-field>
            </v-col>
            <v-col></v-col>
          </v-row>

          <v-row>
            <v-col></v-col>
            <v-col>
              <v-btn color="#424242" @click="authenticatorClicked" dark>
                Bestätigen
              </v-btn>
            </v-col>
            <v-col></v-col>
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
      <h1 class="text-center">Register</h1>
      <h3 class="text-center pt-6">
        Willkommen, wenn Sie noch kein Konto haben können sie hier kostelos eines erstellen.
      </h3>
      <br />
      <br />
      <v-form>
        <v-container class="d-flex flex-wrap justify-space-around">
          <!--Vor-Nachname- Inputs-->
          <v-row>
            <v-col md="1"></v-col>
            <v-col md="10">
              <!--MeinSpalte wo Inputs liegen-->
              <v-row class="justify-center">
                <v-col md="4">
                  <v-text-field
                    label="Vorname"
                    v-model="Vorname"
                    :rules="rules.NormalRules"
                    hide-details="auto"
                  />
                </v-col>
                <v-col md="1"></v-col>
                <v-col md="4">
                  <v-text-field
                    label="Nachname"
                    v-model="Nachname"
                    :rules="rules.NormalRules"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <!--Email Input-->
              <v-row class="justify-center">
                <v-col md="9">
                  <v-text-field
                    label="E-Mail"
                    v-model="Email"
                    :rules="rules.EmailRules"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <!--Passwort-->
              <v-row class="justify-center">
                <v-col md="4">
                  <v-text-field
                    :append-icon="showPasswordInput ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="rules.NormalRules"
                    :type="showPasswordInput ? 'text' : 'password'"
                    label="Passwort"
                    v-model="Passwort1"
                    @click:append="showPasswordInput = !showPasswordInput"
                  />
                </v-col>
                <v-col md="1"></v-col>
                <v-col md="4"
                  ><v-text-field
                    :append-icon="showPasswordInput ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="rules.NormalRules"
                    :type="showPasswordInput ? 'text' : 'password'"
                    label="Passwort"
                    v-model="Passwort2"
                    @click:append="showPasswordInput = !showPasswordInput"
                  />
                </v-col>
              </v-row>
              <!--Adresse-->
              <v-row class="justify-center">
                <v-col md="4">
                  <v-text-field
                    label="Straße + Hausnr"
                    v-model="Strasse"
                    :rules="rules.NormalRules"
                    hide-details="auto"
                  />
                </v-col>
                <v-col md="1">
                  <v-text-field
                    label="PLZ"
                    v-model="Plz"
                    :rules="rules.NormalRules"
                    hide-details="auto"
                  />
                </v-col>
                <v-col md="4">
                  <v-text-field
                    label="Ort"
                    v-model="Ort"
                    :rules="rules.NormalRules"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <!--Submit-Bttn-->
              <v-row>
                <v-col md="5"></v-col>
                <v-col md="2">
                  <v-btn @click="Submitted">
                    Register
                  </v-btn>
                </v-col>
                <v-col md="5"></v-col>
              </v-row>
            </v-col>
            <v-col md="1"></v-col>
          </v-row>
        </v-container>
      </v-form>
      <br />
      <br />
      <router-link class="black--text text-decoration-none" :to="{ name: 'Login' }"
        ><p class="black--text text-center">
          Wenn sie bereits einen Account haben, können Sie sich hier anmelden: <span>Login</span>
        </p>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
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

      //Anorderungen an die Inputs
      rules: {
        NormalRules: [(value) => !!value || 'Required.'],
        EmailRules: [
          (value) => !!value || 'Required.',
          (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid e-mail.';
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
        const { data } = await axios.post('http://localhost:2410/KundeRegister', {
          Vorname: this.Vorname,
          Nachname: this.Nachname,
          Email: this.Email,
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
      //Beide Passwörter vergleichen
      if (this.Passwort1 == this.Passwort2) {
        // Auth-Code bekommen
        const { data: code } = await axios.post('http://localhost:2410/SendCode', {
          Vorname: this.Vorname,
          Nachname: this.Nachname,
          Email: this.Email,
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