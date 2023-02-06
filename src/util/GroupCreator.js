import {v4 as uuid} from "uuid";
import Group from "../model/Group";
import {colors} from "../model/Team";

export function createGroups(teams, groupCount) {
    if (!teams || teams.length === 0 || groupCount < 1) {
        return []
    }

    const teamCount = teams.length
    const groups = []

    for (let g = 0; g < groupCount; g++) {
        groups.push(new Group(uuid().toString(), "Tisch " + (g + 1)))
    }

    for (let t = 0; t < teamCount; t++) {
        groups[t % groupCount].teams.push(teams[t])
    }

    groups.forEach(g => {
        g.teams.sort((a, b) => a.id.localeCompare(b.id))
        g.teams.forEach((t, index) => {
            t.color = colors[index % colors.length]
        })
    })

    return groups
}
