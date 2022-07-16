import Game from "../model/Game"
import Score from "../model/Score"

import { v4 as uuid } from "uuid";
import {colors} from "../model/Team";

export function createGames(group, groupGames) {
    const teamCount = group ? group.teams.length : 0
    const roundGamesCount = groupGames ? groupGames : 1
    

    group.teams.forEach((t, index) => {
        t.color = colors[index%colors.length]
    })

    if (teamCount < 2) return []

    const pairings = getTeamParings(teamCount, roundGamesCount)
    const games = []

    let counter = 0
    pairings.forEach(pairing => {
        games.push(new Game(
            uuid(),
            group.teams[pairing.first - 1],
            group.teams[pairing.second - 1],
            new Score(),
            counter++
        ))
    })

    return games
}

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

function hasAlreadyPlayed(games, value, enemy) { 
    var hasPlayed = false
    
    games.forEach(game => {
        if (game.first == value)
        {
            if (game.second == enemy)
            {
                console.log("War schon gegner")
                hasPlayed = true
            }
        }
        else
        {
            if (game.first == enemy)
            {
                if(game.second == value)
                {
                    console.log("War schon gegner")
                    hasPlayed = true
                }
            }
        }
        // console.log("Hat in keinem game gegeneinander gespielt")
    });
    return hasPlayed
}

function getGamesForOneRound(numberOfTeams, games) { 
    var teamNrs = []
    for (let i = 0; i < numberOfTeams; i++) {
        teamNrs.push((i + 1))
    }
    while(teamNrs.length > 1) {
        const game = {}
        var item = teamNrs[Math.floor(Math.random()*teamNrs.length)];
        game.first = item
        teamNrs = arrayRemove(teamNrs, item);

        var item2 = teamNrs[Math.floor(Math.random()*teamNrs.length)];

        const hasAlreadyPlayedCounter = 0
        while ( hasAlreadyPlayed(games, item, item2))
        {
            item2 = teamNrs[Math.floor(Math.random()*teamNrs.length)];
            hasAlreadyPlayedCounter++

            if(hasAlreadyPlayedCounter > 300)
            {
                throw new Error()
            }
        }
        console.log("hasAlreadyPlayed: " + hasAlreadyPlayedCounter)
        game.second = item2
        teamNrs = arrayRemove(teamNrs, item2);

        games.push(game)
    }
}

function getGamesForOneRoundCollision(numberOfTeams, games) { 
    var teamNrs = []
    for (let i = 0; i < numberOfTeams; i++) {
        teamNrs.push((i + 1))
    }
    while(teamNrs.length > 1) {
        const game = {}
        var item = teamNrs[Math.floor(Math.random()*teamNrs.length)];
        game.first = item
        teamNrs = arrayRemove(teamNrs, item);

        var item2 = teamNrs[Math.floor(Math.random()*teamNrs.length)];

        const hasAlreadyPlayedCounter = 0
        while ( hasAlreadyPlayed(games, item, item2))
        {
            item2 = teamNrs[Math.floor(Math.random()*teamNrs.length)];
            hasAlreadyPlayedCounter++

            if(hasAlreadyPlayedCounter > 50)
            {
                break
            }
        }
        game.second = item2
        teamNrs = arrayRemove(teamNrs, item2);

        games.push(game)
    }
}

export function getTeamParings(numberOfTeams, numberOfRoundGames) {
    const games = []

    for (let i = 0; i < numberOfRoundGames; i++) {
        let triesOneGameEachPerRound = 0
        while (triesOneGameEachPerRound < 3)
        {
            try {
                getGamesForOneRound(numberOfTeams, games)
                triesOneGameEachPerRound = -1
                break
            }
            catch (err) {
                triesOneGameEachPerRound++
                console.log("Error: not possible to create games without duplicate enemies! retry " + (triesOneGameEachPerRound+1))
            }
        }
        if ( triesOneGameEachPerRound !== -1)
        {
            console.log("Error: not possible to create games without duplicate enemies! Continuing with duplicates")
            getGamesForOneRoundCollision(numberOfTeams, games)
        }
    }

    return games
}

export function getTeamParings2(numberOfTeams) {
    switch (numberOfTeams) {
        case 2:
            return [
                { first: 1, second: 2 }
            ]
        case 3:
            return [
                { first: 1, second: 2 },
                { first: 2, second: 3 },
                { first: 3, second: 1 }
            ]
        case 4:
            return [
                { first: 2, second: 1 },
                { first: 3, second: 4 },
                { first: 4, second: 2 },
                { first: 1, second: 3 },
                { first: 4, second: 1 },
                { first: 2, second: 3 }
            ]
        case 5:
            return [
                { first: 1, second: 4 },
                { first: 2, second: 5 },
                { first: 3, second: 1 },
                { first: 4, second: 2 },
                { first: 5, second: 3 },
                { first: 2, second: 1 },
                { first: 5, second: 4 },
                { first: 3, second: 2 },
                { first: 1, second: 5 },
                { first: 4, second: 3 }
            ]
        case 6:
            return [
                { first: 1, second: 2 },
                { first: 3, second: 4 },
                { first: 5, second: 6 },
                { first: 1, second: 3 },
                { first: 2, second: 5 },
                { first: 6, second: 4 },
                { first: 3, second: 5 },
                { first: 1, second: 4 },
                { first: 2, second: 6 },
                { first: 1, second: 5 },
                { first: 6, second: 3 },
                { first: 2, second: 4 },
                { first: 1, second: 6 },
                { first: 5, second: 4 },
                { first: 2, second: 3 }
            ]
        case 7:
            return [
                { first: 3, second: 6 },
                { first: 7, second: 4 },
                { first: 2, second: 1 },
                { first: 4, second: 5 },
                { first: 1, second: 7 },
                { first: 6, second: 2 },
                { first: 3, second: 5 },
                { first: 1, second: 4 },
                { first: 7, second: 6 },
                { first: 2, second: 3 },
                { first: 5, second: 1 },
                { first: 4, second: 6 },
                { first: 7, second: 3 },
                { first: 5, second: 2 },
                { first: 1, second: 6 },
                { first: 3, second: 4 },
                { first: 2, second: 7 },
                { first: 5, second: 6 },
                { first: 1, second: 3 },
                { first: 2, second: 4 },
                { first: 5, second: 7 }
            ]
    }
}
