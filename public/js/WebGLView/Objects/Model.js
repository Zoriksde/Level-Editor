class Model {
    constructor({ modelName = "" } = {}) {

        this.modelName = modelName;
        this.container = new THREE.Object3D();
        this.mixer = null;
    }

    InitializeModel(url, callback) {

        const Loader = new THREE.JSONLoader();

        Loader.load(url, (geometry) => {
            this.model = new THREE.Mesh(geometry, Settings.BasicModelMaterial);

            this.model.scale.set(0.25, 0.25, 0.25);

            this.model.lookAt(this.container.position);
            this.container.add(this.model);

            const ModelBox = new THREE.Box3().setFromObject(this.container);
            Settings.ModelSizeZ = ModelBox.getSize().z;

            this.mixer = new THREE.AnimationMixer(this.model);
            this.SetModelAnimation({ animationName: "Stand" });

            callback(this.container);
        })
    }

    UpdateModelMixer(delta) {
        if (this.mixer) this.mixer.update(delta);
    }

    SetModelAnimation({ animationName = "" } = {}) {
        if (this.mixer) {
            this.mixer.uncacheRoot(this.model);
            this.mixer.clipAction(animationName).play();
        }
    }

    GetModelContainer() {
        return this.container;
    }

    GetModelObject() {
        return this.model;
    }
}