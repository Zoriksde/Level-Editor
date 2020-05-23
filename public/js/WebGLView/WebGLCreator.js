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

    SetMovingObject({ object = null, destinationVector, clickedVector, point } = {}) {
        if (object == null || !destinationVector instanceof THREE.Vector3
            || !clickedVector instanceof THREE.Vector3 || !point instanceof Point) return;

        this.moving = true;
        this.movingObject = object;
        this.destinationVector = destinationVector;
        this.clickedVector = clickedVector;
        this.destinationPoint = point;
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
            const MovingObject = this.movingObject.GetPlayerContainer();
            const ActualDistance = MovingObject.position.clone().distanceTo(this.clickedVector);

            if (ActualDistance < Settings.PlayerSize / 8) this.moving = false;

            MovingObject.translateOnAxis(this.destinationVector, this.actualSpeed);

            this.mainCamera.position.x = MovingObject.position.x;
            this.mainCamera.position.y = MovingObject.position.y + Settings.CameraOffset.y;
            this.mainCamera.position.z = MovingObject.position.z + Settings.CameraOffset.z;

            this.mainCamera.lookAt(MovingObject.position);

            this.destinationPoint.GetPoint().rotation.y += 0.05;

            this.SetOptionsView({ element: MovingObject, distance: ActualDistance });
        }

        this.mainRenderer.render(this.mainScene, this.mainCamera);
        requestAnimationFrame(this.Render.bind(this));
    }

    SetOptionsView({ element = null, distance = null } = {}) {
        if (!element instanceof Player || distance == null) return;

        const PositionX = Math.round(element.position.x, 2);
        const PositionY = Math.round(element.position.y, 2);
        const PositionZ = Math.round(element.position.z, 2);

        if (distance < Settings.PlayerSize / 8) distance = 0;

        $('#PlayerPosition').val(`Me: ( X: ${PositionX} Y: ${PositionY} Z: ${PositionZ} )`);
        $('#ActualDistance').val(`Distance: (${Math.round(distance, 2)})`);
    }
}