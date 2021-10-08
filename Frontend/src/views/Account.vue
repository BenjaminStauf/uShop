<template>
	<div>
		<h1 class="text-center pt-6">Account</h1>
	</div>
</template>
<script>
export default {
	data() {
		return {
			bereitsAngemeldet: false,
		};
	},
	created() {
		console.log('Created');
		try {
			let userListe = JSON.parse(localStorage.getItem('User'));

			for (const iterator of userListe) {
				// if (iterator.bereitsAngemeldet) {
				// 	this.$router.push('Account');
				// }
				// this.$router.push('register');
			}
		} catch (error) {
			console.log('LS war leer');
			if (!this.bereitsAngemeldet) {
			this.$router.push("register")
			}
		}

	}
};
</script>

<style></style>
