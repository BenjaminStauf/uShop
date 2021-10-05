<template>
	<div>
		<h1 class="black--text text-center">Login</h1>

		<v-form>
			<!-- <v-container>
				<v-row class="justify-center">
					<v-col cols="12" sm="12">
						<v-text-field v-model="email" label="Email" clearable></v-text-field>
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
					<v-btn>Submit</v-btn>
				</v-row>
			</v-container> -->
		</v-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			passwort: '',
			show1: false,
			rules: {
				required: (value) => !!value || 'Required.',
			},
		};
	},
	created() {},
};
</script>

<style></style>
