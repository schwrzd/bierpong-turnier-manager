<template>
  <v-container fluid>
    <v-row>
      <v-col class="mt-2 mb-2" cols="12">
        <h1>Layoutoptionen</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="pb-0" cols="12">
        <h3>Gruppenlayout</h3>
      </v-col>
      <v-col class="pb-0" cols="12">
        <v-select
            outlined
            :items="[1, 2, 3, 4, 6]"
            label="Gruppen pro Reihe"
            v-model="$store.state.layout.groupsPerRow"
        ></v-select>
      </v-col>
      <v-col class="pt-0" cols="12" sm="6">
        <v-switch
            label="Tabelle mit mehreren Seiten"
            v-model="$store.state.layout.isPaginationEnabled"
        ></v-switch>
      </v-col>
      <v-col class="pt-0 " cols="12" sm="6">
        <v-select
            outlined
            :items="[2, 3, 4, 5, 6, 7, 10, 20, 30]"
            label="Spiele pro Tabellenseite"
            :disabled="!$store.state.layout.isPaginationEnabled"
            v-model="$store.state.layout.gamesPerPage"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="pb-0" cols="12">
        <h3>Design</h3>
      </v-col>
      <v-col class="pb-0" cols="12">
        <v-switch
            class="mt-0 mb-0"
            label="Teams mit Farben"
            v-model="$store.state.layout.isColoredTeamsEnabled"/>
      </v-col>
      <v-col class="pb-0 pt-0" cols="12">
        <v-switch
            class="mt-0 mb-6"
            label="Spezielle Aufstellregeln anzeigen"
            v-model="$store.state.layout.isCupLayoutEnabled"/>
      </v-col>

    </v-row>

    <v-row>
      <v-col class="pb-2" cols="12">
        <h3>Sichtbare Gruppen</h3>
      </v-col>
      <v-col cols="6" sm="4" v-for="group in groups" :key="group.id" class="pb-0 pt-0">
        <v-checkbox
            :label="group.name"
            v-model="group.isVisible"
            class="mb-0 mt-0"
            color="primary"
        ></v-checkbox>
      </v-col>
    </v-row>


  </v-container>
</template>

<script>
export default {
  name: "LayoutOptions",
  props: {
    groups: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
}
</script>

<style scoped>

</style>
