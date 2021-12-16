<template>
	<v-container>
		<v-card color="grey darken-3" dark>
			<v-card-title class="mb-4">
				<v-row class="ml-2 mt-1" align="center">
					<v-icon large>mdi-account</v-icon>
					<h2 class="ml-2">Vorname + Nachname</h2>
				</v-row>
			</v-card-title>

			<v-card-subtitle class="ml-2 mt-1">
				<h3 class="orange--text text--darken-2">Titel der Bewertung</h3>
				<v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>
			</v-card-subtitle>

			<v-card-text class="ml-2">
				<p class="white--text">
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
					invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
					accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
					sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
					elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
					diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
					gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
				</p>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
export default {
	name: 'Bewertung',
};
</script>

<style></style>
