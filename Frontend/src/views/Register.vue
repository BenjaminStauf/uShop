<template>
	<div>
		<h1 class="text-center">Register</h1>
		<h3 class="text-center pt-6">
			Willkommen, wenn Sie noch kein Konto haben können sie hier kostelos eines erstellen.
		</h3>
		<br />
		<br />
		<v-form>
			<v-container class="d-flex flex-wrap justify-space-around">
				<!--Vor-Nachname- Inputs-->
				<v-row>
					<v-col md="1"></v-col>
					<v-col md="10">
						<!--MeinSpalte wo Inputs liegen-->
						<v-row class="justify-center">
							<v-col md="4">
								<v-text-field
									label="Vorname"
									v-model="Vorname"
									:rules="rules.NormalRules"
									hide-details="auto"
								/>
							</v-col>
							<v-col md="1"></v-col>
							<v-col md="4">
								<v-text-field
									label="Nachname"
									v-model="Nachname"
									:rules="rules.NormalRules"
									hide-details="auto"
								/>
							</v-col>
						</v-row>
						<!--Email Input-->
						<v-row class="justify-center">
							<v-col md="9">
								<v-text-field
									label="E-Mail"
									v-model="Email"
									:rules="rules.EmailRules"
									hide-details="auto"
								/>
							</v-col>
						</v-row>
						<!--Passwort-->
						<v-row class="justify-center">
							<v-col md="4">
								<v-text-field
									:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
									:rules="rules.NormalRules"
									:type="show ? 'text' : 'password'"
									name="input-10-1"
									label="Passwort"
									v-model="Passwort1"
									@click:append="show = !show"
								/>
							</v-col>
							<v-col md="1"></v-col>
							<v-col md="4"
								><v-text-field
									:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
									:rules="rules.NormalRules"
									:type="show ? 'text' : 'password'"
									name="input-10-1"
									label="Passwort"
									v-model="Passwort2"
									@click:append="show = !show"
								/>
							</v-col>
						</v-row>
						<!--Adresse-->
						<v-row class="justify-center">
							<v-col md="4">
								<v-text-field
									label="Straße + Hausnr"
									v-model="Strasse"
									:rules="rules.NormalRules"
									hide-details="auto"
								/>
							</v-col>
							<v-col md="1">
								<v-text-field
									label="PLZ"
									v-model="Plz"
									:rules="rules.NormalRules"
									hide-details="auto"
								/>
							</v-col>
							<v-col md="4">
								<v-text-field
									label="Ort"
									v-model="Ort"
									:rules="rules.NormalRules"
									hide-details="auto"
								/>
							</v-col>
						</v-row>
						<!--Submit-Bttn-->
						<v-row>
							<v-col md="5"></v-col>
							<v-col md="2">
								<v-btn @click="Submitted">
									Register
								</v-btn>
							</v-col>
							<v-col md="5"></v-col>
						</v-row>
					</v-col>
					<v-col md="1"></v-col>
				</v-row>
			</v-container>
		</v-form>
		<br />
		<br />
		<router-link class="black--text text-decoration-none" :to="{ name: 'Login' }"
			><p class="black--text text-center">
				Wenn sie bereits einen Account haben, können Sie sich hier anmelden: <span>Login</span>
			</p>
		</router-link>
	</div>
</template>

<script>
export default {
	data() {
		return {
			//Inputvariablen
			Vorname: '',
			Nachname: '',
			Email: '',
			Passwort1: '',
			Passwort2: '',
			Strasse: '',
			Plz: '',
			Ort: '',
			userArray: [],

			//Variablen
			show: false,
			//Anorderungen an die Inputs
			rules: {
				NormalRules: [(value) => !!value || 'Required.'],
				EmailRules: [
					(value) => !!value || 'Required.',
					(value) => {
						const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						return pattern.test(value) || 'Invalid e-mail.';
					},
				],
			},
		};
	},
	mounted() {
		this.userArray = JSON.parse(localStorage.getItem('User'));
		 console.log(this.userArray);
	},
	methods: {
		Submitted() {
			//Beide Passwörter vergleichen
			if (this.Passwort1 == this.Passwort2) {
				let newUser = {
					Vorname: this.Vorname,
					Nachname: this.Nachname,
					Email: this.Email,
					Passwort: this.Passwort1,
					Strasse: this.Strasse,
					Plz: this.Plz,
					Ort: this.Ort,
					bereitsAngemeldet: true,
				};

				this.Vorname = '';
				this.Nachname = '';
				this.Email = '';
				this.Strasse = '';
				this.Passwort1 = '';
				this.Passwort2 = '';
				this.Plz = '';
				this.Ort = '';

				this.userArray.push(newUser);

				localStorage.removeItem('User');
				localStorage.setItem('User', JSON.stringify(this.userArray));
			}
		},
	},
};
</script>

<style>
span {
	color: rgb(9, 156, 9);
	font-weight: bold;
}
</style>
