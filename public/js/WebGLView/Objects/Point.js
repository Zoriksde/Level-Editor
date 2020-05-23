const PointSize = 30;

class Point {
    constructor({pointName = ""} = {}) {

        this.pointName = pointName;

        this.InitializePoint();
    }

    InitializePoint() {
        this.pointGeometry = new THREE.BoxGeometry(PointSize,
            PointSize, PointSize);

        this.point = new THREE.Mesh(this.pointGeometry, Settings.BasicPointMaterial);
        this.point.position.y = Settings.PlayerSize;
    }

    GetPoint() {
        return this.point;
    }
}