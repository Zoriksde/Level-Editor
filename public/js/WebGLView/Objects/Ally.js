class Ally {
    constructor({ allyName = "" } = {}) {
        this.allyName = allyName;

        this.container = new THREE.Object3D();

        this.InitializeAlly();
    }

    InitializeAlly() {
        this.allyGeometry = new THREE.SphereGeometry(Settings.AllyRadius,
            Settings.AllySegments, Settings.AllySegments);

        this.ally = new THREE.Mesh(this.allyGeometry, Settings.BasicAllyMaterial);
        this.ally.lookAt(this.container.position);

        this.ally.name = Settings.AllyName;

        this.axes = new THREE.AxesHelper(Settings.AllyRadius * 3);
        this.axes.lookAt(this.container.position);

        this.container.add(this.ally);
        this.container.add(this.axes);

        this.container.position.y = Settings.AllyRadius;
        this.container.position.x = GenerateRandomAllyPosition();
        this.container.position.z = GenerateRandomAllyPosition();
    }

    GetAllyContainer() {
        return this.container;
    }

    GetAllyObject() {
        return this.ally;
    }

    GetAxesObject() {
        return this.axes;
    }
}

const GenerateRandomAllyPosition = () => {
    return Math.random() * (Settings.PlaneSize - 100) - (Settings.PlaneSize - 100) / 2;
}