<template>
	<div>
		<v-col class="text-right">
			<v-btn outlined text class="red accent-3 justify-right" @click="abmelden">
				Abmelden
			</v-btn>
		</v-col>

		<h1 class="text-center pt-6">Account</h1>
		<h2 class="text-center pt-6">{{ aktiverUser.Vorname }}</h2>
	</div>
</template>
<script>
export default {
	data() {
		return {
			// bereitsAngemeldet: false,
			aktiverUser: {},
			userListe: [],
		};
	},
	created() {
		if (localStorage.getItem('User') != null) {
			this.userListe = JSON.parse(localStorage.getItem('User'));

			for (const iterator of this.userListe) {
				if (iterator.bereitsAngemeldet == true) {
					console.log(`Iterator: ${iterator}`);
					this.aktiverUser = iterator;
					console.log(`Aktiver User: ${this.aktiverUser}`);
				}
				else{
					// this.$router.push("Login")
				}
			}
		} else {
			this.$router.push('register');
		}
	},
	methods: {
		abmelden(){
			for (const iterator of this.userListe) {
				if (iterator.bereitsAngemeldet == true) {
					iterator.bereitsAngemeldet = false
				}
			}
			console.log(this.userListe);
			localStorage.removeItem('User')
			localStorage.setItem('User', JSON.stringify(this.userListe))
			this.$router.push("Login")
		}
	},
};
</script>

<style></style>
