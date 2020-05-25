class Ring extends THREE.Mesh {
    constructor({ ringName = "" } = {}) {

        super(new THREE.RingGeometry(Settings.RingInnerRadius, Settings.RingOuterRadius,
            Settings.RingSegments), Settings.BasicRingMaterial);

        this.ringName = ringName;
        this.rotation.x = Math.PI / 2;
    }
}