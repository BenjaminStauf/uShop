<template>
	<v-card class="mx-auto my-12" max-width="350">
		<div class="grey darken-1">
			<v-img contain max-height="250" :src="Produkt.LinkImage"></v-img>
		</div>

		<v-card-title>{{ Produkt.Name }}</v-card-title>

		<v-card-text>
			<v-row align="center" class="mx-0">
				<v-rating
					class="ratingClass"
					background-color="warning"
					color="warning"
					empty-icon="mdi-star-outline"
					full-icon="mdi-star"
					readonly
					half-increments
					length="5"
					size="15"
					:value="this.Produkt.Bewertung"
				></v-rating>
			</v-row>

			<v-row align="center" class="mx-0">
				<div class="my-4 text-subtitle-1">
					{{ Produkt.Kategorie }}
				</div>
			</v-row>
		</v-card-text>

		<v-divider class="mx-4"></v-divider>

		<v-card-title>{{ Produkt.Preis }}€</v-card-title>

		<v-card-actions>
			<router-link
				class="pb-3 text-decoration-none"
				:to="{
					name: 'Product_Detail',
					params: {
						ID: Produkt.ProduktID,
						Name: Produkt.Name,
						Preis: Produkt.Preis,
						Kurzbeschreibung: Produkt.Kurzbeschreibung,
						Kategorie: Produkt.Kategorie,
						Link3D: Produkt.Link3D,
						Bewertung: Produkt.Bewertung,
						LinkImage: Produkt.LinkImage,
					},
				}"
			>
				<v-btn color="orange darken-2">
					Zum Produkt
				</v-btn>
			</router-link>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	name: 'Card',
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

<style></style>
