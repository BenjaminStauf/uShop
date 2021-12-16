<template>
	<v-container>
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
		</v-container>

		<div v-if="showWriteBewertung" class="AuthenticatorDiv">
			<v-form ref="form" lazy-validation>
				<!-- ToDo Form -->
			</v-form>
		</div>

		<v-container v-bind:class="showWriteBewertung ? 'BackgroundUnscharf' : 'BackgroundScharf'">
			<!-- Bewertung -->
			<h2 class="text-center mt-3">Bewertungen</h2>
			<br />

			<v-row justify="center"
				><v-btn @click="writeBewertung">Schreiben Sie eine Bewertung</v-btn></v-row
			>
			<br />
			<Bewertung />
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
					console.log(`ProduktID: ${iterator.ProduktID} | andereID: ${this.ID}`);
					if (iterator.ProduktID == this.ID) {
						berechtigung = true;
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
	mounted() {
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
		console.log('Voll Geladen');

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

.AuthenticatorDiv {
	display: block;
	margin-left: auto;
	margin-right: auto;
	z-index: 2;
	width: 30%;
	height: 15%;
	background: white;
	border-radius: 45px;
	padding-top: 15%;
}

.BackgroundUnscharf {
	filter: blur(10px);
}
.BackgroundScharf {
	filter: none;
}
</style>
