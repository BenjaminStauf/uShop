<template>
	<div v-if="this.$store.state.Warenkorb.length">
		<h1 class="text-center pt-6 pb-6">Produkte im Warenkorb</h1>
		<v-container class="d-flex flex-wrap justify-space-around">
			<div v-for="produkte in $store.state.Warenkorb" :key="produkte.ID">
				<v-card outlined max-width="500px" class="ma-4">
					<v-list-item three-line>
						<v-list-item-content>
							<v-list-item-title class="text-h5 mb-1">
								{{ produkte.ID }} {{ produkte.Name }} {{ produkte.Link3D }}
							</v-list-item-title>
							<v-list-item-subtitle>{{ produkte.Kurzbeschreibung }}</v-list-item-subtitle>
						</v-list-item-content>

						<v-list-item-avatar tile size="100" color="grey"></v-list-item-avatar>
					</v-list-item>

					<v-card-actions>
						<router-link
							:to="{
								name: 'Product_Detail',
								params: {
									ID: produkte.ID,
									Name: produkte.Name,
									Preis: produkte.Preis,
									Kurzbeschreibung: produkte.Kurzbeschreibung,
									Kategorie: produkte.Kategorie,
									Link3D: produkte.Link3D,
								},
							}"
							class="text-decoration-none"
						>
							<v-btn outlined text class="lime accent-3">
								Zum produkt
							</v-btn>
						</router-link>
						<v-btn outlined text class="red accent-3 ml-3" @click="WarenkorbRemove(produkte.ID)">
							Produkt löschen
						</v-btn>
					</v-card-actions>
				</v-card>
			</div>
		</v-container>
		<v-divider></v-divider>

		<v-container class="d-flex flex-wrap justify-space-around pt-4">
			<h3>Summe aller Produkte: {{ Summe_Warenkorb }}€</h3>
			<v-btn @click="Bezahlen()" outlined text class="lime accent-3">
				Bezahlen
			</v-btn>
		</v-container>
	</div>
	<div v-else>
		<h1 class="text-center pt-6">Es sind noch keine Produkte vorhanden</h1>
		<v-snackbar v-model="snackbar" :timeout="timeout">{{ text }}</v-snackbar>
	</div>
</template>

<script>
import eventBus from '../eventbus';
export default {
	data() {
		return {
			Summe_Warenkorb: 0,
			test: [],
			AnzahlImWarenkorb: this.$store.state.Warenkorb.length,
			snackbar: false,
			text: `Der Artikel wurde erfolgreich gelöscht`,
			timeout: 1000,
		};
	},
	created() {
		this.$store.state.Warenkorb = JSON.parse(localStorage.getItem('test') || '[]');

		this.$store.state.Warenkorb.forEach((element) => {
			this.Summe_Warenkorb += element.Preis;
		});
	},
	methods: {
		WarenkorbRemove(produktZuLöschen) {
			this.$store.state.Warenkorb = this.$store.state.Warenkorb.filter(
				(produkt) => produkt.ID !== produktZuLöschen,
			);
			//Local Storage Clearen
			localStorage.clear();
			//Local Storage neu befüllen
			localStorage.setItem('test', JSON.stringify(this.$store.state.Warenkorb));

			//Preis updaten:
			this.Summe_Warenkorb = 0;
			this.$store.state.Warenkorb.forEach((element) => {
				this.Summe_Warenkorb += element.Preis;
			});

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

<style></style>
