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

		<!-- Filter Kategorie-->
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

		<!-- Filter search -->
		<v-icon class="black--text ml-6" @click="ToggleSearch()">mdi-magnify</v-icon>
		<v-container class="justify-center" v-if="searchShow">
			<v-col cols="4" class="pt-4 justify-center">
				<v-row class="justify-center">
					<v-text-field label="Suchen" solo v-model="pattern"></v-text-field>
				</v-row>
			</v-col>
		</v-container>

		<!--Produkte anzeigen-->
		<div>
			<v-container class="d-flex flex-wrap justify-space-around justify-center align-center">
				<div v-for="produkt in filterProducts" :key="produkt.ProduktID">
					<router-link
						:to="{
							name: 'Product_Detail',
							params: {
								ID: produkt.ProduktID,
								Name: produkt.Name,
								Preis: produkt.Preis,
								Kurzbeschreibung: produkt.Kurzbeschreibung,
								Kategorie: produkt.Kategorie,
								Link3D: produkt.Link3D,
								Bewertung: produkt.Bewertung,
							},
						}"
					>
						<Card :_productObj="produkt" />
					</router-link>
				</div>
			</v-container>
		</div>
	</div>
</template>

<script>
import Card from '../components/Card.vue';

export default {
	name: 'Shop',

	components: {
		Card,
	},
	data() {
		return {
			name: 'Test',
			selected: [],
			filterShow: false,
			searchShow: false,
			pattern: '',
		};
	},
	methods: {
		ToggleFilter() {
			this.filterShow = !this.filterShow;
		},
		ToggleSearch() {
			this.searchShow = !this.searchShow;
		},
	},
	created() {
		//Letztes Item aus dem LocalStorage löschen
		localStorage.removeItem('LastObj');
	},
	computed: {
		changeProducts() {
			let selected = this.selected;
			let returnArray;
			if (selected.length == 0) {
				returnArray = this.$store.state.produkte;
			} else {
				returnArray = this.$store.state.produkte.filter((element) => {
					if (selected.includes(element.Kategorie)) {
						return element;
					}
				});
			}

			return returnArray;
		},
		filterProducts() {
			let array = this.$store.state.produkte;
			let pattern = this.pattern;
			let filter = new RegExp(pattern, 'i');
			let nameArray = [];
			let returnArray = [];
			let echtesReturnArray = [];

			if (pattern.length != 0) {
				//Schreibt alle Produktnamen in ein Array
				for (const iterator of array) {
					nameArray.push(iterator.Name);
				}

				//Fügt alle Produktnamen die mit dem SearchString matchen in ein Array
				nameArray.forEach((elem) => {
					if (elem.match(filter)) {
						returnArray.push(elem);
					}
				});

				//Such zu den Namen in dem Array wo alle gematchten Namen drinstehen das passende Objekt und fügt es in ein Array welches dann returnt wird
				array.filter((elem) => {
					if (returnArray.includes(elem.Name)) {
						console.log('True');
						echtesReturnArray.push(elem);
					}
				});

				return echtesReturnArray;
			} else {
				console.log('else');
				return array;
			}
		},
	},
};
</script>
