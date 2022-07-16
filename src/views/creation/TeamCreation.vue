<template>
  <v-container class="mt-4 pa-0">
    <v-form v-model="specialTournamentConfig.isValid" ref="teamCreationForm">
      <v-row>
        <v-col cols="12">
          <p>
            Die Teams werden zufällig auf die Anzahl der angegebenen Gruppen
            verteilt. Eine manuelle Änderung der Teamnamen ist später immernoch
            möglich.
          </p>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pt-0" cols="4">
          <p>
            <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
            Gruppenanzahl:
          </p>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="specialTournamentConfig.groupCount"
            type="number"
            min="1"
            max="32"
            label="Anzahl Gruppen"
            required
            outlined
            @input="validate"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pt-0" cols="4">
          <p>
            <v-icon class="mr-2" color="primary">mdi-cards</v-icon>
            Gruppenrundenspiele:
          </p>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="specialTournamentConfig.gamesPerGroupCount"
            type="number"
            min="1"
            max="5"
            label="Anzahl Spiele pro Team pro Gruppe"
            required
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pt-0" cols="4">
          <p>
            <v-icon class="mr-2" color="primary">mdi-trophy-outline</v-icon>
            Gewinner pro Gruppe:
          </p>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="specialTournamentConfig.winnerPerGroupCount"
            type="number"
            min="1"
            label="Anzahl Gewinner pro Gruppe"
            required
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pt-0" cols="4">
          <p>
            <v-icon class="mr-2" color="primary"
              >mdi-account-supervisor-circle</v-icon
            >
            Teamnamen:
          </p>
        </v-col>
        <v-col cols="8">
          <v-textarea
            v-model.trim="specialTournamentConfig.teams"
            :label="teamLabel"
            placeholder="Mit + Komma, getrennt + oderneue + Zeile"
            :rules="teamCountRules"
            required
            outlined
            rows="4"
            @input="validate"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col cols="6">
        <v-btn
          v-if="false"
          color="primary"
          block
          @click="onSaveClicked"
          :disabled="!tournamentConfig.isValid"
        >
          <v-icon class="mr-2">mdi-content-save</v-icon> Speichern</v-btn
        >
      </v-col>
      <v-col cols="6">
        <v-btn
          color="primary"
          block
          @click="onStartClicked"
          :disabled="!isValid"
        >
          Starten <v-icon class="ml-2">mdi-arrow-right-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createTournament } from "../../services/TournamentService";

export default {
  props: {
    tournamentConfig: {
      type: Object,
      default() {
        return {
          isValid: true,
        };
      },
    },
  },
  data: () => {
    return {
      specialTournamentConfig: {
        isValid: false,
        groupCount: 1,
        gamesPerGroupCount: 1,
        winnerPerGroupCount: 3,
        teams: "",
      },
    };
  },
  computed: {
    isValid() {
      return (
        this.tournamentConfig.isValid && this.specialTournamentConfig.isValid
      );
    },
    teamArray() {
      return this.specialTournamentConfig.teams
        .slice()
        .replace(new RegExp("\r?\n", "g"), ",")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    },
    teamCount() {
      return this.teamArray ? this.teamArray.length : 0;
    },
    teamLabel() {
      return "Teamnamen: Aktuell " + this.teamCount + " Teams";
    },
    teamCountRules() {
      return [
        (v) =>
          (v &&
            this.teamCount >= 2 * this.specialTournamentConfig.groupCount) ||
          "Mindestens 2 Teams pro Gruppe (Benötigte Teams: " +
            2 * this.specialTournamentConfig.groupCount +
            ").",
      ];
    },
  },
  methods: {
    validate() {
      this.$refs.teamCreationForm.validate();
    },
    async onStartClicked() {
      const config = {
        type: "team",
        name: this.tournamentConfig.name,
        startDate:
          this.tournamentConfig.startDate +
          " " +
          this.tournamentConfig.startTime +
          ":00",
        groupCount: this.specialTournamentConfig.groupCount,
        gamesPerGroupCount: this.specialTournamentConfig.gamesPerGroupCount,
        winnerPerGroupCount: this.specialTournamentConfig.winnerPerGroupCount,
        teams: this.teamArray,
        rankingConfig: this.$store.state.settings,
      };

      const tournament = await createTournament(config);

      this.$store.state.tournament.current = tournament;
      localStorage.setItem("currentTournamentId", tournament?.id);
      this.$router.push({ name: "GroupStage" });
    },
    onSaveClicked() {},
  },
};
</script>
