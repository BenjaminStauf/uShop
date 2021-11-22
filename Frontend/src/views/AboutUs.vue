<template>
	<div>
		<h1 class="text-center pt-6 pb-6">About Us</h1>

		<v-container>
			<p class="black--text pl-6 pr-6 pt-6">
				Wir als Gründer von uShop, glauben, dass wir in paar Jahren gar keine Geschäfte mehr
				brauchen für Interior. Denn man kann sich alles gut durch die 3D-Modelle vorstellen. Das ist
				ein Grund weswegen wir uns dafür entschieden haben, anstatt von mehreren Bildern des
				Produkts, ein 3D-Modell zu verwenden. Das Team des “uShops” besteht momentan aus drei
				Mitgliedern
			</p>
		</v-container>

		<br />
		<h2 class="text-center mt-6">Das Team</h2>

		<v-container class="d-flex flex-wrap justify-space-around mt-6 pt-6">
			<v-row justify="center">
				<v-img
					class="ml-6 mr-6"
					max-height="150"
					max-width="150"
					src="https://www.pspr.de/wp-content/uploads/2017/08/Avatar-Platzhalter.jpg"
				></v-img>
				<v-img
					class="ml-6 mr-6"
					max-height="150"
					max-width="150"
					src="https://www.pspr.de/wp-content/uploads/2017/08/Avatar-Platzhalter.jpg"
				></v-img>
				<v-img
					class="ml-6 mr-6"
					max-height="150"
					max-width="150"
					src="https://www.pspr.de/wp-content/uploads/2017/08/Avatar-Platzhalter.jpg"
				></v-img>
			</v-row>
			<hr />
		</v-container>
		<br />
		<v-container>
			<GoogleMap />
		</v-container>
	</div>
</template>

<script>
import GoogleMap from '../components/GoogleMap.vue';

export default {
	components: {
		GoogleMap,
	},
};
</script>

<style></style>
