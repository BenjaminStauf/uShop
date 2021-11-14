<template>
  <div class="MainDiv">
    <div class="InnerDiv">
      <!--Preis & Produkttitel-->
      <div class="PriceAndName">
        <p>{{ this.Produkt.Preis }}€</p>
        <p
          id="ProduktTitle"
          :style="this.Produkt.Name.length >= 16 ? 'fontSize: 120%' : 'fontSize: 160%'"
        >
          {{ this.Produkt.Name }}
        </p>
      </div>

      <!--Bild-->
      <img src="../assets/logo.png" :alt="this.Produkt.Name" />

      <!--Bewertung-->
      <v-rating
        background-color="warning"
        color="warning"
        empty-icon="mdi-star-outline"
        full-icon="mdi-star"
        readonly
        half-increments
        length="5"
        size="23"
        :value="this.Produkt.Bewertung"
        style="float:right; z-index: 2; position: relative; right: 0%; top: -12.3rem"
      ></v-rating>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Produkt: this._productObj,
    };
  },

  props: {
    _productObj: Object,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');

.MainDiv {
  height: 250px;
  width: 350px;
  border: solid black 2px;
  border-radius: 20px;
  background: white;
  margin-top: 2%;
  flex-basis: 30%;
  flex-shrink: 0;
}

.InnerDiv {
  margin: 1.5% 2%;
  width: 95%;
  height: 90%;
}

/*Preis*/
.PriceAndName > p:nth-child(1) {
  background-color: #04020d9d;
  color: white;
  padding: 0.2% 1.5%;
  border-radius: 15px;
  font-weight: bold;
  margin-top: 2%;
  float: left;
}
/*Name*/
.PriceAndName > p:nth-child(2) {
  text-align: right;
  color: black;
  font-family: 'Varela Round';
  font-weight: bold;
  font-size: 150%;
  float: right;
  z-index: 2;
  max-width: 80%;
}

img {
  float: left;
  width: 55%;
  height: auto;
  position: relative;
  padding: 0%;
  margin-left: 0px;
  margin-bottom: 3px;
  z-index: 1;
}
</style>
