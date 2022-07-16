import Vue from 'vue'
import Vuex from 'vuex'

import tournament from './module.tournament'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        layout: {
            groupsPerRow: 1,
            isPaginationEnabled: true,
            gamesPerPage: 2,
            isColoredTeamsEnabled: true
        },
        settings: {
            cups: 10,
            pointsPerHit: 1,
            extraPointsForWin: 0,
            extraPointsForFinishWin: 5
        },
    },
    mutations: {},
    actions: {},
    getters: {},
    modules: {
        tournament
    }
})
