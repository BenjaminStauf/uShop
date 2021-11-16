<template>
	<div>
		<div v-if="this.aktiverUser">
			<v-col class="text-right">
				<v-btn outlined text class="red accent-3 justify-right" @click="abmelden">
					Abmelden
				</v-btn>
				<v-btn v-if="this.aktiverUser.IsAdmin == true" @click="adminPanel">
					Zum Admin Panel
				</v-btn>
			</v-col>

			<h1 class="text-center pt-6">Account</h1>
			<h2 class="text-center pt-6">
				Guten Tag {{ aktiverUser.Vorname }} {{ this.aktiverUser.Nachname }}
			</h2>
		</div>
    <ul v-for="bestellung of bestellungen" :key='bestellung.Anzahl'>
      <li>{{bestellung.Name}} | {{bestellung.Preis}}EUR | Anzahl: {{bestellung.Anzahl}}</li>
    </ul>
	</div>
</template>
<script>
import axios from 'axios';
export default {
	data() {
		return {
			aktiverUser: {},
      bestellungen: [], 
		};
	},
	async mounted() {
		//Überprüfen für richtige Weiterleitung
		if ((await localStorage.getItem('LoggedInKunde')) != undefined) {
			//Wenn ein kunde angemeldet ist, diesen als aktiven User festlegen
			//Aktiven user hier im Account festlegen
			this.aktiverUser = JSON.parse(localStorage.getItem('LoggedInKunde'));
			//Aktiven User im Store speichern
			this.$store.state.aktiverUser = this.aktiverUser;
			console.log(this.aktiverUser);

			//Daten von DB holen (Bestellhistorie)
			const post = await axios.post('http://localhost:2410/getOrders', {
				KundenID: this.aktiverUser.Kunden_ID,
			});
			console.log(post.data);
      this.bestellungen = post.data

      
		} else {
			console.log('Kein Kunde im Localstorage');
			//Wenn kein Kunde angemeldet ist
			if ((await localStorage.getItem('EverReg')) != undefined) {
				this.$router.push('login');
			} else {
				this.$router.push('register');
			}
		}
	},
	methods: {
		async abmelden() {
			console.log('Abmelden clicked');
			//Server abmeldung holen
			await axios.get('http://localhost:2410/KundeLogout');
			//Eingeloggten aus Localstorage entfernen
			localStorage.removeItem('LoggedInKunde');
			//Seiten reload
			location.reload();
		},
		adminPanel() {
			this.$router.push('AdminPanel');
		},
	},
};
</script>
