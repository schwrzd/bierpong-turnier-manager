export default class Group {
    constructor(id, name, winnerPerGroup, rankingConfig) {
        this.id = id
        this.name = name
        this.winnerPerGroup = winnerPerGroup
        this.rankingConfig = rankingConfig
        this.teams = []
        this.games = []
        this.isVisible = true
    }

    hasStarted() {
        let ret = false
        this.games.forEach(game => {
            if (game.score.isValid()) ret = true
        })
        return ret
    }

    calculateStandings() {
        this.calculateResults()
        this.teams.sort(this.sortTeams)
        this.games.sort((g1, g2) => g1.order - g2.order)
    }

    calculateResultsOld() {
        this.teams.forEach(team => {
            team.games = 0
            team.points = 0
            team.beersGood = 0
            team.beersBad = 0
        })

        this.games.forEach(game => {
            if (!game.score.isValid()) return

            game.team1.games++
            game.team2.games++
            game.team1.beersGood += (game.score.beers2 ?? 0)
            game.team2.beersGood += (game.score.beers1 ?? 0)
            game.team1.beersBad += (game.score.beers1 ?? 0)
            game.team2.beersBad += (game.score.beers2 ?? 0)

            if (game.score.beers1 < game.score.beers2) {
                game.team1.points++
            }
            if (game.score.beers2 < game.score.beers1) {
                game.team2.points++
            }
        })
    }

    calculateResults() {
        let beersToBePlayedWith = 10
        let pointsPerHit = 1
        let extraPointsForWin = 0
        let extraPointsForFinishWin = 5

        if(this.rankingConfig !== undefined)
        {
            beersToBePlayedWith = Number(this.rankingConfig.cups)
            pointsPerHit = Number(this.rankingConfig.pointsPerHit)
            extraPointsForWin = Number(this.rankingConfig.extraPointsForWin)
            extraPointsForFinishWin = Number(this.rankingConfig.extraPointsForFinishWin)
        }
        
        this.teams.forEach(team => {
            team.games = 0
            team.points = 0
            team.beersGood = 0
            team.beersBad = 0
            team.wins = 0
        })

        this.games.forEach(game => {
            if (!game.score.isValid()) return

            // inc played games
            game.team1.games++
            game.team2.games++

            // calc scored beers
            game.team1.beersGood += (game.score.beers1 ?? 0)
            game.team2.beersGood += (game.score.beers2 ?? 0)
            // calc conceded beers
            game.team1.beersBad += (game.score.beers2 ?? 0)
            game.team2.beersBad += (game.score.beers1 ?? 0)

            // Team 1 getroffene Becher
            // let team1CupsHit = beersToBePlayedWith - game.team1.beersGood
            game.team1.points +=  game.score.beers1 * pointsPerHit
            // Team 2 getroffene Becher
            // let team2CupsHit = beersToBePlayedWith - game.team2.beersGood
            game.team2.points += game.score.beers2 * pointsPerHit

            // Team 1 gewonnen
            if (game.score.beers1 > game.score.beers2) {
                game.team1.points += extraPointsForWin
            }
            // Team 2 gewonnen
            if (game.score.beers2 > game.score.beers1) {
                game.team2.points += extraPointsForWin
            }
            
            // Spiel beendet
            if (game.score.beers1 >= beersToBePlayedWith || game.score.beers2 >= beersToBePlayedWith) {
                let compare = game.score.beers1 - game.score.beers2
                
                if(compare > 0) {
                    // Team 1 gewonnen
                    game.team1.wins += 1
                    game.team1.points += extraPointsForFinishWin
                }
                else if (compare < 0) {
                    // Team 2 gewonnen
                    game.team2.wins += 1
                    game.team2.points += extraPointsForFinishWin
                }
            }
        })
    }

    sortTeams(t1, t2) {
        // 1. Anzahl Punkte
        let compare = t2.points - t1.points
        if (compare === 0) {
            // 2. Anzahl Siege
            compare = t2.wins - t1.wins
        }
        if (compare === 0) {
            // 3. Treffer
            compare = t2.beersGood - t1.beersGood
        }
        if (compare === 0) {
            // 4. Gegentreffer
            compare = t1.beersBad - t2.beersBad
        }
        if (compare === 0) {
            // 3. Overall scoring
            compare = (t2.beersGood - t2.beersBad) - (t1.beersGood - t1.beersBad)
        }
        if (compare === 0) {
            compare = t1.games - t2.games
        }
        // if (compare > 0) {
        //     console.log("Team links besser")
        // }
        // else if(compare < 0) {
        //     console.log("Team rechts besser")
        // }
        return compare
    }

    sortTeamsOld(t1, t2) {
        let compare = t2.points - t1.points
        if (compare === 0) {
            compare = (t2.beersGood - t2.beersBad) - (t1.beersGood - t1.beersBad)
        }
        if (compare === 0) {
            compare = t2.beersGood - t1.beersGood
        }
        if (compare === 0) {
            compare = t2.beersBad - t1.beersBad
        }
        if (compare === 0) {
            compare = t1.games - t2.games
        }
        return compare
    }
}
