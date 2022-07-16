<template>
  <v-app-bar color="primary" dark app>
    <v-icon class="mr-2">mdi-trophy-outline</v-icon>
    <router-link to="groupstage">
      <v-toolbar-title class="white--text">
        {{ appTitle }}
      </v-toolbar-title>
    </router-link>
    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn @click="dialogAdd = true" icon>
        <v-icon>mdi-plus-box</v-icon>
      </v-btn>

      <v-btn @click="dialogSettings = true" class="mr-1 ml-1" icon>
        <v-icon>mdi-view-grid</v-icon>
      </v-btn>

      <v-btn @click="dialogSave = true" class="mr-1 ml-1" icon>
        <v-icon>mdi-download-box</v-icon>
      </v-btn>

      <v-btn
          @click="onEndTournament"
          class="ml-1 mr-1"
          color="error"
          icon
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-dialog v-model="dialogAdd" persistent max-width="600">
        <v-card>
          <v-card-text>
            <add-to-tournament :groups="visibleGroups"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="blue darken-1" text @click="dialogAdd = false"
            >Schließen
            </v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogSettings" persistent max-width="600">
        <v-card>
          <v-card-text>
            <layout-options :groups="groups"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogSettings = false"
            >Schließen
            </v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogSave" max-width="400">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col class="mt-2" cols="12">
                  <h1>Turnier speichern</h1>
                </v-col>
                <v-col cols="12">
                  <a class="save-link" :download="fileName" :href="fileUrl"
                  >Datei herunterladen</a
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" text @click="dialogSave = false"
            >Schließen
            </v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import Vue from "vue";

import AddToTournament from "@/components/dialog/AddToTournament";
import LayoutOptions from "@/components/dialog/LayoutOptions";
import {convertTournamentWinnerToJson} from "../../util/TournamentConverter";

export default Vue.extend({
  components: {
    AddToTournament,
    LayoutOptions,
  },
  data: () => {
    return {
      dialogAdd: false,
      dialogSave: false,
      dialogSettings: false,
      href: "",
    };
  },
  computed: {
    tournament() {
      return this.$store.getters.currentTournament;
    },
    appTitle() {
      return this.tournament?.name ?? "Nicht geladen";
    },
    visibleGroups() {
      return this.$store.getters.visibleGroups ?? [];
    },
    groups() {
      return this.tournament?.groups ?? [];
    },
    fileUrl() {
      if (!this.tournament) {
        return "";
      }

      const json = convertTournamentWinnerToJson(this.tournament);
      const file = new Blob([json], {type: "text/plain"});
      return URL.createObjectURL(file);
    },
    fileName() {
      return this.appTitle + ".txt"
    }
  },
  methods: {
    onEndTournament() {
      localStorage.removeItem("currentTournamentId");
      this.$store.state.tournament.current = null;
      this.$router.push("/");
    }
  }
});
</script>

<style scoped>
.save-link {
  border: thin solid steelblue;
  border-radius: 4px;
  align-items: center;
  font-weight: 500;
  letter-spacing: 0.089em;
  display: inline-flex;
  text-transform: uppercase;
  text-decoration: none;
  height: 36px;
  padding: 0 16px;
}

.save-link:hover {
  background-color: lightblue;
}
</style>
