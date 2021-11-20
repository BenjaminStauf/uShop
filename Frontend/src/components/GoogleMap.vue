<template>
	<div>
		<gmap-map :center="center" :zoom="10" style="width:100%;  height: 600px;">
			<gmap-marker
				:key="index"
				v-for="(gmp, index) in locations"
				:position="gmp"
				@click="center = gmp"
			></gmap-marker>
		</gmap-map>
	</div>
</template>

<script>
export default {
	name: 'DrawGoogleMap',
	data() {
		return {
			center: {
				lat: 48.211726,
				lng: 16.313175,
			},
			locations: [],
			currentLocation: null,
		};
	},

	mounted() {
		this.setLocationLatLng();
	},

	methods: {
		setPlace(loc) {
			this.currentLocation = loc;
		},
		setLocationLatLng: function() {
			navigator.geolocation.getCurrentPosition((geolocation) => {
				this.center = {
					lat: geolocation.coords.latitude,
					lng: geolocation.coords.longitude,
				};
			});

			this.locations = [
				{
					lat: 48.211726,
					lng: 16.313175,
					label: 'HTL-Wienwest',
				},
			];
		},
	},
};
</script>
