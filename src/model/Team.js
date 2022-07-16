export const colors = [
  '#DDD92A',
  '#6E2594',
  '#5FAD56',
  '#F34213',
  '#6CD4FF',
  '#9B97B2',
  '#9b0000'
]

export default class Team {
  constructor(id, name) {
    this.id = id
    this.name = name
    this.games = 0
    this.wins = 0
    this.points = 0
    this.beersGood = 0
    this.beersBad = 0
    this.color = "primary"
  }
}
