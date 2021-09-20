<template>
  <div class="MainDiv">
    <div class="InnerDiv">
      <!--Preis & Produkttitel-->
      <div class="PriceAndName">
        <p style="float: left;">{{ this.Preis }}€</p>
        <p style="float: right;">{{ this.Name }}</p>
      </div>

      <!--Bild & ZusatzDiv-->
      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ProduktID: this._ProduktID,
      Name: this._Name,
      Preis: this._Preis,
      Kurzbeschreibung: this._Kurzbeschreibung,
      Kategorie: this._Kategorie,
      Link3D: this._Link3D,
    };
  },

  props: {
    _ProduktID: Number,
    _Name: String,
    _Preis: Number,
    _Kurzbeschreibung: String,
    _Kategorie: String,
    _Link3D: String,
  },
};
</script>

<style>
.MainDiv {
  height: 300px;
  width: 600px;
  min-width: 300px;
  min-height: auto;
  border: solid black 2px;
  border-radius: 20px;
  background: white;
  -webkit-box-shadow: 0px 0px 50px 10px rgb(255, 0, 0, 10);
  box-shadow: 0px 0px 50px 10px rgb(255, 0, 0, 10);
  margin-top: 2%;
  flex-basis: 30%;
  flex-shrink: 0;
}

.InnerDiv {
  margin: 1.5% 2%;
}

.PriceAndName > p:nth-child(1) {
  background-color: #04020d9d;
  color: white;
  padding: 0.2% 0.6%;
  border-radius: 15px;
  font-weight: bold;
}
.PriceAndName > p:nth-child(2) {
  font-size: 250%;
  color: red;
}
</style>
