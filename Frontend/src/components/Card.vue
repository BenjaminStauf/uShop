<template>
	<div class="MainDiv">
		<div class="InnerDiv">
			<!--Preis & Produkttitel-->
			<div class="PriceAndName">
				<p>{{ this.Produkt.Preis }}€</p>
				<span
					id="ProduktTitle"
					:style="this.Produkt.Name.length >= 16 ? 'fontSize: 120%' : 'fontSize: 160%'"
				>
					{{ this.Produkt.Name }}
				</span>
			</div>
			<!--Bild-->
			<!-- <img :src="Produkt.LinkItem" :alt="this.Produkt.Name" /> -->
			<!-- <p>{{ this.Produkt.LinkImage }}</p> -->
			<img src="../../Images/Produkt_Images/Tisch_Sessel1.jpg" :alt="this.Produkt.Name" /> 
			<!--Bewertung-->
			<v-rating
				class="ratingClass"
				background-color="warning"
				color="warning"
				empty-icon="mdi-star-outline"
				full-icon="mdi-star"
				readonly
				half-increments
				length="5"
				size="10"
				:value="this.Produkt.Bewertung"
			></v-rating>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			Produkt: this._productObj,
			LinkImage: '../../Images/Produkt_Images/SchwarzesBett_28.jpg',
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
.PriceAndName > span:nth-child(2) {
	text-align: right;
	color: black;
	font-family: 'Varela Round';
	font-weight: bold;
	font-size: 150%;
	float: right;
	max-width: 80%;

	background-color: orange;
}

.PriceAndName {
	margin-bottom: 2%;
	background-color: orchid;
	width: 100%;
	height: 25%;
}

.ratingClass {
	float: right;
	z-index: 2;
	position: relative;
	top: -90%;
	background-color: lime;
}

img {
	float: left;
	width: 60%;
	height: auto;
	padding-bottom: 5%;
}
</style>
