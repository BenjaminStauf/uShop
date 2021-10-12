<template>
	<div v-if="this.$store.state.warenkorb.length">
		<h1 class="text-center pt-6 pb-6">Produkte im Warenkorb</h1>
		<v-container class="d-flex flex-wrap justify-space-around">
			<div v-for="produkt in $store.state.warenkorb" :key="produkt.Name">
				<v-card outlined max-width="500px" class="ma-4">
					<v-list-item three-line>
						<v-list-item-content>
							<v-list-item-title class="text-h5 mb-1">
								{{ produkt.ProduktID }} {{ produkt.Name }} {{ produkt.Link3D }}
							</v-list-item-title>
							<v-list-item-subtitle>{{ produkt.Kurzbeschreibung }}</v-list-item-subtitle>
							<v-col cols="4">
								<v-select
									v-model="produkt.Anzahl"
									:items="selectAnzahl"
									@change="UpdatePreis"
								></v-select>
							</v-col>
						</v-list-item-content>

						<v-list-item-avatar tile size="100" color="grey"></v-list-item-avatar>
					</v-list-item>

					<v-card-actions>
						<router-link
							:to="{
								name: 'Product_Detail',
								params: {
									ID: produkt.ID,
									Name: produkt.Name,
									Preis: produkt.Preis,
									Kurzbeschreibung: produkt.Kurzbeschreibung,
									Kategorie: produkt.Kategorie,
									Link3D: produkt.Link3D,
									Bewertung: produkt.Bewertung,
									Anzahl: produkt.Anzahl,
								},
							}"
							class="text-decoration-none"
						>
							<v-btn outlined text class="lime accent-3">
								Zum produkt
							</v-btn>
						</router-link>
						<v-btn outlined text class="red accent-3 ml-3" @click="warenkorbRemove(produkt)">
							Produkt löschen
						</v-btn>
					</v-card-actions>
				</v-card>
			</div>
		</v-container>
		<v-divider></v-divider>

		<v-container class="d-flex flex-wrap justify-space-around pt-4">
			<h3>Summe aller Produkte: {{ Summe_warenkorb }}€</h3>
			<v-btn @click="Bezahlen" outlined text class="lime accent-3">
				Bezahlen
			</v-btn>
		</v-container>
	</div>
	<div v-else>
		<h1 class="text-center pt-6">Es sind noch keine Produkte vorhanden</h1>
		<v-snackbar v-model="snackbar" :timeout="1000">
			Der Artikel wurde erfolgreich gelöscht
		</v-snackbar>
	</div>
</template>

<script>
import eventBus from '../eventbus';
export default {
	data() {
		return {
			Summe_warenkorb: 0,
			AnzahlImwarenkorb: this.$store.state.warenkorb.length,
			snackbar: false,
			selectAnzahl: [],
		};
	},

	created() {
		for (let index = 1; index < 100; index++) {
			this.selectAnzahl.push(index);
		}

		//Preis updaten
		this.UpdatePreis();
	},

	methods: {
		//Preisupdaten-Funktion
		UpdatePreis: function() {
			localStorage.removeItem('WarenkorbStorage');
			localStorage.setItem('WarenkorbStorage', JSON.stringify(this.$store.state.warenkorb));

			console.log('Change');
			//Preis resetten
			this.Summe_warenkorb = 0;
			//Preis neu definieren
			this.$store.state.warenkorb.forEach((element) => {
				this.Summe_warenkorb += element.Preis * element.Anzahl;
			});
		},
		//Lösch-Funktion
		warenkorbRemove: function(produktZuLöschen) {
			this.$store.state.warenkorb = this.$store.state.warenkorb.filter((element) => {
				if (element.ID != produktZuLöschen.ID) {
					return true;
				}
			});

			//Warenkorb mit LocalStorage stimmig machen
			localStorage.removeItem('WarenkorbStorage');
			localStorage.setItem('WarenkorbStorage', JSON.stringify(this.$store.state.warenkorb));

			//Preis updaten:
			this.UpdatePreis();

			//Update Badge
			eventBus.$emit('UpdateLocalStorage');
			this.snackbar = true;
		},
		Bezahlen() {
			alert('Sie werden zum Bezahlen weitergeleitet');
		},
	},
};
</script>
