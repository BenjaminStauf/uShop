<template>
	<div class="background">
		<v-row>
			<v-col cols="8">
				<v-row class="justify-center mt-6">
					<!--3D-MODELRENDERER-->
					<model-gltf
						@on-load="geladen"
						:background-color="background3D"
						:src="Link3D"
					></model-gltf>

					<vue-element-loading :active="showSpinner">
						<img src="../../public/spinner.gif" width="55px" height="55px" />
					</vue-element-loading>
				</v-row>
			</v-col>
			<v-divider vertical></v-divider>
			<v-col cols="4">
				<h2 class="text-center mt-6">{{ Name }}</h2>
				<br />
				<h3 class="ml-3">Kategorie: {{ Kategorie }}</h3>
				<br />
				<h3 class="ml-3">{{ Preis }}€</h3>
				<br />
				<h3 class="ml-3 mr-3">{{ Kurzbeschreibung }}</h3>
				<br />
				<v-col cols="4">
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
					half-icon="$mdiStarHalfFull"
					length="5"
					size="32"
					:value="Bewertung"
					readonly
					color="warning"
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
		<br />
		<br />
		<v-snackbar v-model="snackbar" :timeout="timeout" :color="color">{{ text }}</v-snackbar>
	</div>
</template>

<script>
import { ModelGltf } from 'vue-3d-model';
import VueElementLoading from 'vue-element-loading';
export default {
	components: {
		ModelGltf,
		VueElementLoading,
	},

	data() {
		return {
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

			background3D: '#EEEEEE',
			showSpinner: true,
			label: 'Loading',
		};
	},
	methods: {
		geladen() {
			this.showSpinner = false;
			//console.log(this.showSpinner);
		},
		AddBasket() {
			if (this.selectAnzahl != 0) {
				//Item dem Warenkorb hinzufügen
				let ThisProduct = {
					ID: this.ID,
					Name: this.Name,
					Preis: this.Preis,
					Kurzbeschreibung: this.Kurzbeschreibung,
					Kategorie: this.Kategorie,
					Link3D: this.Link3D,
					LinkImage: this.LinkImage,
					Bewertung: this.Bewertung,
					Anzahl: this.selectAnzahl,
				};
				this.$store.dispatch('PushInWarenkorb', ThisProduct);

				//Warenkorb Bestätigungsnachricht anzeigen
				this.snackbar = true;
				this.color = 'black';
				this.text = 'Der Artikel wurde zum Warenkorb hinzugefügt';
			} else {
				this.text = 'Sie müssen eine Poduktanzahl auswählen';
				this.color = 'red';
				this.snackbar = true;
			}
		},
	},
	mounted() {
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
			this.Name = erg.Name;
			this.Preis = erg.Preis;
			this.Kategorie = erg.Kategorie;
			this.Kurzbeschreibung = erg.Kurzbeschreibung;
			this.Link3D = erg.Link3D;
			this.LinkImage = erg.LinkImage;
			this.Bewertung = erg.Bewertung;
			this.Anzahl = erg.Anzahl;
		}
		console.log('Voll Geladen');

		// this.$nextTick(() => {
		// 	console.log('Alles Voll Geladen');
		// });
	},
};
</script>

<style>
/* .background{
	background-color: #EEEEEE;
} */
.hideObject {
	visibility: hidden;
}
.showObject {
	visibility: visible;
}

.anordnen {
	display: flex;
	justify-content: center;
	align-content: center;
	background-color: lime;
}

/* .test{
	background-color: pink;
	height: 100%;
	width: 100%;
	display: flex;
} */
</style>
