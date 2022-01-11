<template>
	<div>
		<!--Überschrift + AboutUs-Text-->
		<div>
			<h1 class="text-center mt-6 mb-6">About Us</h1>
			<div class="mb-5">
				<p class="black--text px-8">
					Wir als Gründer von uShop, glauben, dass wir in paar Jahren gar keine Geschäfte mehr
					brauchen für Interior. Denn man kann sich alles gut durch die 3D-Modelle vorstellen. Das
					ist ein Grund weswegen wir uns dafür entschieden haben, anstatt von mehreren Bildern des
					Produkts, ein 3D-Modell zu verwenden. Das Team des “uShops” besteht momentan aus drei
					Mitgliedern.
				</p>
			</div>
		</div>

		<!--Team-->
		<div class="mb-9">
			<!--Team-Überschrift-->
			<h2 class="text-center mb-5">Das Team</h2>

			<!--Member-Karten-Container-->
			<div class="memberDiv">
				<!--Benjamin-->
				<v-hover v-slot="{ hover }">
					<v-card class="mx-8" color="grey lighten-4" max-width="350" height="540">
						<v-img :aspect-ratio="16 / 9" src="../assets/placeholder_portrait.png">
							<v-expand-transition>
								<div
									v-if="hover"
									class=" transition-fast-in-fast-out grey darken-3 text-p white--text"
									style="height: 100%;"
								>
									<!--Icon-->
									<div class="d-flex flex-md-row justify-center">
										<img
											width="60px"
											height="52px"
											style="margin-top: 10%"
											src="../assets/coding_icon.png"
											alt="coding-icon"
										/>
									</div>

									<!--Icon-Beschreibung-->
									<div class="mt-4">
										Programmierer
										<br />
										(Backend)
									</div>
								</div>
							</v-expand-transition>
						</v-img>
						<v-card-text class="pt-6" style="position: relative;">
							<div class="font-weight-light grey--text text-h6 mb-2">
								u-Shop-Founder
							</div>
							<h3 class="text-h4 font-weight-light orange--text mb-2">
								Benjamin Stauf
							</h3>
							<div class="font-weight-light text-h6 mb-2">
								<p class="beschreibungsText">
									War für den vollständigen Aufbau des Servers zuständig.
									<br />
									Hat auch bei Einzelheitem im Frontend mitgeholfen.
									<br />
									Zusammen mit Lukas Semler hat dieser die MySQL-Datenbank erstellt.
								</p>
							</div>
						</v-card-text>
					</v-card>
				</v-hover>
				<!--Lukas-->
				<v-hover v-slot="{ hover }">
					<v-card class="mx-8" color="grey lighten-4" max-width="350" height="540">
						<v-img :aspect-ratio="16 / 9" src="../assets/placeholder_portrait.png">
							<v-expand-transition>
								<div
									v-if="hover"
									class=" transition-fast-in-fast-out grey darken-3 text-p white--text"
									style="height: 100%;"
								>
									<!--Icon-->
									<div class="d-flex flex-md-row justify-center">
										<img
											width="60px"
											height="52px"
											style="margin-top: 10%"
											src="../assets/coding_icon.png"
											alt="coding-icon"
										/>
									</div>

									<!--Icon-Beschreibung-->
									<div class="mt-4">
										Programmierer
										<br />
										(Frontend)
									</div>
								</div>
							</v-expand-transition>
						</v-img>
						<v-card-text class="pt-6" style="position: relative;">
							<div class="font-weight-light grey--text text-h6 mb-2">
								u-Shop-Founder
							</div>
							<h3 class="text-h4 font-weight-light orange--text mb-2">
								Lukas Semler
							</h3>
							<div class="font-weight-light text-h6 mb-2">
								<p class="beschreibungsText">
									War für den vollständigen Aufbau des Frontends zuständig.
									<br />
									Hat aber auch bei Einzelheitem im Server mitgeholfen.
									<br />
									Zusätzlich hat er mit Benjamin Stauf die MySQL-Datenbank erstellt.
								</p>
							</div>
						</v-card-text>
					</v-card>
				</v-hover>
				<!--Dani-->
				<v-hover v-slot="{ hover }">
					<v-card class="mx-8" color="grey lighten-4" max-width="350" height="540">
						<v-img :aspect-ratio="16 / 9" src="../assets/placeholder_portrait.png">
							<v-expand-transition>
								<div
									v-if="hover"
									class=" transition-fast-in-fast-out grey darken-3 text-p white--text"
									style="height: 100%;"
								>
									<!--Icon-->
									<div class="d-flex flex-md-row justify-center">
										<img
											width="60px"
											height="52px"
											style="margin-top: 10%"
											src="../assets/design_icon.png"
											alt="design-icon"
										/>
									</div>

									<!--Icon-Beschreibung-->
									<div class="mt-4">
										Design
										<br />
										&
										<br />
										Marketing
									</div>
								</div>
							</v-expand-transition>
						</v-img>
						<v-card-text class="pt-6" style="position: relative;">
							<div class="font-weight-light grey--text text-h6 mb-2">
								u-Shop-Member
							</div>
							<h3 class="text-h4 font-weight-light orange--text mb-2">
								Dani Jaber
							</h3>
							<div class="font-weight-light text-h6 mb-2">
								<p class="beschreibungsText">
									Sehr wichtige Rolle im Thema Administration/Organisation. <br />
									Des weiteren hat Dani Jaber das Design entworfen und mehrmals überarbeitet. <br />
									Eine weitere Wichtige Aufgabe war es, die Produkte sowie ihre 3D-Modelle zu
									bearbeiten.
								</p>
							</div>
						</v-card-text>
					</v-card>
				</v-hover>
			</div>
		</div>

		<!--GoogleMaps-Karte-->
		<v-container>
			<GoogleMap />
		</v-container>
	</div>
</template>

<script>
import GoogleMap from '../components/GoogleMap.vue';

export default {
	name: 'AboutUs',
	components: {
		GoogleMap,
	},
};
</script>

<style scoped>
body {
	display: flex;
	justify-content: center;
	flex-direction: column;
	flex-wrap: wrap;
}
.memberDiv {
	display: flex;
	justify-content: center;
	flex-direction: row;
	margin-bottom: -5%;
	flex-wrap: wrap;
}
.memberDiv > * {
	margin-bottom: 5%;
}
div {
	text-align: center;
}
.beschreibungsText {
	font-size: 85%;
}
</style>
