<template>
  <div class="MainDiv">
    <div class="InnerDiv">
      <!--Preis & Produkttitel-->
      <div class="PriceAndName">
        <p>{{ this.Produkt.Preis }}€</p>
        <p>{{ this.Produkt.Name }}</p>
      </div>

      <!--Bild & Rating-->
      <div>
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
          size="25"
          :value="this.Produkt.Bewertung"
          style="float:right; z-index: 2; position: absolute; right: 0%; top: 2.3rem"
        >
        </v-rating>
      </div>
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
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');

.MainDiv {
  height: 250px;
  width: 350px;
  min-width: 300px;
  min-height: auto;
  border: solid black 2px;
  border-radius: 20px;
  background: white;
  margin-top: 2%;
  flex-basis: 30%;
  flex-shrink: 0;
}

.InnerDiv {
  margin: 1.5% 2%;
  position: relative;
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
  font-size: 250%;
  color: black;
  font-family: 'Varela Round';
  font-weight: bold;
  font-size: 180%;
  float: right;
}

img {
  margin-bottom: 2px;
  float: left;
  width: 55%;
  height: auto;
  position: relative;
  z-index: 0;
}
</style>
