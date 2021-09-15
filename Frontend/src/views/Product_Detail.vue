<template>
	<div>
		<h1>
			{{ ID }} | {{ Name }} | {{ Preis }}€ | {{ Kurzbeschreibung }} | {{ Kategorie }} |
			{{ Link3D }}
		</h1>
		<router-link :to="{ name: 'Shop' }" class="text-decoration-none">
			<v-btn outlined text class="lime accent-3">Zurück zu den Produkten</v-btn>
		</router-link>
		<br />
		<br />
		<v-btn
			outlined
			text
			class="lime accent-3"
			@click="AddBasket(ID, Name, Preis, Kurzbeschreibung, Kategorie, Link3D)"
			>Zum Warenkorb hinzufügen</v-btn
		>
	</div>
</template>

<script>
export default {
	data() {
		return {
			ID: this.$route.params.ID,
			Name: this.$route.params.Name,
			Preis: this.$route.params.Preis,
			Kurzbeschreibung: this.$route.params.Kurzbeschreibung,
			Kategorie: this.$route.params.Kategorie,
			Link3D: this.$route.params.Link3D,
		};
	},
	methods: {
		AddBasket(ID, Name, Preis, Kurzbeschreibung, Kategorie, Link3D) {
			this.$store.state.Warenkorb.push({
				ID: ID,
				Name: Name,
				Preis: Preis,
				Kurzbeschreibung: Kurzbeschreibung,
				Kategorie: Kategorie,
				Link3D: Link3D,
			});
			localStorage.setItem('test', JSON.stringify(this.$store.state.Warenkorb));
			alert(`Der Artikel ${Name} wurde zum Warenkorb hinzugefügt`);

            console.table(this.$store.state.Warenkorb)
		},
	},
};
</script>

<style></style>
