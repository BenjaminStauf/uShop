<template>
  <v-container>
    <!-- Bewertung schreiben -->
    <div v-if="showWriteBewertung">
      <h2 class="text-center">Schreiben Sie Ihre Bewertung</h2>
      <v-form ref="form" lazy-validation v-model="valid">
        <!-- ToDo Form -->
        <v-container class="d-flex flex-wrap">
          <v-col>
            <!--MeinSpalte wo Inputs liegen-->
            <v-row class="justify-center">
              <v-col md="5">
                <v-text-field
                  type="text"
                  label="Titel der Bewertung"
                  v-model="titel"
                  :rules="rules.required"
                  required
                />
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col cols="3">
                <p class="mt-2 mb-0">Wie viele Sterne wuerden Sie dem Produkt geben ?</p>
              </v-col>

              <v-col cols="2">
                <v-input :value="rating" :rules="rules.required">
                  <v-rating
                    v-model="rating"
                    background-color="orange darken-2"
                    color="orange darken-2"
                    :rules="rules.required"
                  ></v-rating>
                </v-input>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col cols="5">
                <v-textarea
                  :rules="rules.required"
                  filled
                  label="Schreiben Sie Ihre Meinung"
                  auto-grow
                  v-model="bewertungText"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-btn class="orange darken-2" @click="sendBewertung">Submit</v-btn>
              <v-btn class="red ml-2" @click="showWriteBewertung = false">Cancle</v-btn>
            </v-row>
          </v-col>
        </v-container>
      </v-form>
    </div>

    <v-container v-bind:class="showWriteBewertung ? 'BackgroundUnscharf' : 'BackgroundScharf'">
      <v-row>
        <!--3D-Modellanzeige-->
        <v-col class="mr-4" cols="12" xs="12" md="7">
          <!-- 3D-MODELRENDERER -->
          <model-gltf
            @on-load="geladen"
            :background-color="background3D"
            :src="Link3D"
            class="Model3D"
          ></model-gltf>

          <!--Loading-Animation-->

          <vue-element-loading :active="showSpinner" style="z-index: 1;">
            <img src="../../public/spinner.gif" width="55px" height="55px" />
          </vue-element-loading>
        </v-col>
        <!-- <v-col class="red" cols="1" xs="0" md="1"></v-col> -->
        <!--Produktdatenanzeige-->
        <v-col xs="12" md="4">
          <h2 class="text-center mt-6">{{ Name }}</h2>
          <br />
          <h3 class="ml-3">Kategorie: {{ Kategorie }}</h3>
          <br />
          <h3 class="ml-3">{{ Preis }}€</h3>
          <br />
          <h3 class="ml-3 mr-3">{{ Kurzbeschreibung }}</h3>
          <br />
          <v-col col="4">
            <label for="Anzahl" class="pl-1">Anzahl:</label>
            <v-select
              :items="anzahl"
              label="Anzahl"
              class="pt-2"
              dense
              solo
              v-model="selectAnzahl"
              id="Anzahl"
            ></v-select>
          </v-col>
          <v-rating
            empty-icon="mdi-star-outline"
            full-icon="mdi-star"
            length="5"
            size="32"
            :value="Bewertung"
            readonly
            color="orange darken-2"
            background-color="grey"
          ></v-rating>
          <br />
          <br />
          <v-btn outlined text class="orange darken-2" @click="AddBasket">
            Zum Warenkorb hinzufügen<v-icon right>mdi-cart-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <br />
      <br />

      <v-divider></v-divider>

      <!-- Bewertung -->
      <h2 class="text-center mt-3">Bewertungen</h2>
      <br />

      <v-row justify="center">
        <v-btn @click="writeBewertung">Schreiben Sie eine Bewertung</v-btn>
      </v-row>
      <br />
      <v-container v-if="bewertungen.length > 0">
        <v-container v-for="bewertung_DB in bewertungen" :key="bewertung_DB.ID">
          <Bewertung :bewertung="bewertung_DB" />
        </v-container>
      </v-container>
      <v-container v-else>
        <h3 class="text-center">Es sind leider noch keine Bewertungen vorhanden</h3>
      </v-container>
      <br />
      <!--Hinweise, wenn man was dem Warenkorb hinzugefügt hat-->
      <v-snackbar v-model="snackbar" :timeout="timeout" :color="color">{{ text }}</v-snackbar>
    </v-container>

    <!-- Schreibe eine Bewertung -->
  </v-container>
</template>

<script>
import { ModelGltf } from 'vue-3d-model';
import VueElementLoading from 'vue-element-loading';
import Bewertung from '../components/Bewertung.vue';
import axios from 'axios';
export default {
  name: 'Shop',

  components: {
    ModelGltf,
    VueElementLoading,
    Bewertung,
  },

  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,

      ID: this.$route.params.ID,
      Name: this.$route.params.Name,
      Preis: this.$route.params.Preis,
      Kurzbeschreibung: this.$route.params.Kurzbeschreibung,
      Kategorie: this.$route.params.Kategorie,
      Link3D: this.$route.params.Link3D,
      LinkImage: this.$route.params.LinkImage,
      Bewertung: this.$route.params.Bewertung,
      AnzahlBasket: this.$route.params.Anzahl,

      snackbar: false,
      text: `Der Artikel wurde zum Warenkorb hinzugefügt`,
      color: 'black',
      timeout: 1000,
      anzahl: [],
      selectAnzahl: 1,

      background3D: '#eeeeee',
      showSpinner: true,
      label: 'Loading',

      showWriteBewertung: false,

      aktiverUser: {},
      valid: true,

      titel: '',
      rating: 0,
      bewertungText: '',
      rules: {
        required: [(value) => !!value || 'Required.'],
      },

      bewertungen: [],
    };
  },
  methods: {
    async writeBewertung() {
      if (this.$store.state.aktiverUser) {
        let berechtigung = false;
        //Axios calls um die Bestellungen zu bekommen
        const post = await axios.post(`${this.serverAdress}/getOrders`, {
          KundenID: this.aktiverUser.Kunden_ID,
        });
        let orders = post.data;

        //Schauen ob der Kunde das Produkt gekauft hat
        for (const iterator of orders) {
          // console.log(`ProduktID: ${iterator.ProduktID} | andereID: ${this.ID}`);
          if (iterator.ProduktID == this.ID) {
            berechtigung = true;
            //ganz nach oben Scrollen
            window.scrollTo(0, 0);
          }
        }

        //Überprüfen ob der Kunde eine Bewertung schreiben darf
        if (berechtigung == true) {
          //Show Form für bewertung
          this.showWriteBewertung = true;
        } else {
          this.text = 'Sie müssen das Produkt gekauft haben um eine Bewertung schreiben zu können';
          this.color = 'red';
          this.snackbar = true;
        }
      } else {
        this.text = 'Sie müssen angemeldet sein um eine Rezension abgeben zu können';
        this.color = 'red';
        this.snackbar = true;
      }
    },
    async sendBewertung() {
      if (this.$refs.form.validate()) {
        let date = new Date().toISOString().slice(0, 10);
        let bewertung = {
          titel: this.titel,
          bewertung: this.rating,
          datum: date,
          text: this.bewertungText,
          produkt_ID: this.ID,
        };
        // console.log(bewertung);

        //Daten ans Backend schicken
        const res = await axios.post(`${this.serverAdress}/writeBewertung`, {
          user: this.aktiverUser,
          bewertung: bewertung,
        });

        this.showWriteBewertung = false;
      }
    },
    geladen() {
      this.showSpinner = false;
      //console.log(this.showSpinner);
    },
    AddBasket() {
      if (this.selectAnzahl != 0) {
        //Item dem Warenkorb hinzufügen
        this.$store.dispatch('PushInWarenkorb', {
          ID: this.ID,
          Name: this.Name,
          Preis: this.Preis,
          Kurzbeschreibung: this.Kurzbeschreibung,
          Kategorie: this.Kategorie,
          Link3D: this.Link3D,
          LinkImage: this.LinkImage,
          Bewertung: this.Bewertung,
          Anzahl: this.selectAnzahl,
        });

        //Warenkorb Bestätigungsnachricht anzeigen
        this.snackbar = true;
        this.color = 'black';
        this.text = 'Der Artikel wurde zum Warenkorb hinzugefügt';
      } else {
        this.text = 'Sie müssen eine Produktanzahl auswählen';
        this.color = 'red';
        this.snackbar = true;
      }
    },
  },
  async mounted() {
    this.aktiverUser = JSON.parse(localStorage.getItem('LoggedInKunde'));
    //console.log(this.showSpinner);

    //Anzahl Select befüllen
    for (let index = 1; index < 100; index++) {
      this.anzahl.push(index);
    }

    //Anzahl aus Warenkorb bekommen
    if (this.AnzahlBasket > 0) {
      this.selectAnzahl = this.AnzahlBasket;
    }

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
        LinkImage: this.LinkImage,
        Bewertung: this.Bewertung,
        Anzahl: this.Anzahl,
      };
      localStorage.setItem('LastObj', JSON.stringify(aktuellObjekt));
    } else {
      //Objekt Laden
      let erg = JSON.parse(localStorage.getItem('LastObj'));
      this.ID = erg.ID;
      this.Name = erg.Name;
      this.Preis = erg.Preis;
      this.Kategorie = erg.Kategorie;
      this.Kurzbeschreibung = erg.Kurzbeschreibung;
      this.Link3D = erg.Link3D;
      this.LinkImage = erg.LinkImage;
      this.Bewertung = erg.Bewertung;
      this.Anzahl = erg.Anzahl;
    }
    // console.log('Voll Geladen');

    //Bewertungen von dem produkt holen
    const { data } = await axios.get(`${this.serverAdress}/getBewertung`);
    this.bewertungen = data.filter((element) => element.fk_Produkt == this.ID);

    // this.$nextTick(() => {
    // 	console.log('Alles Voll Geladen');
    // });
  },
};
</script>

<style>
.hideObject {
  visibility: hidden;
}
.showObject {
  visibility: visible;
}
</style>
