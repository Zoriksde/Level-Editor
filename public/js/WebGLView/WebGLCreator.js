class WebGLCreator {
    constructor({ creatorName = "", enableOrbitControles = true } = {}) {
        this.creatorName = creatorName;

        this.documentWidth = $(document).width() - $("#MainWebGLRoot").offset().left - 10;
        this.documentHeight = $(document).height() - $("#MainWebGLRoot").offset().top - 10;

        this.moving = false;
        this.actualSpeed = 3;

        this.CreateWebGLContext({ enableControls: enableOrbitControles });
    }

    CreateWebGLContext({ enableControls = true } = {}) {
        this.mainScene = new THREE.Scene();
        this.mainCamera = new THREE.PerspectiveCamera(45, this.documentWidth / this.documentHeight,
            0.1, 10000);

        this.mainRenderer = new THREE.WebGLRenderer();

        this.mainRenderer.setClearColor(0xffffff);
        this.mainRenderer.setSize(this.documentWidth, this.documentHeight);

        this.mainCamera.position.set(100, 100, 100);
        this.mainCamera.lookAt(this.mainScene.position);

        if (enableControls) {
            this.orbitControl = new THREE.OrbitControls(this.mainCamera, this.mainRenderer.domElement);

            this.orbitControl.addEventListener('change', () => {
                this.mainRenderer.render(this.mainScene, this.mainCamera)
            });
        }

        $("#MainWebGLRoot").append(this.mainRenderer.domElement);
    }

    SetMovingObject({ object = null, destinationVector = 0, clickedVector = 0, point = null,
        optionsView = false, isModel = false } = {}) {

        if (object == null || !destinationVector instanceof THREE.Vector3
            || !clickedVector instanceof THREE.Vector3) return;

        this.moving = true;
        this.movingObject = object;
        this.destinationVector = destinationVector;
        this.clickedVector = clickedVector;
        this.destinationPoint = point;
        this.optionsView = optionsView;
        this.isModel = isModel;
    }

    GetScene() {
        return this.mainScene;
    }

    GetCamera() {
        return this.mainCamera;
    }

    GetRenderer() {
        return this.mainRenderer;
    }

    Render() {

        if (this.moving) {
            const ActualDistance = this.movingObject.position.clone().distanceTo(this.clickedVector);

            if (ActualDistance < Settings.PlayerSize / 8) this.moving = false;

            this.movingObject.translateOnAxis(this.destinationVector, this.actualSpeed);

            if (!this.isModel) this.UpdatePlayerCamera();
            else this.UpdateModelCamera();

            this.mainCamera.lookAt(this.movingObject.position);

            if (this.destinationPoint)
                this.destinationPoint.GetPoint().rotation.y += 0.05;

            if (this.optionsView)
                this.SetOptionsView({ distance: ActualDistance });
        }

        this.mainRenderer.render(this.mainScene, this.mainCamera);
        requestAnimationFrame(this.Render.bind(this));
    }

    UpdatePlayerCamera() {
        this.mainCamera.position.x = this.movingObject.position.x;
        this.mainCamera.position.y = this.movingObject.position.y + Settings.CameraOffset.y;
        this.mainCamera.position.z = this.movingObject.position.z + Settings.CameraOffset.z;
    }

    UpdateModelCamera() {
        this.mainCamera.position.x = this.movingObject.position.x + Settings.ModelCameraOffset.xz;
        this.mainCamera.position.y = this.movingObject.position.y + Settings.ModelCameraOffset.y;
        this.mainCamera.position.z = this.movingObject.position.z + Settings.ModelCameraOffset.xz;
    }

    SetOptionsView({ distance = null } = {}) {
        if (distance == null) return;

        const PositionX = Math.round(this.movingObject.position.x, 2);
        const PositionY = Math.round(this.movingObject.position.y, 2);
        const PositionZ = Math.round(this.movingObject.position.z, 2);

        if (distance < Settings.PlayerSize / 8) distance = 0;

        $('#PlayerPosition').val(`Me: ( X: ${PositionX} Y: ${PositionY} Z: ${PositionZ} )`);
        $('#ActualDistance').val(`Distance: (${Math.round(distance, 2)})`);
    }
}