<template>
  <v-card outlined width="350px" class="ma-4">
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5 mb-1">
          {{ produkte.ID }} {{ produkte.Name }} {{ produkte.Link3D }}
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
</template>

<script>
export default {};
</script>

<style></style>
