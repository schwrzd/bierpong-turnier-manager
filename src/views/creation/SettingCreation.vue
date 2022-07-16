<template>
  <v-container class="mt-4 pa-0">
    <v-form v-model="specialTournamentConfig.isValid" ref="teamCreationForm">
      <v-row>
        <v-col cols="12">
          <p>
            Einstellungen zum Rankingsystem
          </p>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pt-0" cols="4">
          <p>
            <v-icon class="mr-2" color="primary">mdi-beer</v-icon>
            Anzahl Becher:
          </p>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="specialTournamentConfig.cups"
            type="number"
            min="1"
            max="15"
            label="Anzahl Becher pro Team"
            required
            outlined
            @input="onStartClicked"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pt-0" cols="4">
          <p>
            <v-icon class="mr-2" color="primary">mdi-chevron-triple-up</v-icon>
            Punkte pro Treffer:
          </p>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="specialTournamentConfig.pointsPerHit"
            type="number"
            min="1"
            label="Punkte für einen getroffenen Becher"
            required
            outlined
            @input="onStartClicked"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pt-0" cols="4">
          <p>
            <v-icon class="mr-2" color="primary">mdi-trophy-outline</v-icon>
            Punkte für Sieg:
          </p>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="specialTournamentConfig.extraPointsForWin"
            type="number"
            min="0"
            label="Extrapunkte für einen Sieg"
            required
            outlined
            @input="onStartClicked"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pt-0" cols="4">
          <p>
            <v-icon class="mr-2" color="primary">mdi-clock-check</v-icon>
            Punkte für fertiges Spiel:
          </p>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="specialTournamentConfig.extraPointsForFinishWin"
            type="number"
            min="0"
            label="Extrapunkte für einen Sieg vor Ablauf der Zeit"
            required
            outlined
            @input="onStartClicked"
          ></v-text-field>
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
    </v-row>
  </v-container>
</template>

<script>

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
        cups: 10,
        pointsPerHit: 1,
        extraPointsForWin: 0,
        extraPointsForFinishWin: 5,
      },
    };
  },
  computed: {
    isValid() {
      return (
        this.tournamentConfig.isValid && this.specialTournamentConfig.isValid
      );
    },
  },
  methods: {
    validate() {
      this.$refs.teamCreationForm.validate();
    },
    async onStartClicked() {
      const config = {
        cups: this.specialTournamentConfig.cups,
        pointsPerHit: this.specialTournamentConfig.pointsPerHit,
        extraPointsForWin: this.specialTournamentConfig.extraPointsForWin,
        extraPointsForFinishWin: this.specialTournamentConfig.extraPointsForFinishWin,
      };

      this.$store.state.settings = config;
    },
    onSaveClicked() {},
  },
};
</script>
