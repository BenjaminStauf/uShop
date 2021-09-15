<template>
	<div>
		<h1 class="black--text center text-center pt-4">
			<span class="black--text display-3">u</span
			><span class="cyan--text accent-2 display-3 ">SHOP</span>
		</h1>
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

		<div v-for="produkte in $store.state.produkte" :key="produkte.ID">
			<v-container color="lime">
				<v-row color="lime">
					<v-col>
						<v-card outlined max-width="500px">
							<v-list-item three-line>
								<v-list-item-content>
									<v-list-item-title class="text-h5 mb-1">
										{{produkte.ID}} {{ produkte.Name }} {{produkte.Link3D}}
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
					</v-col>
				</v-row>
			</v-container>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Shop',
};
</script>
