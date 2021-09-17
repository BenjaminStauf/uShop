<template>
  <div v-if="this.$store.state.Warenkorb.length">
    <h1 class="text-center pt-6 pb-6">Produkte im Warenkorb</h1>
    <v-container class="d-flex flex-wrap justify-space-around">
      <div v-for="produkte in $store.state.Warenkorb" :key="produkte.ID">
        <v-card outlined max-width="500px" class="ma-4">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                {{ produkte.ID }} {{ produkte.Name }} {{ produkte.Link3D }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ produkte.Kurzbeschreibung }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="100" color="grey"></v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <router-link
              :to="{
                name: 'Product_Detail',
                params: {
                  ID: produkte.ID,
                  Name: produkte.Name,
                  Preis: produkte.Preis,
                  Kurzbeschreibung: produkte.Kurzbeschreibung,
                  Kategorie: produkte.Kategorie,
                  Link3D: produkte.Link3D,
                },
              }"
              class="text-decoration-none"
            >
              <v-btn outlined text class="lime accent-3">
                Zum produkt
              </v-btn>
            </router-link>
            <v-btn outlined text class="red accent-3 ml-3" @click="WarenkorbRemove(produkte)">
              Produkt löschen
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-container>
  </div>
  <div v-else>
    <h1 class="text-center pt-6">Es sind noch keine Produkte vorhanden</h1>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.state.Warenkorb = JSON.parse(localStorage.getItem('test') || '[]');
	console.table(this.$store.state.Warenkorb);
  },
  methods: {
    WarenkorbRemove(produktZuLöschen) {
      console.log('Funktion wurde aufgerufen');
      this.$store.state.Warenkorb = this.$store.state.Warenkorb.filter((produkt) => produkt.ID != produktZuLöschen.ID);
      console.table(this.$store.state.Warenkorb);
	  //Local Storage Clearen
	  localStorage.clear()
	  //Local Storage neu befüllen
	  localStorage.setItem('test', JSON.stringify(this.$store.state.Warenkorb));
	
    },
  },
};
</script>

<style></style>
