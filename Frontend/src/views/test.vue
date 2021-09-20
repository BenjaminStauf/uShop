<template>
  <div>
    <h1 style="text-align: center">Test-Site</h1>
    <br /><br /><br />
    <div style="display: flex; justify-content: space-around; flex-direction:row; flex-wrap: wrap">
      <Card _Name="Produkt-Titel" _Preis="450.00"/>
    </div>
  </div>
</template>

<script>
name: 'test';
import Card from '../components/Card_C.vue';

export default {
  components: {
    Card,
  },

  data() {
    return {};
  },
};
</script>