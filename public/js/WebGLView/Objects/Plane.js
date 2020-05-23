const PlaneSize = 2200;

class Plane {
    constructor({ planeName = "" } = {}) {

        this.planeName = planeName;

        this.InitializePlane();
    }

    InitializePlane() {
        this.planeGeometry = new THREE.PlaneGeometry(PlaneSize, PlaneSize, 1);
        this.plane = new THREE.Mesh(this.planeGeometry, Settings.BasicPlaneMaterial);
        this.plane.rotation.x = -Math.PI / 2;
    }

    GetPlane() {
        return this.plane;
    }
}