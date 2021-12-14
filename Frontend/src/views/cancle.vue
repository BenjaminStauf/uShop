<template>
	<v-container>
		<h1 class=" red--text text-center mt-3">Da ist wohl etwas schiefgelaufen !</h1>
		<h3 class="text-center">Bei Ihrer Bestellung ist ein Fehler aufgetreten</h3>
		<v-row align="center" justify="center" class="mt-6">
			<router-link class="text-decoration-none" :to="{ name: 'Shop' }">
				<v-btn dark>Home</v-btn>
			</router-link>
		</v-row>
	</v-container>
</template>

<script>
export default {};
</script>

<style></style>
