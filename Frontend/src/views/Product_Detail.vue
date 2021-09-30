<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-row class="justify-center mt-6">
          <v-img
            class=""
            max-height="500px"
            max-width="500px"
            src="https://ctc-wenzel.de/wp-content/uploads/Foto-Platzhalter.jpg"
          ></v-img>
        </v-row>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="4">
        <h2 class="text-center mt-6">{{ Name }}</h2>
        <br />
        <h3 class="ml-3">Kategorie: {{ Kategorie }}</h3>
        <br />
        <h3 class="ml-3">{{ Preis }}€</h3>
        <br />
        <h3 class="ml-3 mr-3">{{ Kurzbeschreibung }}</h3>
        <br />
        <v-rating
          empty-icon="mdi-star-outline"
          full-icon="mdi-star"
          half-icon="$mdiStarHalfFull"
          length="5"
          size="32"
          :value="Bewertung"
          readonly
          color="warning"
          background-color="grey"
        ></v-rating>
        <br />
        <br />

        <v-btn outlined text class="lime accent-3" @click="AddBasket">
          Zum Warenkorb hinzufügen<v-icon right>mdi-cart-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <br />
    <br />

    <v-divider></v-divider>
    <router-link :to="{ name: 'Shop' }" class="text-decoration-none">
      <v-btn outlined text class="lime accent-3">Zurück zu den Produkten</v-btn>
    </router-link>
    <br />
    <br />
    <v-snackbar v-model="snackbar" :timeout="timeout">{{ text }}</v-snackbar>
  </div>
</template>

<script>
import eventBus from '../eventbus';

export default {
  data() {
    return {
      ID: this.$route.params.ID,
      Name: this.$route.params.Name,
      Preis: this.$route.params.Preis,
      Kurzbeschreibung: this.$route.params.Kurzbeschreibung,
      Kategorie: this.$route.params.Kategorie,
      Link3D: this.$route.params.Link3D,
      Bewertung: this.$route.params.Bewertung,
      snackbar: false,
      text: `Der Artikel wurde zum Warenkorb hinzugefügt`,
      timeout: 1000,
    };
  },
  methods: {
    AddBasket() {
      //Item dem Warenkorb hinzufügen
      let ThisProduct = {
        ID: this.ID,
        Name: this.Name,
        Preis: this.Preis,
        Kurzbeschreibung: this.Kurzbeschreibung,
        Kategorie: this.Kategorie,
        Link3D: this.Link3D,
        Bewertung: this.Bewertung,
      };
      this.$store.dispatch('PushInWarenkorb', ThisProduct);

      //Warenkorb Bestätigungsnachricht anzeigen
      this.snackbar = true;
    },
  },
  mounted() {
    //Bei einem Seiten-Refresh wird das Letzte aufgerufene Objekt geladen
    if (localStorage.getItem('LastObj') == null) {
      //Objekt Speichern
      let aktuellObjekt = {
        ID: this.ID,
        Name: this.Name,
        Preis: this.Preis,
        Kurzbeschreibung: this.Kurzbeschreibung,
        Kategorie: this.Kategorie,
        Link3D: this.Link3D,
        Bewertung: this.Bewertung,
      };
      localStorage.setItem('LastObj', JSON.stringify(aktuellObjekt));
    } else {
      //Objekt Laden
      let erg = JSON.parse(localStorage.getItem('LastObj'));
      this.Name = erg.Name;
      this.Preis = erg.Preis;
      this.Kategorie = erg.Kategorie;
      this.Kurzbeschreibung = erg.Kurzbeschreibung;
      this.Link3D = erg.Link3D;
      this.Bewertung = erg.Bewertung;
    }
  },
};
</script>

<style></style>
