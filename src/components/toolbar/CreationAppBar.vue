<template>
  <v-app-bar color="primary" dark app>
    <v-img
      class="logo mr-2"
      :src="require('../../assets/logo_small.png')"
      style="max-width: 64px"
      contain
    />
    <router-link to="/">
      <v-toolbar-title class="white--text">Bierpong-Turnier-Manager</v-toolbar-title>
    </router-link>
    <v-spacer/>
    <v-btn
        light
        @click="$router.push({ name: 'TournamentCreation' })"
    >
      <v-icon class="mr-2">mdi-plus</v-icon>
      Erstellen
    </v-btn>
      <v-btn
          light
          class="ml-2"
          @click="$router.push({ name: 'ManagingLanding' })"
      >
        <v-icon class="mr-2">mdi-clipboard-edit-outline</v-icon>
        Verwalten/Laden
      </v-btn>
  </v-app-bar>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data: () => {
    return {};
  },
});
</script>
