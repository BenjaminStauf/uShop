<template>
	<div>
		<h1 class="text-center pt-6">Account</h1>
		
	</div>
	

	
</template>
<script>

export default {
	data() {
		return {
			bereitsAngemeldet: false, 
		}
	},
	created(){
		if (!this.bereitsAngemeldet) {
			this.$router.push("register")
			
		}
	}
};
</script>

<style></style>
