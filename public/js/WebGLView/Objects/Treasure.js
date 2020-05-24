class Treasure extends Hexagon {
    constructor({ hexagonName = "" }, { radius = 0, row = 0, col = 0, inDoor = 0,
        outDoor = 0, containsLight = false } = {}) {

        super({ hexagonName: hexagonName }, {
            radius: radius, row: row, col: col, inDoor: inDoor,
            outDoor: outDoor, containsLight: containsLight
        });

        this.treasureSize = this.radius / 8;
        this.InitTreasure();
    }

    InitTreasure() {
        this.treasureGeometry = new THREE.BoxGeometry(this.treasureSize,
            this.treasureSize, this.treasureSize);

        this.treasure = new THREE.Mesh(this.treasureGeometry, this.containsLight ?
            Settings.PhongTreasureMaterial : Settings.BasicTreasureMaterial);

        this.treasure.lookAt(this.container.position);
        this.treasure.position.y = 0 - this.treasureSize / 2;

        this.container.add(this.treasure);
    }
}