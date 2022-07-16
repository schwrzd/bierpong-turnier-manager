<template>
  <v-container style="max-width: 1200px" >
    <v-card class="mt-2">
      <v-card-title>
        Gib die Kenndaten zum Turnier ein:
        <v-spacer></v-spacer>
        <v-btn color="error" @click="onCancelClicked">
          <v-icon class="mr-2">mdi-close-circle-outline</v-icon>
          Abbrechen
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="tournamentConfig.isValid">
          <v-row align="center">
            <v-col class="pt-0" cols="4">
              <p>
                <v-icon class="mr-2" color="primary">mdi-trophy</v-icon>
                Turniername:
              </p>
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model.trim="tournamentConfig.name"
                :rules="tournamentNameRules"
                label="Name des Turniers"
                outlined
                required
              />
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="pt-0" cols="4">
              <p>
                <v-icon class="mr-2" color="primary">mdi-calendar-clock</v-icon>
                Termin:
              </p>
            </v-col>
            <v-col cols="4">
              <v-menu
                v-model="startDateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="tournamentConfig.startDate"
                    label="Datum"
                    :rules="startDateRules"
                    outlined
                    readonly
                    required
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="tournamentConfig.startDate"
                  @input="startDateMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-menu
                ref="menu"
                v-model="startTimeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="tournamentConfig.startTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="tournamentConfig.startTime"
                    label="Uhrzeit"
                    :rules="startTimeRules"
                    readonly
                    outlined
                    required
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="startTimeMenu"
                  v-model="tournamentConfig.startTime"
                  format="24hr"
                  full-width
                  @click:minute="$refs.menu.save(tournamentConfig.startTime)"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card
      class="mt-4"
    >
      <v-card-title> Konfiguriere die Einstellungen des Turniers: </v-card-title>
      <v-card-text>
        <v-tabs v-model="tab" grow>
          <v-tab> Gruppenerstellung </v-tab>
          <v-tab> Einstellungen </v-tab>
          <!-- <v-tab> Spieler*innen </v-tab>
          <v-tab> Manuell </v-tab>
          <v-tab> Ext. Anmeldungen </v-tab> -->

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <team-creation :tournamentConfig="tournamentConfig" />
            </v-tab-item>
            <v-tab-item>
              <setting-creation :tournamentConfig="tournamentConfig" />
            </v-tab-item>
            <v-tab-item>
              <player-creation :tournamentConfig="tournamentConfig" />
            </v-tab-item>
            <v-tab-item>
              <manual-creation :tournamentConfig="tournamentConfig" />
            </v-tab-item>
            <v-tab-item>
              <existing-registration-creation
                :tournamentConfig="tournamentConfig"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import TeamCreation from "./TeamCreation";
import SettingCreation from "./SettingCreation";
import PlayerCreation from "./PlayerCreation";
import ManualCreation from "./ManualCreation";
import ExistingRegistrationCreation from "./ExistingRegistrationCreation";

export default {
  components: {
    TeamCreation,
    SettingCreation,
    PlayerCreation,
    ManualCreation,
    ExistingRegistrationCreation,
  },
  data: () => {
    return {
      tab: null,
      tournamentConfig: {
        isValid: false,
        name: "",
        startDate: null,
        startTime: "20:00",
      },
      startDateMenu: false,
      startTimeMenu: false,
      tournamentNameRules: [
        (v) => !!v || "Bitte einen Turniernamen eingeben.",
        (v) => (v && v.length > 2) || "Mindestens 3 Zeichen",
        (v) => (v && v.length <= 64) || "Maximal 64 Zeichen",
      ],
      maxTeamsRules: [
        (v) => !!v || "Bitte einen Wert eingeben.",
        (v) => (v !== undefined && v > 3 && v < 65) || "Wert zwischen 4 und 64",
      ],
      startDateRules: [(v) => !!v || "Bitte ein Datum angeben."],
      startTimeRules: [(v) => !!v || "Bitte eine Uhrzeit angeben."],
    };
  },
  methods: {
    onCancelClicked() {
      this.$router.push("/");
    },
  }
};
</script>

<style>
.v-tabs-bar.v-tabs-bar--is-mobile .v-tab {
  margin-left: 0px !important;
}
</style>
