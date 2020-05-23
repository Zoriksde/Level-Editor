class Light extends Hexagon {
    constructor({ hexagonName = "" }, { radius = 0, row = 0, col = 0, inDoor = 0,
        outDoor = 0, containsLight = false } = {}) {

        super({ hexagonName: hexagonName }, {
            radius: radius, row: row, col: col, inDoor: inDoor,
            outDoor: outDoor, containsLight: containsLight
        });

        this.lightContainer = new THREE.Object3D();
        this.lightBoxSize = this.radius / 10;

        this.lightIntensity = 1;
        this.lightPositionY = 4;

        this.InitLight();
    }

    InitLight() {
        this.pointLight = new THREE.PointLight(Settings.LightColor, this.lightIntensity);
        this.pointLight.position.set(0, this.lightPositionY, 0);
        this.pointLight.lookAt(this.lightContainer.position);

        this.lightContainer.add(this.pointLight);

        this.lightBoxGeometry = new THREE.BoxGeometry(this.lightBoxSize,
            this.lightBoxSize, this.lightBoxSize);

        this.light = new THREE.Mesh(this.lightBoxGeometry, Settings.LightMaterial);
        this.light.lookAt(this.lightContainer.position);

        this.light.position.y = this.lightPositionY;
        this.lightContainer.add(this.light);

        this.container.add(this.lightContainer);
    }

    ChangeIntensity({ intensity = 0 } = {}) {
        this.lightIntensity = intensity;
        this.pointLight.intensity = intensity;
    }

    ChangePosition({ position = 0 } = {}) {
        this.lightPositionY = position;
        this.pointLight.position.y = position;
        this.light.position.y = position;
    }
}