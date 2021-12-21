<template>
  <div>
    <h1 class="black--text text-center">Admin Panel</h1>

    <v-container fluid class="pl-6 pr-6">
      <v-data-table :headers="headers" :items="produkte" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Admin Panel</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                  New Item
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.Name" label="Name"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.Preis" label="Preis"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <!-- <v-text-field
													v-model="editedItem.Kategorie"
													label="Kategorie"
												></v-text-field> -->
                        <v-select
                          :items="kategorien"
                          label="Kategorie"
                          dense
                          solo
                          v-model="editedItem.Kategorie"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <!-- <v-text-field
													v-model="editedItem.Bewertung"
													label="Bewertung"
												></v-text-field> -->
                        <v-select
                          :items="bewertung"
                          label="Bewertung"
                          dense
                          solo
                          v-model="editedItem.Bewertung"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.Kurzbeschreibung"
                          label="Kurzbeschreibung"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Account',
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
    },
  },
  data() {
    return {
      serverAdress: process.env.VUE_APP_SERVER_ADRESS,
      produkte: [],
      kategorien: this.$store.state.Kategorien,
      bewertung: [1, 2, 3, 4, 5],

      headers: [
        { text: 'Name', value: 'Name', sortable: false },
        { text: 'Preis', value: 'Preis', sortable: false },
        { text: 'Kategorie', value: 'Kategorie', sortable: false },
        { text: 'Bewertung (1 - 5)', value: 'Bewertung', sortable: false },
        { text: 'Kurzbeschreibung', value: 'Kurzbeschreibung', sortable: false },
        { text: 'actions', value: 'actions', sortable: false },
      ],
      dialog: false,
      dialogDelete: false,
      editedItem: {
        Name: '',
        Preis: 0,
        Kategorie: '',
        Bewertung: 0,
        Kurzbeschreibung: '',
      },
      defaultItem: {
        Name: '',
        Preis: 0,
        Kategorie: '',
        Bewertung: 0,
        Kurzbeschreibung: '',
      },
    };
  },
  methods: {
    test() {
      alert('test');
    },

    editItem(item) {
      this.editedIndex = this.produkte.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // console.log(`Neues Item: ${this.editedItem.Preis}`)
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.produkte.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.produkte.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        //Todo Axios delete:

        this.editedIndex = -1;
      });

      const res = await axios.post(`${this.serverAdress}/DeleteProduct`, this.editedItem);
    },

    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.produkte[this.editedIndex], this.editedItem);
        // Todo axios Update
        const res = await axios.post(
          `${this.serverAdress}/UpdateProduct`,
          this.produkte[this.editedIndex],
        );
      } else {
        console.log('else');
        this.produkte.push(this.editedItem);
        //Todo Axios Add
        const res = await axios.post(`${this.serverAdress}/AddProduct`, this.editedItem);
      }
      this.close();
    },
  },
  mounted() {
    this.produkte = this.$store.state.produkte;

    let kategorienState = this.$store.state.Kategorien;
    console.log(kategorienState);
    this.kategorien = kategorienState.map((elem) => elem.KategorieName);
  },
};
</script>

<style></style>
