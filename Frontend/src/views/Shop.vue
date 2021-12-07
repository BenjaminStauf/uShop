<template>
  <div>
    <!--Überschrift-->
    <h1 class="black--text center text-center pt-4">
      <span class="black--text display-3">u</span
      ><span class="orange--text text--darken-2 display-3 ">SHOP</span>
    </h1>

    <!--Webseiten-Beschreibung-->
    <v-container>
      <h3 class="font-weight-light --text pl-6 pr-6 pt-6">
        Die richtigen Möbel sind es, die ihrem Zuhause seinen einzigartigen Charakter verleihen und
        die perfekte Wohlfühlumgebung für Sie schaffen. Und genau solche Möbel finden sie bei
        unserem Webshop. Die dutzende Anzahl an Produkten, wird Sie mit hoher Sicherheit begeistern.
        Unser Webshop führt nur hochwertige Produkte, um Ihnen die besten Erfahrungen mit diesen zu
        garantieren. Außderdem bieten wir eine sichere, einfache und schnelle Zahlung mittels
        PayPal. Dadurch können wir Ihre Produkte noch am selben Tag der Bestellung für den Versand
        vorbereiten.
      </h3>
    </v-container>

    <br />
    <!-- Filter Kategorie-->
    <v-container>
      <v-icon class="black--text ml-6" @click="filterShow = !filterShow">mdi-filter</v-icon>
      <v-container align="center" v-if="filterShow">
        <v-row justify="center">
          <ul v-for="Kategorie in $store.state.Kategorien" :key="Kategorie.KategorieID">
            <v-checkbox
              color="cyan darken-2 "
              v-bind:label="Kategorie.KategorieName"
              v-bind:value="Kategorie.KategorieName"
              v-model="selected"
            ></v-checkbox>
          </ul>
        </v-row>
      </v-container>

      <!-- Filter search -->
      <v-icon class="black--text ml-6" @click="searchShow = !searchShow">mdi-magnify</v-icon>
      <v-container class="justify-center" v-if="searchShow">
        <v-col cols="4" class="pt-4 justify-center">
          <v-row class="justify-center">
            <v-text-field label="Suchen" solo v-model="pattern"></v-text-field>
          </v-row>
        </v-col>
      </v-container>
    </v-container>

    <!--Produkte anzeigen-->
    <div>
      <v-container class="d-flex flex-wrap justify-space-around justify-center align-center">
        <div v-for="produkt in setFilter" :key="produkt.ProduktID">
          <Card :_productObj="produkt"/>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import Card from '../components/Card.vue';

export default {
  name: 'Shop',

  components: {
    Card,
  },
  data() {
    return {
      name: 'Test',
      selected: [],
      filterShow: false,
      searchShow: false,
      pattern: '',
    };
  },
  methods: {
    searchFilter() {},
    kategorieFilter() {},
  },
  created() {
    //Letztes Item aus dem LocalStorage löschen
    localStorage.removeItem('LastObj');
  },

  computed: {
    setFilter() {
      //Variablen für Kategorie Filter:
      let selected = this.selected;
      //Variablen für Search Filter
      let ProduktArray = this.$store.state.produkte;
      let pattern = this.pattern;

      //Filter-Vorgang für Schaulustige
      //   return ProduktArray.filter((Produkt) => {
      //     //Wenn keine Kategorie gewählt wurde
      //     if (selected.length == 0) {
      //       return Produkt.Name.toLowerCase().includes(pattern.toLowerCase());
      //     }
      //     //Wenn eine Kategorie gewählt wurde
      //     else {
      //       if (
      //         Produkt.Name.toLowerCase().includes(pattern.toLowerCase()) &&
      //         selected.includes(Produkt.Kategorie)
      //       ) {
      //         return Produkt;
      //       }
      //     }
      //   });

      //Filter-Vorgang
      return ProduktArray.filter((Produkt) =>
        selected.length == 0
          ? Produkt.Name.toLowerCase().includes(pattern.toLowerCase())
          : Produkt.Name.toLowerCase().includes(pattern.toLowerCase()) &&
            selected.includes(Produkt.Kategorie)
          ? Produkt
          : console.log('Nix'),
      );
    },
  },
};
</script>
