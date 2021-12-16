<template>
	<v-container>
		<v-container>
			<v-card color="grey darken-3" dark>
				<v-card-title class="mb-4">
					<v-row class="ml-2 mt-1" align="center">
						<v-icon large>mdi-account</v-icon>
						<h2 class="ml-2">{{ bewertung_Obj.Vorname }} {{ bewertung_Obj.Nachname }}</h2>
					</v-row>
				</v-card-title>

				<v-card-subtitle class="ml-2 mt-1">
					<h3 class="orange--text text--darken-2">{{ bewertung_Obj.bewertung_titel }}</h3>
					<v-rating
						:value="bewertung_Obj.bewertung_Sterne"
						color="amber"
						dense
						half-increments
						readonly
						size="14"
					></v-rating>
				</v-card-subtitle>

				<v-card-text class="ml-2">
					<p class="white--text">
						{{ bewertung_Obj.bewertung_text }}
					</p>
				</v-card-text>
			</v-card>
		</v-container>
	</v-container>
</template>

<script>
export default {
	name: 'Bewertung',
	data() {
		return {
			bewertung_Obj: this.bewertung,
		};
	},
	props: {
		bewertung: Object,
	},
	mounted() {
		console.log(this.bewertung);
	},
};
</script>

<style></style>
