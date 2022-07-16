import {v4 as uuid} from 'uuid'

import Tournament from "../model/Tournament"
import {createTeamsFromCount, createTeamsFromNames, createTeamsFromPlayers} from "../util/TeamCreator";
import {createGroups} from "../util/GroupCreator";
import {createGames} from "../util/GameCreator";

import * as LocalStorageDatabase from "./LocalStorageDatabase"
import {convertJsonToTournament} from '../util/TournamentConverter';

export function getTournaments() {
    return LocalStorageDatabase.getTournaments()
}

export function getTournament(id) {
    const json = LocalStorageDatabase.getTournament(id)
    return convertJsonToTournament(json)
}

export function createTournament(config) {
    let grps = ""
    switch (config.type) {
        case "manual":
            grps = convertManualConfigToGroups(config)
            break
        case "player":
            grps = convertPlayerConfigToGroups(config)
            break
        case "team":
            grps = convertTeamConfigToGroups(config)
            break
        default:
            throw new Error("Unknown tournament config type.")
    }

    const tournament = new Tournament(uuid(), config.name, config.startDate)
    tournament.groups = grps
    tournament.configuration = {
        groupCount: config.groupCount,
        teamCount: config.teamCount,
        players: config.players ?? [],
        teams: config.teams ?? []
    }

    LocalStorageDatabase.createTournament(tournament)
    return tournament
}

export function updateTournament(tournament) {
    if (tournament) {
        LocalStorageDatabase.updateTournament(tournament)
    }
}

export function deleteTournament(id) {
    LocalStorageDatabase.deleteTournament(id)
}

export function updateTeam(tournament, params) {
    const group = tournament.groups.find(g => g.id === params.groupId)
    if (group) {
        const team = group.teams.find(t => t.id === params.teamId)
        if (team) {
            team.name = params.name
            LocalStorageDatabase.updateTournament(tournament)
            return true
        }
    }
    return false

}

export function updateGame(tournament, params) {
    const group = tournament.groups.find(g => g.id === params.groupId)
    if (group) {
        const game = group.games.find(g => g.id === params.gameId)
        if (game) {
            game.score = params.score

            LocalStorageDatabase.updateTournament(tournament)
            return true
        }
    }
    return false
}

export async function getConfiguration(id) {
    console.log("getConfiguration(id) is not implemented yet")
}

function convertManualConfigToGroups(config) {
    const teams = createTeamsFromCount(config.teamCount)
    const groups = createGroups(teams, config.groupCount)
    groups.forEach(grp => {
        grp.games = createGames(grp)
    })
    return groups
}

export function convertPlayerConfigToGroups(config) {
    const teams = createTeamsFromPlayers(config.players)
    const groups = createGroups(teams, config.groupCount)
    groups.forEach(grp => {
        grp.games = createGames(grp)
    })
    return groups
}

export function convertTeamConfigToGroups(config) {
    const teams = createTeamsFromNames(config.teams)
    const rankingConfig = config.rankingConfig
    const groups = createGroups(teams, config.groupCount, config.winnerPerGroupCount, rankingConfig)
    groups.forEach(grp => {
        grp.games = createGames(grp, config.gamesPerGroupCount)
    })
    return groups
}
