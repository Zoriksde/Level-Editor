class Player {
    constructor({ playerName = "" } = {}) {
        this.playerName = playerName;

        this.container = new THREE.Object3D();

        this.InitializePlayer();
    }

    InitializePlayer() {
        this.playerGeometry = new THREE.BoxGeometry(Settings.PlayerSize,
            Settings.PlayerSize, Settings.PlayerSize);

        this.player = new THREE.Mesh(this.playerGeometry, Settings.BasicPlayerMaterial);
        this.player.lookAt(this.container.position);

        this.axes = new THREE.AxesHelper(Settings.PlayerSize * 3);
        this.axes.lookAt(this.container.position);

        this.container.add(this.player);
        this.container.add(this.axes);
        this.container.position.y = Settings.PlayerSize;
    }

    GetPlayerContainer() {
        return this.container;
    }

    GetPlayerObject() {
        return this.player;
    }

    GetAxesObject() {
        return this.axes;
    }
}