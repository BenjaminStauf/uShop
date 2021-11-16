<template>
	<div>
		<!--Passwort vergessen-->
		<div v-if="showPasswortVergessen" class="PasswortVergessenDiv">
			<!--Auth-Code überprüfung-->
			<h1 style="text-align:center;">
				Geben Sie Ihre Email von ihrem Account ein, damit wir Ihnen ein neues Passwort schicken
				können.
			</h1>
			<v-form :disable="showPasswortVergessen">
				<v-container>
					<v-row>
						<v-col md="2"></v-col>
						<v-col md="10"
							><v-text-field
								style="width: 80%"
								type="text"
								v-model="inputPW"
								:rules="rules.EmailRules"
							></v-text-field>
						</v-col>
						<v-col></v-col>
					</v-row>

					<v-row>
						<v-col></v-col>
						<v-col>
							<v-btn color="#424242" dark @click="sendNewPW">
								Senden
							</v-btn>
						</v-col>
						<v-col></v-col>
					</v-row>
				</v-container>
			</v-form>
		</div>

		<!--LoginScreen-->
		<div v-bind:class="showPasswortVergessen ? 'BackgroundUnscharf' : 'BackgroundScharf'">
			<h1 class="black--text text-center">Login</h1>

			<v-form ref="submit" lazy-validation :disabled="showPasswortVergessen">
				<v-container>
					<v-row class="justify-center">
						<v-col md="1"></v-col>
						<v-col md="10">
							<!--Email-->
							<v-row>
								<v-col sm="3"></v-col>
								<v-col>
									<v-text-field
										v-model="email"
										label="Email"
										clearable
										required
										:rules="rules.EmailRules"
									></v-text-field>
								</v-col>
								<v-col sm="3"></v-col>
							</v-row>
							<!--Passwort-->
							<v-row>
								<v-col sm="3"></v-col>
								<v-col>
									<v-text-field
										v-model="password"
										:append-icon="showPasswordInput ? 'mdi-eye' : 'mdi-eye-off'"
										:rules="rules.required"
										:type="showPasswordInput ? 'text' : 'password'"
										label="Passwort"
										@click:append="showPasswordInput = !showPasswordInput"
										:tabindex="-1"
									></v-text-field>
									<p
										class="black--text text-decoration-underline"
										@click="showPasswortVergessen = true"
									>
										Passwort vergessen ?
									</p>
								</v-col>
								<v-col sm="3"></v-col>
							</v-row>
							<!--Submit-->
							<v-row>
								<v-col sm="5"></v-col>
								<v-col sm="1">
									<v-btn type="submit" @click="submit">Einloggen</v-btn>
								</v-col>
								<v-col sm="3"></v-col>
							</v-row>

							<!--Register weiterleiten-->
							<br />
							<br />
							<v-row>
								<v-col md="3"></v-col>
								<v-col md="3">
									<router-link class="black--text text-decoration-none" :to="{ name: 'Register' }"
										><p>Zurück zum <span>Registrieren</span></p>
									</router-link>
								</v-col>
								<v-col md="10"></v-col>
							</v-row>
						</v-col>
						<v-col md="1"></v-col>
					</v-row>
				</v-container>
			</v-form>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			email: '',
			password: '',
			showPasswordInput: false,
			showPasswortVergessen: false,
			inputPW: '',

			rules: {
				required: [(val) => (val || '').length > 0 || 'This field is required'],
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
	methods: {
		async sendNewPW() {
			alert('Click');
			const res = await axios.post('http://localhost:2410/newPW', { email: this.inputPW });
			console.log(`Email wurde an: ${this.inputPW} gesendet`);
			setTimeout(() => (this.showPasswortVergessen = false), 2000);
		},
		ClearInputs() {
			this.email = '';
			this.password = '';
		},

		async submit() {
			//Anfrage auf den Server, um sich einzuloggen
			let res = await axios.post('http://localhost:2410/KundenLogin', {
				Email: this.email,
				Passwort: this.password,
			});

			//Inputs leeren
			this.ClearInputs();
			//Eingeloggten Kunden setzen
			await localStorage.setItem('LoggedInKunde', JSON.stringify(res.data.FoundUser));
			await localStorage.setItem('EverReg', true);
			//Zur Account seite weiterleiten, die alles dann Managed
			this.$router.push('account');
		},
	},
};
</script>

<style>
span {
	color: rgb(9, 156, 9);
	font-weight: bold;
}

.PasswortVergessenDiv {
	display: block;
	margin-left: auto;
	margin-right: auto;
	z-index: 2;
	width: 30%;
	height: 15%;
	background: white;
	border-radius: 45px;
	padding-top: 15%;
}

.BackgroundUnscharf {
	filter: blur(10px);
}
.BackgroundScharf {
	filter: none;
}
</style>
