class Door {
    constructor({ x = 0, y = 0, z = 0, containsLight = false } = {}) {

        this.doorContainer = new THREE.Object3D();
        this.size = { x: x, y: y, z: z };
        this.containsLight = containsLight;

        this.InitializeDoor();
    }

    InitializeDoor() {
        this.doorGeometry = new THREE.BoxGeometry(this.size.x / 3, this.size.y, this.size.z);
        this.doorMaterial = this.containsLight ? Settings.PhongMaterial : Settings.BasicMaterial;

        this.oneSide = new THREE.Mesh(this.doorGeometry, this.doorMaterial);
        this.oneSide.position.x = this.size.x / 3;

        this.secondSide = this.oneSide.clone();
        this.secondSide.position.x = -this.size.x / 3;

        this.doorContainer.add(this.oneSide);
        this.doorContainer.add(this.secondSide);
    }

    GetDoor() {
        return this.doorContainer;
    }
}