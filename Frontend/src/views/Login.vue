<template>
  <div>
    <!--LoginScreen-->
    <h1 class="black--text text-center">Login</h1>

    <v-form ref="submit" lazy-validation>
      <v-container>
        <v-row class="justify-center">
          <v-col md="1"></v-col>
          <v-col md="10">
            <!--Email-->
            <v-row>
              <v-col sm="3"></v-col>
              <v-col>
                <v-text-field
                  v-model="email"
                  label="Email"
                  clearable
                  required
                  :rules="rules.EmailRules"
                ></v-text-field>
              </v-col>
              <v-col sm="3"></v-col>
            </v-row>
            <!--Passwort-->
            <v-row>
              <v-col sm="3"></v-col>
              <v-col>
                <v-text-field
                  v-model="password"
                  :append-icon="showPasswordInput ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="rules.required"
                  :type="showPasswordInput ? 'text' : 'password'"
                  label="Passwort"
                  @click:append="showPasswordInput = !showPasswordInput"
                  :tabindex="-1"
                ></v-text-field>
              </v-col>
              <v-col sm="3"></v-col>
            </v-row>
            <!--Submit-->
            <v-row>
              <v-col sm="5"></v-col>
              <v-col sm="1">
                <v-btn type="submit" @click="submit">Einloggen</v-btn>
              </v-col>
              <v-col sm="3"></v-col>
            </v-row>

            <!--Register weiterleiten-->
            <br />
            <br />
            <v-row>
              <v-col md="3"></v-col>
              <v-col md="3">
                <router-link class="black--text text-decoration-none" :to="{ name: 'Register' }"
                  ><p>Zurück zum <span>Registrieren</span></p>
                </router-link>
              </v-col>
              <v-col md="10"></v-col>
            </v-row>
          </v-col>
          <v-col md="1"></v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      showPasswordInput: false,

      rules: {
        required: [(val) => (val || '').length > 0 || 'This field is required'],
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
  methods: {
    ClearInputs() {
      this.email = '';
      this.password = '';
    },

    async submit() {
      //Anfrage auf den Server, um sich einzuloggen
      let res = await axios.post('http://localhost:2410/KundenLogin', {
        Email: this.email,
        Passwort: this.password,
      });

      //Inputs leeren
      this.ClearInputs();
      //Eingeloggten Kunden setzen
      await localStorage.setItem('LoggedInKunde', JSON.stringify(res.data.FoundUser));
      await localStorage.setItem('EverReg', true);
      //Zur Account seite weiterleiten, die alles dann Managed
      this.$router.push('account');
    },
  },
};
</script>

<style>
span {
  color: rgb(9, 156, 9);
  font-weight: bold;
}
</style>
