class Wall extends Hexagon {
    constructor({ hexagonName = "" }, { radius = 0, row = 0, col = 0, inDoor = 0,
        outDoor = 0, containsLight = false } = {}) {

        super({ hexagonName: hexagonName }, {
            radius: radius, row: row, col: col, inDoor: inDoor,
            outDoor: outDoor, containsLight: containsLight
        });
    }
}