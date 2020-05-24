class Model {
    constructor({ modelName = "" } = {}) {

        this.modelName = modelName;
        this.container = new THREE.Object3D();
    }

    InitializeModel(url, callback) {

        const Loader = new THREE.JSONLoader();

        Loader.load(url, (geometry) => {
            const ModelMesh = new THREE.Mesh(geometry, Settings.BasicModelMaterial);

            ModelMesh.scale.set(0.35, 0.35, 0.35);
            this.container.add(ModelMesh);

            callback(this.container);
        })
    }

    GetModelContainer() {
        return this.container;
    }
}