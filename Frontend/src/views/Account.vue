<template>
	<div>
		<h1 class="text-center pt-6">Account</h1>

		<v-container v-if="bereitsAngemeldet">
			
		</v-container>
	</div>
	

	
</template>
<script>
import register from '../components/Register.vue'
import login from '../components/Login.vue'
export default {
	components: [
		register, 
		login
	], 
	data() {
		return {
			bereitsAngemeldet: false, 
		}
	},
};
</script>

<style></style>
