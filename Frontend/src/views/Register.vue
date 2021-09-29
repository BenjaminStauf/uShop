<template>
  <div>
    <h1 class="text-center">Register</h1>
    <h3 class="text-center pt-6">
      Willkommen, wenn Sie noch kein Konto haben können sie hier kostelos eines erstellen.
    </h3>
    <br />
    <br />
    <v-form>
      <v-container class="d-flex flex-wrap justify-space-around">
        <v-row class=" red justify-center">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="firstname"
              :rules="nameRules"
              label="Vorname"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="lastname"
              :rules="nameRules"
              label="Nachname"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="lime justify-center" >
          <v-col cols="12" md="3">
            <v-text-field v-model="email" :rules="emailRule" label="Email" required>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vorname: '',
      nachname: '',
      email: '', 
    };
  },
};
</script>

<style></style>
