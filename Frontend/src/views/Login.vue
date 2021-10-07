<template>
	<div>
		<h1 class="black--text text-center">Login</h1>

		<v-form ref="submit" lazy-validation>
			<v-container class="mt-12">
				<v-row class="justify-center">
					<v-col cols="6">
						<v-row class="justify-center">
							<v-col cols="12" sm="12">
								<v-text-field
									v-model="email"
									label="Email"
									clearable
									required
									:rules="[rules.email]"
								></v-text-field>
							</v-col>
							<v-col cols="12" sm="12">
								<v-text-field
									v-model="password"
									:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
									:rules="rules.required"
									:type="show1 ? 'text' : 'password'"
									name="input-10-1"
									label="Passwort"
									@click:append="show1 = !show1"
								></v-text-field>
							</v-col>
							<v-btn type="submit" @click="submit">Submit</v-btn>
						</v-row>
						<br>
						<router-link class="black--text text-decoration-none" :to="{name: 'Register'}"><p>Zurück zum <span>Registrieren</span></p></router-link>
					</v-col>
				</v-row>
			</v-container>
		</v-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			password: '',
			show1: false,
			rules: {
				required: [(val) => (val || '').length > 0 || 'This field is required'],
				email: (value) => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<script>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return pattern.test(value) || 'Invalid e-mail.';
				},
			},
		};
	},
	methods: {
		submit() {
			console.log('Submit');
		},
	},
};
</script>

<style>
span{
	color: rgb(9, 156, 9);
	font-weight: bold;
}
</style>
