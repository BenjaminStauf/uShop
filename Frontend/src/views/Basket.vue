<template>
	<!-- Umbauen auf User von LS -->
	<div v-if="this.$store.state.warenkorb.length">
		<h1 class="text-center pt-6 pb-6">Produkte im Warenkorb</h1>
		<v-container class="d-flex flex-wrap justify-space-around">
			<div v-for="produkt in $store.state.warenkorb" :key="produkt.Name">
				<CardBasket
					:_productObj="produkt"
					@changePrice="UpdatePreis"
					@delProdukt="warenkorbRemove"
				/>
			</div>
		</v-container>
		<v-divider></v-divider>

		<v-container class="d-flex flex-wrap justify-space-around pt-4">
			<h3>Summe aller Produkte: {{ Summe_warenkorb }}€</h3>

			<v-btn
				@click="Bezahlen"
				outlined
				text
				class="orange darken-2"
				:disabled="buttonZahlenDisabled"
			>
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
import axios from 'axios';
import CardBasket from '../components/CardBasket.vue';
export default {
	components: {
		CardBasket,
	},
	data() {
		return {
			Summe_warenkorb: 0,
			AnzahlImwarenkorb: this.$store.state.warenkorb.length,
			snackbar: false,
			selectAnzahl: [],
			buttonZahlenDisabled: true,
		};
	},

	created() {
		for (let index = 1; index < 100; index++) {
			this.selectAnzahl.push(index);
		}

		//Preis updaten
		this.UpdatePreis();

		console.log(this.$store.state.aktiverUser);
		if (this.$store.state.aktiverUser != null) this.buttonZahlenDisabled = false;
	},

	methods: {
		//Preisupdaten-Funktion
		UpdatePreis() {
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
		warenkorbRemove(produktZuLöschen) {
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
		async Bezahlen() {
			// const warenkorb = this.$store.state.warenkorb;
			// warenkorb.aktiverUser = this.$store.state.aktiverUser;

			this.buttonZahlenDisabled = true;

			const sendPay = {
				warenkorb: this.$store.state.warenkorb,
				aktiveruser: this.$store.state.aktiverUser,
			};

			//Warenkorb an Backend schicken
			const resPay = await axios.post('http://localhost:2410/pay', sendPay);
			const resAddOrder = await axios.post('http://localhost:2410/addOrder', sendPay);
		},
	},
};
</script>
