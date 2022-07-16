import moment from "moment"

import Game from "../model/Game"
import Group from "../model/Group"
import Score from "../model/Score"
import Team from "../model/Team"
import Tournament from "../model/Tournament"

export function convertJsonToTournament(jTournament) {
    if (!jTournament) return undefined

    const tournament = new Tournament(
        jTournament.id,
        jTournament.name,
        moment(jTournament.startDate)
    )

    if (jTournament.configuration) {
        tournament.configuration = {
            groupCount: jTournament.configuration.groupCount,
            teamCount: jTournament.configuration.teamCount,
            players: jTournament.configuration.players,
            teams: jTournament.configuration.teams
        }
    }

    const groups = []
    jTournament.groups.forEach(jGroup => {
        const teams = []
        const games = []

        const group = new Group(
            jGroup.id,
            jGroup.name
        )

        jGroup.teams.forEach(jTeam => {
            const team = new Team(jTeam.id, jTeam.name)
            team.color = jTeam.color
            teams.push(team)
        })

        jGroup.games.forEach(jGame => {
            const t1 = teams.find(t => t.id === jGame.team1Id)
            const t2 = teams.find(t => t.id === jGame.team2Id)

            if (!t1 || !t2) return

            games.push(new Game(
                jGame.id,
                t1,
                t2,
                new Score(jGame.team1Score ?? undefined, jGame.team2Score ?? undefined),
                jGame.order
            ))
        })

        games.sort((g1, g2) => g1.order - g2.order)

        group.teams = teams
        group.games = games

        group.calculateStandings()
        groups.push(group)
    })

    tournament.groups = groups

    return tournament
}

export function convertTournamentWinnerToJson(tournament) {
    if (!tournament) return {}

    const jTeams = []
    var teams = "Teams absteigend nach ranking geordnet (1. Platz, 2.Platz ..)\n\n"
    teams += "--------------------------\n"
    tournament.groups.forEach(group => {
        teams += "\t" + group.name + ":\n"

        teams += "--------------------------\n"

        const sortedTeams = group.teams


        sortedTeams.forEach((team, index) => {
            if (index %5 === 0)
            {
                teams += "\n"
            }
                teams += team.name + "\n"
                // jTeams.push({
                //     position: index + 1,
                //     name: team.name,
                // })
        })
        teams += "--------------------------\n"
    })
    
    return teams
}

export function convertTournamentToJson(tournament) {
    if (!tournament) return {}

    const jGroups = []
    tournament.groups.forEach(group => {
        const jTeams = []
        const jGames = []

        group.teams.forEach(team => {
            jTeams.push({
                id: team.id,
                name: team.name,
                color: team.color
            })
        })

        group.games.forEach(game => {
            jGames.push({
                id: game.id,
                team1Id: game.team1.id,
                team2Id: game.team2.id,
                team1Score: game.score.beers1,
                team2Score: game.score.beers2,
                order: game.order
            })
        })

        jGroups.push({
            id: group.id,
            name: group.name,
            teams: jTeams,
            games: jGames
        })
    })

    return {
        id: tournament.id,
        name: tournament.name,
        startDate: tournament.startDate,
        configuration: tournament.configuration,
        groups: jGroups
    }
}

