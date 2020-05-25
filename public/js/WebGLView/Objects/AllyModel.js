class AllyModel {
    constructor({ allyModelName = "" } = {}) {

        this.allyModelName = allyModelName;
        this.container = new THREE.Object3D();
        this.mixer = null;
        this.clock = new THREE.Clock();
    }

    InitializeModel(url, radius, callback) {

        const Loader = new THREE.JSONLoader();
        const ModelSize = radius * 0.005;

        Loader.load(url, (geometry) => {
            this.model = new THREE.Mesh(geometry, Settings.BasicAllyModelMaterial);

            this.model.lookAt(this.container.position);
            this.model.scale.set(ModelSize, ModelSize, ModelSize);

            this.container.add(this.model);
            this.mixer = new THREE.AnimationMixer(this.model);

            this.SetModelAnimation({ animationName: "Stand" });

            callback(this.container);
        })
    }

    UpdateModelMixer() {
        const ClockDelta = this.clock.getDelta();

        if (this.mixer) this.mixer.update(ClockDelta);
    }

    SetModelAnimation({ animationName = "" } = {}) {
        this.mixer.clipAction(animationName).play();
    }

    GetModelContainer() {
        return this.container;
    }

    GetModelObject() {
        return this.model;
    }
}