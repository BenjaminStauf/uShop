<template>
	<div v-if="this.$store.state.Warenkorb.length">
		<div v-for="produkte in $store.state.Warenkorb" :key="produkte.ID" >
			<v-card outlined max-width="500px">
				<v-list-item three-line>
					<v-list-item-content>
						<v-list-item-title class="text-h5 mb-1">
							{{ produkte.ID }} {{ produkte.Name }} {{ produkte.Link3D }}
						</v-list-item-title>
						<v-list-item-subtitle>{{ produkte.Kurzbeschreibung }}</v-list-item-subtitle>
					</v-list-item-content>

					<v-list-item-avatar tile size="100" color="grey"></v-list-item-avatar>
				</v-list-item>

				<v-card-actions>
					<router-link
						:to="{
							name: 'Product_Detail',
							params: {
								ID: produkte.ID,
								Name: produkte.Name,
								Preis: produkte.Preis,
								Kurzbeschreibung: produkte.Kurzbeschreibung,
								Kategorie: produkte.Kategorie,
								Link3D: produkte.Link3D,
							},
						}"
						class="text-decoration-none"
					>
						<v-btn outlined text class="lime accent-3">
							Zum produkt
						</v-btn>
					</router-link>
				</v-card-actions>
			</v-card>
		</div>
	</div>
  <div v-else>
    <h1>Es sind noch keine Produkte vorhanden</h1>
  </div>
</template>

<script>
export default {
	created() {
		console.log('Created wurde aufgerufen');
		console.log(JSON.parse(localStorage.getItem('test') || '[]'));

		this.$store.state.Warenkorb = JSON.parse(localStorage.getItem('test') || '[]');
	},
};
</script>

<style></style>
