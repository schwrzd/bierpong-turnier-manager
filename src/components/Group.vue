<template>
  <v-expansion-panels multiple accordion v-model="expandedTables">
    <v-expansion-panel>
      <v-expansion-panel-header
          style="font-size: 1.3rem"
          color="primary white--text"
      >
        {{ group.name }}
        <template v-slot:actions>
          <v-icon color="white">mdi-chevron-down</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-data-table
            :headers="gameHeaders"
            :items="games"
            mobile-breakpoint="400"
            :hide-default-footer="!showPaginationFooter"
            :footer-props="footerProps"
            :items-per-page="itemsPerPage"
        >
          <template v-slot:[`item.id`]="{ item }">
            <div class="numbering">{{ games.indexOf(item) + 1 }}</div>
          </template>

          <template v-slot:[`item.team1.name`]="{ item }">
            <!-- Placement Depends on what the other team needs -->
            <team-chip
                :name="item.team1.name"
                :color="$store.state.layout.isColoredTeamsEnabled ? item.team1.color: defaultColor"
                :cup-layout-enabled="$store.state.layout.isCupLayoutEnabled"
                :cup-layout="getCupLayout(item.team2, item)"
            />
          </template>

          <template v-slot:[`item.score.beers1`]="{ item }">
            <v-edit-dialog
                large
                save-text="Speichern"
                cancel-text="Abbrechen"
                @open="beerInput = item.score.beers1"
                @close="beerInput = undefined"
                @save="saveBeer1Input(item)"
                @cancel="beerInput = undefined"
            >
              <div :class="[getGameResultStyling(1, item.score)]">
                {{
                  item.score.beers1 !== undefined
                      ? item.score.beers1
                      : item.score.beers2 !== undefined
                          ? ""
                          : "-/-"
                }}
              </div>
              <template v-slot:input>
                <v-text-field
                    v-model="beerInput"
                    type="number"
                    label="Bearbeiten"
                    single-line
                    min=0
                    :max="cups"
                />
              </template>
            </v-edit-dialog>
          </template>

          <template v-slot:[`item.divider`]="{}">
            <div class="divider">:</div>
          </template>

          <template v-slot:[`item.score.beers2`]="{ item }">
            <v-edit-dialog
                large
                cancel-text="Abbrechen"
                save-text="Speichern"
                @open="beerInput = item.score.beers2"
                @close="beerInput = ''"
                @save="saveBeer2Input(item)"
                @cancel="beerInput = ''"
            >
              <div :class="getGameResultStyling(2, item.score)">
                {{
                  item.score.beers2 !== undefined
                      ? item.score.beers2
                      : item.score.beers1 !== undefined
                          ? ""
                          : "-/-"
                }}
              </div>
              <template v-slot:input>
                <v-text-field
                    v-model="beerInput"
                    type="number"
                    label="Bearbeiten"
                    single-line
                    min=0
                    :max="cups"
                />
              </template>
            </v-edit-dialog>
          </template>

          <template v-slot:[`item.team2.name`]="{ item }">
            <!-- CupLayout Depends on what the other team needs -->
            <team-chip
                :name="item.team2.name"
                :color="$store.state.layout.isColoredTeamsEnabled ? item.team2.color: defaultColor"
                :cup-layout-enabled="$store.state.layout.isCupLayoutEnabled"
                :cup-layout="getCupLayout(item.team1, item)"
                right
            />
          </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header color="primary white--text" style="font-size: 1.3rem"
      >Tabelle von {{ group.name }}
        <template v-slot:actions>
          <v-icon color="white">mdi-chevron-down</v-icon>
        </template>
      </v-expansion-panel-header
      >
      <v-expansion-panel-content>
        <v-data-table
            ref="standings"
            :headers="teamHeaders"
            :items="group.teams"
            mobile-breakpoint="400"
            hide-default-footer
            :items-per-page="-1"
        >
          <template v-slot:[`item.id`]="{ item }">
            <div class="numbering" style="background-color: green;" v-if="(group.teams.indexOf(item)< group.winnerPerGroup)"> {{ group.teams.indexOf(item) + 1 }} </div>
            <div class="numbering" style="background-color: red;" v-if="(group.teams.indexOf(item)>= group.winnerPerGroup)"> {{ group.teams.indexOf(item) + 1 }} </div>
          </template>

          <template v-slot:[`item.name`]="{ item }">
            <v-edit-dialog
                large
                save-text="Übernehmen"
                cancel-text="Abbrechen"
                @open="teamNameInput = item.name"
                @close="teamNameInput = ''"
                @cancel="teamNameInput = ''"
                @save="saveTeamName(item)"
            >
              <team-chip
                  :name="item.name"
                  :color="$store.state.layout.isColoredTeamsEnabled ? item.color : defaultColor"
              />
              <template v-slot:input>
                <v-text-field
                    v-model="teamNameInput"
                    :rules="teamNameRules"
                    label="Teamname"
                    single-line
                    autofocus
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.games`]="{ item }">
            <span class="standings-score">{{ item.games }}</span>
          </template>
          <template v-slot:[`item.wins`]="{ item }">
            <span class="standings-score">{{ item.wins }}</span>
          </template>
          <template v-slot:[`item.points`]="{ item }">
            <span class="standings-score-highlight">{{ item.points }}</span>
          </template>
          <template v-slot:[`item.beerScore`]="{ item }">
            <span class="standings-score"
            >{{ item.beersGood }}:{{ item.beersBad }}</span
            >
            <span class="standings-score-highlight">
              ({{ item.beersGood - item.beersBad }})
            </span>
          </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import TeamChip from "./TeamChip.vue";
import CupLayouts from "../util/CupLayouts";

export default {
  components: {
    TeamChip,
  },
  props: ["group"],
  data: () => {
    return {
      defaultColor: "#BF1F1F",
      beerInput: "",
      teamNameInput: "",
      expandedTables: [0, 1],
      footerProps: {
        "items-per-page-text": "Spiele pro Seite",
        "items-per-page-options": [
          2,
          3,
          4,
          5,
          6,
          7,
          10,
          20,
          30,
          -1
        ],
      },
      gameHeaders: [
        {
          text: "",
          width: "8%",
          value: "id",
          align: "start",
        },
        {
          text: "Team 1",
          value: "team1.name",
          align: "start",
          sortable: false,
        },
        {
          text: "Biere",
          value: "score.beers1",
          align: "center",
          sortable: false,
        },
        {
          text: "",
          sortable: false,
          align: "center",
          value: "divider",
        },
        {
          text: "Biere",
          value: "score.beers2",
          align: "center",
          sortable: false,
        },
        {
          text: "Team 2",
          value: "team2.name",
          align: "end",
          sortable: false,
        },
      ],
      teamHeaders: [
        {
          text: "",
          width: "8%",
          value: "id",
          align: "start",
        },
        {
          text: "Team",
          width: "53%",
          value: "name",
          align: "start",
          sortable: false,
        },
        {
          text: "Spiele",
          value: "games",
          align: "center",
          sortable: false,
        },
        {
          text: "Wins",
          value: "wins",
          align: "center",
          sortable: false,
        },
        {
          text: "Punkte",
          value: "points",
          align: "center",
          sortable: false,
        },
        {
          text: "Treffer",
          value: "beerScore",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    cups() {
      return this.$store.state.settings.cups;
    },
    games() {
      return this.group?.games ?? [];
    },
    teamNameRules() {
      return [
        (v) => !!v || "Bitte einen Namen eingeben",
        (v) => (v && v.length >= 3) || "Mindestens 3 Zeichen",
      ];
    },
    itemsPerPage() {
      return this.group.teams.length / 2;
      if (this.$store.state.layout.isPaginationEnabled) {
        return this.$store.state.layout.gamesPerPage;
      } else {
        return this.games.length / (this.games.length/this.teams.length);
      }
    },
    showPaginationFooter(){
      return this.$store.state.layout.isPaginationEnabled && this.$store.state.layout.gamesPerPage < this.games.length
    }
  },
  methods: {
    validate() {
      let cups = this.$store.state.settings.cups;
      console.log(this.beerInput + " / " + cups);
      if(Number(this.beerInput) > Number(cups) || Number(this.beerInput) < 0)
      {
        return false;
      }
      return true;
    },
    getGameResultStyling(teamPos, score) {
      if (
          (score.beers1 === undefined && teamPos === 1) ||
          (score.beers2 === undefined && teamPos === 2)
      ) {
        return "empty";
      }

      let styling = "default";
      if (teamPos === 1) {
        if (score.beers1 < score.beers2) {
          styling = "loser";
          } else if (score.beers1 > score.beers2) {
            styling = "winner";
        }
      } else if (teamPos === 2) {
        if (score.beers2 < score.beers1) {
          styling = "loser";
          } else if (score.beers2 > score.beers1) {
            styling = "winner";
        }
      }

      return styling;
    },
    getCupLayout(team, game) {
      const gameNumber = this.getGameNumberOfTeam(team, game) - 1
      return CupLayouts[Math.max(0, gameNumber % CupLayouts.length)]
    },
    getGameNumberOfTeam(team, game) {
      let count = 0;
      let before = true
      this.games.forEach(g => {
        if (g.team1.id === team.id || g.team2.id === team.id) {
          if (before) {
            count++
          }
        }
        if (game.id === g.id) {
          before = false
        }
      })

      return count
    },
    saveBeer1Input(game) {
      if(!this.validate())
        return;
      console.log("durch");
      game.score.beers1 = this.beerInput ? +this.beerInput : undefined;
      this.beerInput = "";

      this.group.calculateStandings();

      this.$emit("changed", {
        type: "game_score",
        groupId: this.group.id,
        gameId: game.id,
        score: game.score,
      });
    },

    saveBeer2Input(game) {
      if(!this.validate())
        return;
      console.log("durch");
      game.score.beers2 = this.beerInput ? +this.beerInput : undefined;
      this.beerInput = "";

      this.group.calculateStandings();

      this.$emit("changed", {
        type: "game_score",
        groupId: this.group.id,
        gameId: game.id,
        score: game.score,
      });
    },

    async saveTeamName(team) {
      team.name = this.teamNameInput;
      this.teamNameInput = "";

      this.$emit("changed", {
        type: "team_name",
        groupId: this.group.id,
        teamId: team.id,
        name: team.name,
        color: team.color
      });
    },
  },
};
</script>

<style scoped>
.winner {
  font-weight: bold;
  font-size: 1.5rem;
  border: 1px solid darkgreen;
  border-radius: 4px;
  margin: 2px;
  padding: 0 4px;
}

.loser {
  font-weight: normal;
  font-size: 1.5rem;
  border: 0px solid darkred;
  border-radius: 4px;
  margin: 2px;
  padding: 0 4px;
  opacity: 0.6;
}

.default {
  font-weight: normal;
  font-size: 1.5rem;
  border: 0px solid gray;
  border-radius: 4px;
  margin: 2px;
  padding: 0 4px;
}

.empty {
  font-weight: normal;
  font-size: 1rem;
  border: 0px solid gray;
  border-radius: 4px;
  margin: 2px;
  padding: 0 4px;
}

.numbering {
  font-weight: 500;
  font-size: 1.3rem;
  border: 1px solid gray;
  border-radius: 4px;
  margin-right: 4px;
  text-align: center;
}

.divider {
  font-size: 1.3rem;
  font-weight: 500;
}

.standings-score {
  font-size: 1.3rem;
  display: inline;
}

.standings-score-highlight {
  font-size: 1.2rem;
  font-weight: 700;
  display: inline;
}
</style>

<style>
.v-expansion-panel-content__wrap {
  padding: 0 6px !important;
}

th {
  font-size: 14px !important;
}

.v-data-table td {
  padding: 0 2px !important;
}
</style>
