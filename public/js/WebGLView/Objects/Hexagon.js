const Sides = 6;
const Angle = 360 / Sides;

class Hexagon {
    constructor({ hexagonName = "" }, { radius = 0, row = 0, col = 0, inDoor = 0,
        outDoor = 0, containsLight = false } = {}) {
        this.hexagonname = hexagonName;

        this.radius = radius;
        this.row = row;
        this.col = col;

        this.inDoor = inDoor;
        this.outDoor = outDoor;
        this.containsLight = containsLight;

        this.container = new THREE.Object3D();

        this.InitializeSide();
    }

    InitializeSide() {
        this.size = { x: this.radius / 2, y: this.radius / 4, z: this.radius / 14 };

        this.sideGeometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
        this.hexagonMaterial = this.containsLight ? Settings.PhongMaterial : Settings.BasicMaterial;

        this.side = new THREE.Mesh(this.sideGeometry, this.hexagonMaterial);
        this.InitializeHexagon();
    }

    InitializeHexagon() {
        for (let currentSide = 0; currentSide < Sides; currentSide++) {

            let ActualSide;

            if (currentSide == this.inDoor || currentSide == this.outDoor) {

                ActualSide = new Door({
                    x: this.size.x, y: this.size.y,
                    z: this.size.z, containsLight: this.containsLight
                }).GetDoor();
            }

            else ActualSide = this.side.clone();

            ActualSide.position.x = (this.radius / 2 * Math.sqrt(3)) / 2 * Math.cos(Math.PI / 3 * currentSide);
            ActualSide.position.z = (this.radius / 2 * Math.sqrt(3)) / 2 * Math.sin(Math.PI / 3 * currentSide);
            ActualSide.lookAt(this.container.position);
            ActualSide.name = Settings.CollisionName;

            this.container.add(ActualSide);
        }

        this.InitializeHexagonFloor();

        this.container.position.x = -this.row * (this.radius - this.size.z * 2);
        this.container.position.z = this.col * (this.radius - this.size.x / 2);

        if (this.col % 2 != 0) this.container.position.x -= (this.radius / 2 - this.size.z);
    }

    InitializeHexagonFloor() {
        this.floorGeometry = new THREE.CylinderGeometry(this.size.x, this.size.z, 1, Sides);
        this.floor = new THREE.Mesh(this.floorGeometry, this.hexagonMaterial);

        this.floor.position.y -= this.size.y / 2;
        this.container.add(this.floor);
    }

    GetHexagon() {
        return this.container;
    }
}