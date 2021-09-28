<template>
	<div>
		<!--Überschrift-->
		<h1 class="black--text center text-center pt-4">
			<span class="black--text display-3">u</span
			><span class="cyan--text accent-2 display-3 ">SHOP</span>
		</h1>

		<!--Webseiten-Beschreibung-->
		<p class="black--text pl-6 pr-6 pt-6">
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt atque sequi, dignissimos veniam
			quo illo maxime, iste culpa non consectetur recusandae. Delectus fugit pariatur quasi
			accusamus cupiditate ipsam nostrum autem laborum incidunt sed temporibus et vel odit eius
			laboriosam quo mollitia, eaque laudantium officiis architecto voluptatibus recusandae? Nostrum
			repellendus mollitia corrupti, esse maiores porro cum adipisci fugit perspiciatis consectetur.
			Accusantium cupiditate voluptatum error debitis nostrum et ipsum quas sequi, animi numquam
			optio culpa voluptate possimus impedit laborum minima molestias iusto vero tempora nesciunt
			eius accusamus. Nostrum, dolore, optio, nisi aspernatur quos porro rerum iure repellendus
			voluptate architecto eius illo ipsam.
		</p>

		<!-- Filter -->
		<v-icon class="black--text ml-6" @click="ToggleFilter()">mdi-filter</v-icon>
		<v-container align="center" v-if="filterShow">
			<v-row justify="center">
				<ul v-for="Kategorie in $store.state.Kategorien" :key="Kategorie.ID">
					<v-checkbox
						color="cyan darken-2 "
						v-bind:label="Kategorie.Name"
						v-bind:value="Kategorie.Name"
						v-model="selected"
					></v-checkbox>
				</ul>
			</v-row>
		</v-container>
		<!-- Produkte anzeigen: -->

		<!-- Wenn kein Filter gesetzt ist, werden alle angezeigt -->
		<div v-if="selected.length == 0">
			<v-container class="d-flex flex-wrap justify-space-around justify-center align-center">
				<div v-for="produkte in $store.state.produkte" :key="produkte.ID">
					<!-- Filter -->

					<!-- <div v-if="selected.includes(produkte.Kategorie)"> -->
					<v-card outlined width="350px" class="ma-4">
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
										ID: produkte.ProduktID,
										Name: produkte.Name,
										Preis: produkte.Preis,
										Kurzbeschreibung: produkte.Kurzbeschreibung,
										Kategorie: produkte.Kategorie,
										Link3D: produkte.Link3D,
										Berwertung: produkte.Berwertung
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
				<!-- </div> -->
			</v-container>
		</div>

		<!-- Wenn ein Filter gesetzt ist, werden nur diese Angezeigt -->
		<div v-else>
			<v-container class="d-flex flex-wrap justify-space-around justify-center">
				<div v-for="produkte in $store.state.produkte" :key="produkte.ID">
					<!-- Filter -->
					<div v-if="selected.includes(produkte.Kategorie)">
						<v-card outlined width="350px" class="ma-4">
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
											Berwertung: produkte.Berwertung

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
			</v-container>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Shop',
	data() {
		return {
			name: 'Test',
			selected: [],
			filterShow: false,

		};
	},
	methods: {
		ToggleFilter() {
			this.filterShow = !this.filterShow;
		},
	},
};
</script>
