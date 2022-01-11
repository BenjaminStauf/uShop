<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <!--Überschrift-->
          <h1 class="black--text center text-center pt-4">
            <span class="black--text display-3">u</span
            ><span class="orange--text text--darken-2 display-3 ">SHOP</span>
          </h1>

          <!--Webseiten-Beschreibung-->
          <h3 class="font-weight-light --text pl-6 pr-6 pt-6">
            Die richtigen Möbel sind es, die ihrem Zuhause seinen einzigartigen Charakter verleihen
            und die perfekte Wohlfühlumgebung für Sie schaffen. Und genau solche Möbel finden sie
            bei unserem Webshop. Die dutzende Anzahl an Produkten, wird Sie mit hoher Sicherheit
            begeistern. Unser Webshop führt nur hochwertige Produkte, um Ihnen die besten
            Erfahrungen mit diesen zu garantieren. Außderdem bieten wir eine sichere, einfache und
            schnelle Zahlung mittels Stripe. Dadurch können wir Ihre Produkte noch am selben Tag der
            Bestellung für den Versand vorbereiten.
          </h3>

          <br />

          <!-- Filter Kategorie-->
          <v-icon class="black--text ml-6" id="kategorieFilter" @click="filterShow = !filterShow"
            >mdi-filter</v-icon
          >
          <label for="kategorieFilter">Kategorie</label>
          <div align="center" v-if="filterShow">
            <v-row justify="center">
              <p v-for="Kategorie in $store.state.Kategorien" :key="Kategorie.KategorieID">
                <v-checkbox
                  v-bind:label="Kategorie.KategorieName"
                  v-bind:value="Kategorie.KategorieName"
                  v-model="selected"
                  class=" mx-4"
                ></v-checkbox>
              </p>
            </v-row>
          </div>

          <!-- Filter search -->
          <v-icon class="black--text ml-6" id="nameFilter" @click="searchShow = !searchShow"
            >mdi-magnify
          </v-icon>
          <label for="nameFilter">Name</label>
          <div class="justify-center" v-if="searchShow">
            <v-row class="justify-center">
              <v-col md="6">
                <v-text-field
                  label="Suchen"
                  solo
                  v-model="pattern"
                  style="margin-top: 0.4rem"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <!--Produkte anzeigen-->
          <div>
            <div class="d-flex flex-wrap justify-space-around justify-center align-center">
              <div v-for="produkt in setFilter" :key="produkt.ProduktID">
                <Card :_productObj="produkt" />
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
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
