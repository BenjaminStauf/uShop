<template>
  <div>
    <!--Überschrift-->
    <h1 class="black--text center text-center pt-4">
      <span class="black--text display-3">u</span
      ><span class="cyan--text accent-2 display-3 ">SHOP</span>
    </h1>

    <!--Webseiten-Beschreibung-->
    <p class="black--text pl-6 pr-6 pt-6">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt atque sequi, dignissimos veniam
      quo illo maxime, iste culpa non consectetur recusandae. Delectus fugit pariatur quasi
      accusamus cupiditate ipsam nostrum autem laborum incidunt sed temporibus et vel odit eius
      laboriosam quo mollitia, eaque laudantium officiis architecto voluptatibus recusandae? Nostrum
      repellendus mollitia corrupti, esse maiores porro cum adipisci fugit perspiciatis consectetur.
      Accusantium cupiditate voluptatum error debitis nostrum et ipsum quas sequi, animi numquam
      optio culpa voluptate possimus impedit laborum minima molestias iusto vero tempora nesciunt
      eius accusamus. Nostrum, dolore, optio, nisi aspernatur quos porro rerum iure repellendus
      voluptate architecto eius illo ipsam.
    </p>

    <!-- Filter -->
    <v-icon class="black--text ml-6" @click="ToggleFilter()">mdi-filter</v-icon>
    <v-container align="center" v-if="filterShow">
      <v-row justify="center">
        <ul v-for="Kategorie in $store.state.Kategorien" :key="Kategorie.ID">
          <v-checkbox
            color="cyan darken-2 "
            v-bind:label="Kategorie.Name"
            v-bind:value="Kategorie.Name"
            v-model="selected"
          ></v-checkbox>
        </ul>
      </v-row>
    </v-container>

    <!--Produkte-->
    <!-- Wenn kein Filter gesetzt ist, werden alle angezeigt -->
    <div v-if="selected.length == 0">
      <v-container class="d-flex flex-wrap justify-space-around justify-center align-center">
        <div v-for="produkt in changeProducts" :key="produkt.ProduktID">
          <router-link
            :to="{
              name: 'Product_Detail',
              params: {
                ID: produkt.ProduktID,
                Name: produkt.Name,
                Preis: produkt.Preis,
                Kurzbeschreibung: produkt.Kurzbeschreibung,
                Kategorie: produkt.Kategorie,
                Link3D: produkt.Link3D,
                Bewertung: produkt.Bewertung,
              },
            }"
          >
            <Card :_productObj="produkt" />
          </router-link>
        </div>
        <!-- </div> -->
      </v-container>
    </div>

    <!-- Wenn ein Filter gesetzt ist, werden nur diese Angezeigt -->
    <div v-else>
      <v-container class="d-flex flex-wrap justify-space-around justify-center">
        <div v-for="produkt in changeProducts" :key="produkt.ID">
          <!-- Filter -->
          <div v-if="selected.includes(produkt.Kategorie)">
            <router-link
              :to="{
                name: 'Product_Detail',
                params: {
                  ID: produkt.ProduktID,
                  Name: produkt.Name,
                  Preis: produkt.Preis,
                  Kurzbeschreibung: produkt.Kurzbeschreibung,
                  Kategorie: produkt.Kategorie,
                  Link3D: produkt.Link3D,
                  Bewertung: produkt.Bewertung,
                },
              }"
            >
              <Card :_productObj="produkt" />
            </router-link>
          </div>
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
    };
  },
  methods: {
    ToggleFilter() {
      this.filterShow = !this.filterShow;
    },
  },
  created() {
    //Letztes Item aus dem LocalStorage löschen
    localStorage.removeItem('LastObj');
  },
  computed: {
    changeProducts() {
      let selected = this.selected;
      let returnArray;
      if (selected.length == 0) {
        returnArray = this.$store.state.produkte;
      } else {
        returnArray = this.$store.state.produkte.filter((element) => {
          if (selected.includes(element.Kategorie)) {
            return element;
          }
        });
      }

      return returnArray;
    },
  },
};
</script>
