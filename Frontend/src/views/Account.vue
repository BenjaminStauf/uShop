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
		console.log("Created");
		let userListe = JSON.parse(localStorage.getItem('User'));

		for (const iterator of userListe) {
			if (iterator.bereitsAngemeldet) {
				this.bereitsAngemeldet = true;
				this.$router.push('Account');
			}
			this.$router.push('register');
		}
		// if (!this.bereitsAngemeldet) {
		// 	this.$router.push("register")

		// }
	},
};
</script>

<style></style>
