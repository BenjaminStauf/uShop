<template>
	<div>
		<h1 class="text-center pt-6">Account</h1>
		<!-- <h2 class="text-center pt-6">{{aktiverUser.Vorname}}</h2> -->
	</div>
</template>
<script>
export default {
	data() {
		return {
			// bereitsAngemeldet: false,
			aktiverUser: '',
		};
	},
	created() {
		
			let userListe = localStorage.getItem('User');
			console.log(`Account userListe: ${userListe}`);
			for (const iterator of userListe) {
				if (iterator.bereitsAngemeldet == true) {
					this.aktiverUser = iterator;
					console.log(`Aktiver User: ${aktiverUser}`);
				} else this.$router.push('register');
			}
		
		
	},
};
</script>

<style></style>
