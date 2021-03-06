<template>
  <!-- Umbauen auf User von LS -->
  <div v-if="this.$store.state.KundeWarenkorb.length || this.$store.state.GuestWarenkorb.length">
    <!--Überschrift-->
    <h1 class="text-center pt-6 pb-6">Produkte im Warenkorb</h1>

    <v-container class="d-flex flex-wrap justify-space-around">
      <div v-for="produkt in this.Basket" :key="produkt.Name">
        <CardBasket
          :_productObj="produkt"
          @changePrice="UpdatePreisAndBasket"
          @delProdukt="WarenkorbRemove"
        />
      </div>
    </v-container>

    <v-snackbar v-model="snackbar" :timeout="1000">
      Der Artikel wurde erfolgreich gelöscht
    </v-snackbar>

    <!--Preis und Bezahlen Abschnitt-->
    <v-divider></v-divider>

    <v-container class="d-flex flex-wrap justify-space-around pt-4">
      <!--Aktuelle Warenkorbsumme-->
      <h3>Summe aller Produkte: {{ Summe_warenkorb }}€</h3>

      <!--Bezahlen-Button-->
      <v-btn
        @click="Bezahlen"
        outlined
        text
        class="orange darken-2"
        :disabled="buttonZahlenDisabledImmer"
      >
        Bezahlen
      </v-btn>
    </v-container>
  </div>
  <div v-else id="particle-container">
    <!--Überschrift-->
    <h1 class="text-center pt-6 z-index-2">Es sind noch keine Produkte vorhanden</h1>

    <!--Hintergrund-Partikel-->
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>

    <v-snackbar v-model="snackbar" style="z-index:2" :timeout="1000">
      Der Artikel wurde erfolgreich gelöscht
    </v-snackbar>
  </div>
</template>

<script>
import eventBus from '../eventbus';
import axios from 'axios';
import CardBasket from '../components/CardBasket.vue';
export default {
  name: 'Basket',
  components: {
    CardBasket,
  },

  data() {
    return {
      Summe_warenkorb: 0,
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,
      Basket: [],

      AnzahlImwarenkorb:
        this.$store.state.AktiverUser != null
          ? this.$store.state.KundeWarenkorb.length
          : this.$store.state.GuestWarenkorb.length,

      selectAnzahl: [],

      snackbar: false,
      buttonZahlenDisabled: true,
      buttonZahlenDisabledImmer: false,
    };
  },

  created() {
    //Anzahl ändern select füllen
    for (let index = 1; index < 100; index++) {
      this.selectAnzahl.push(index);
    }

    //Basket richtig setzen (Entscheiden ob von GuestWarenkorb oder Kundenwarenkorb)
    this.Basket =
      this.$store.state.aktiverUser != null
        ? this.$store.state.KundeWarenkorb
        : this.$store.state.GuestWarenkorb;

    //Preis updaten
    this.UpdatePreisAndBasket();

    //Bezahlenbutten setzen, wenn sich der User eingloggt hat
    this.$store.state.aktiverUser != null
      ? (this.buttonZahlenDisabled = false)
      : (this.buttonZahlenDisabled = true);
  },

  methods: {
    //Preisupdaten-Funktion
    UpdatePreisAndBasket() {
      console.log('Preis-Neukalkulation');
      //Preis neu definieren
      this.$store.dispatch('WarenkorbSummeErhalten').then((res) => {
        //Preis resetten
        this.Summe_warenkorb = 0;
        //Neuen Preis berechnen und zuweisen
        this.Summe_warenkorb = res;
        //Basket mit dementsprechenden Store-Warenkorb aktualisieren
        this.Basket =
          this.$store.state.aktiverUser != null
            ? this.$store.state.KundeWarenkorb
            : this.$store.state.GuestWarenkorb;
      });
    },

    //Lösch-Funktion
    WarenkorbRemove({ ID }) {
      //Store-Methode löscht das Item aus dementsprechenden Warenkorb
      this.$store.dispatch('RemoveFromWarenkorb', ID);

      //Preis & Warenkorb updaten
      this.UpdatePreisAndBasket();

      //Update Badge
      eventBus.$emit('UpdateLocalStorage');
      this.snackbar = true;
    },

    async Bezahlen() {
      this.buttonZahlenDisabled = true;

      const sendPay = {
        warenkorb: this.Basket,
        aktiveruser: this.$store.state.aktiverUser,
      };

      //Warenkorb an Backend schicken
      const resPay = await axios.post(`${this.serverAdress}/payment`, sendPay);
      console.log(resPay);

      const resAddOrder = await axios.post(`${this.serverAdress}/addOrder`, sendPay);
      console.log('ResAddOrder-Res: ' + resAddOrder.status);

      //Wenn Bestellung erolgreich Warenkorb leeren
      if (resPay.status == 200) {
        //Löschmeldung
        alert('Warenkorb wird nach dem Kaufen gelöscht');
        //Warenkorb des Users löschen
        this.$store.dispatch('ClearBasketAfterBuy');

        // 	//Fertig-Meldung
        alert('Fertig den Warenkorb bearbeitet!');
      }
    },
  },
};
</script>

<style lang="scss">
.particle {
  position: absolute;
  border-radius: 50%;
  z-index: 1;
}

@for $i from 1 through 30 {
  @keyframes particle-animation-#{$i} {
    100% {
      transform: translate3d((random(90) * 1vw), (random(90) * 1vh), (random(100) * 1px));
    }
  }

  .particle:nth-child(#{$i}) {
    animation: particle-animation-#{$i} 60s infinite;
    $size: random(5) + 5 + px;
    opacity: random(100) / 100;
    height: $size;
    width: $size;
    animation-delay: -$i * 0.2s;
    transform: translate3d((random(90) * 1vw), (random(90) * 1vh), (random(100) * 1px));
    background: orange;
  }
}
</style>
