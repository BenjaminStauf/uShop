<template>
	<div>
		<h1 class="text-center pt-6 pb-6">About Us</h1>

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
			<hr>
		</v-container>
		<br>
		<v-container>
			<GoogleMap />
		</v-container>
		
	</div>
</template>

<script>
import GoogleMap from '../components/GoogleMap.vue'

export default {
	components: {
		GoogleMap
	}
};
</script>

<style></style>
