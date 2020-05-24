class WebGLCreator {
    constructor({ creatorName = "" } = {}) {
        this.creatorName = creatorName;

        this.documentWidth = $(document).width() - $("#MainWebGLRoot").offset().left - 10;
        this.documentHeight = $(document).height() - $("#MainWebGLRoot").offset().top - 10;

        this.moving = false;
        this.actualSpeed = 3;

        this.CreateWebGLContext();
    }

    CreateWebGLContext() {
        this.mainScene = new THREE.Scene();
        this.mainCamera = new THREE.PerspectiveCamera(45, this.documentWidth / this.documentHeight,
            0.1, 10000);

        this.mainRenderer = new THREE.WebGLRenderer();

        this.mainRenderer.setClearColor(0xffffff);
        this.mainRenderer.setSize(this.documentWidth, this.documentHeight);

        this.mainCamera.position.set(100, 100, 100);
        this.mainCamera.lookAt(this.mainScene.position);

        $("#MainWebGLRoot").append(this.mainRenderer.domElement);
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
}