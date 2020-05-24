const _Connection = new Connection({ connectionName: "ConnectionToServer" });
const Types = ["Wall", "Enemy", "Treasure", "Light"];
const Lights = [];
const _Model = new Model({ modelName: "Model" });
const _Clock = new THREE.Clock();

let MovingObject = false;

let ClickedVector = new THREE.Vector3(0, 0, 0);
let DestinationVector = new THREE.Vector3(0, 0, 0);

$(document).ready(() => {
    const _WebGLCreator = new WebGLCreator({ creatorName: "WebGL" });
    const _WebGLScene = _WebGLCreator.GetScene();
    const _WebGLCamera = _WebGLCreator.GetCamera();
    const _WebGLRenderer = _WebGLCreator.GetRenderer();

    _Connection.GetLevelInfoData({ scene: _WebGLScene });

    Render({ renderer: _WebGLRenderer, scene: _WebGLScene, camera: _WebGLCamera });

    InitializeLightIntensityRange();
    InitializeLightPositionRange();
    InitializeModel({ scene: _WebGLScene, camera: _WebGLCamera });

    CreateModelRaycaster({
        scene: _WebGLScene, camera: _WebGLCamera,
        renderer: _WebGLRenderer, creator: _WebGLCreator
    });
})

const DrawActualLevel = ({ data = null, scene = null } = {}) => {
    if (!data instanceof Array || !scene instanceof THREE.Scene) return;

    const LevelInfo = data.Level;

    LevelInfo.forEach((object) => {
        CreateHexagon({
            row: object.row, col: object.col, currentType: object.currentType,
            outDoor: object.outDirection, inDoor: object.inDirection, scene: scene
        });
    })
}

const CreateHexagon = ({ row = 0, col = 0, currentType = "", outDoor = 0, inDoor = 0, scene = null } = {}) => {
    if (!scene instanceof THREE.Scene);

    let _Hexagon;

    if (currentType == Types[0]) {
        _Hexagon = new Wall({ hexagonName: "Wall" }, {
            radius: 50, row: row, col: col,
            inDoor: inDoor, outDoor: outDoor, containsLight: true
        });
    }
    else if (currentType == Types[1]) {
        _Hexagon = new Enemy({ hexagonName: "Enemy" }, {
            radius: 50, row: row, col: col,
            inDoor: inDoor, outDoor: outDoor, containsLight: true
        });
    }
    else if (currentType == Types[2]) {
        _Hexagon = new Treasure({ hexagonName: "Treasure" }, {
            radius: 50, row: row, col: col,
            inDoor: inDoor, outDoor: outDoor, containsLight: true
        });
    }
    else if (currentType == Types[3]) {
        _Hexagon = new Light({ hexagonName: "Light" }, {
            radius: 50, row: row, col: col,
            inDoor: inDoor, outDoor: outDoor, containsLight: true
        });

        Lights.push(_Hexagon);
    }

    scene.add(_Hexagon.GetHexagon());
}

const InitializeLightIntensityRange = () => {
    $('#LightIntensityRange').on('input', (ev) => {

        const IntensityValue = $('#LightIntensityRange').val();

        Lights.forEach((light) => light.ChangeIntensity({ intensity: IntensityValue }));
        $('#LightIntensity').val(`Intensity: ${IntensityValue}`);
    })
}

const InitializeLightPositionRange = () => {
    $('#LightPositionRange').on('input', (ev) => {

        const PositionValue = $('#LightPositionRange').val();

        Lights.forEach((light) => light.ChangePosition({ position: PositionValue }));
        $('#LightPosition').val(`Position: ${PositionValue}`);
    })
}

const InitializeModel = ({ scene = null, camera = null } = {}) => {
    if (!scene instanceof THREE.Scene || !camera instanceof THREE.PerspectiveCamera) return;

    _Model.InitializeModel('/data/model.json', (model) => {
        scene.add(model);

        camera.position.x = model.position.x + Settings.ModelCameraOffset.x;
        camera.position.y = model.position.y + Settings.ModelCameraOffset.y;
        camera.position.z = model.position.z + Settings.ModelCameraOffset.z;

        camera.lookAt(model.position);
    });
}

const CreateModelRaycaster = ({ scene = null, camera = null, renderer = null, creator = null } = {}) => {
    if (!scene instanceof THREE.Scene || !camera instanceof THREE.PerspectiveCamera
        || !renderer instanceof THREE.WebGLRenderer || !creator instanceof WebGLCreator) return;

    const ModelRaycaster = new THREE.Raycaster();
    const MousePosition = new THREE.Vector3();

    $('#MainWebGLRoot').on('mousedown', (ev) => {

        MousePosition.x = (ev.offsetX / renderer.domElement.width) * 2 - 1;
        MousePosition.y = -(ev.offsetY / renderer.domElement.height) * 2 + 1;

        ModelRaycaster.setFromCamera(MousePosition, camera);
        const Intersects = ModelRaycaster.intersectObjects(scene.children, true);

        if (Intersects.length > 0) {

            ClickedVector = Intersects[0].point;
            ClickedVector.y = _Model.GetModelContainer().scale.y;

            DestinationVector = ClickedVector.clone()
                .sub(_Model.GetModelContainer().position).normalize();

            const ModelRotation = Math.atan2(
                _Model.GetModelContainer().position.clone().x - ClickedVector.x,
                _Model.GetModelContainer().position.clone().z - ClickedVector.z
            );

            _Model.GetModelObject().rotation.y = ModelRotation - Math.PI / 2;
            _Model.SetModelAnimation({ animationName: "run" });

            MovingObject = true;
        }
    })
}

const Render = ({ renderer = null, scene = null, camera = null } = {}) => {
    if (!renderer instanceof THREE.WebGLRenderer || !scene instanceof THREE.Scene
        || !camera instanceof THREE.PerspectiveCamera) return;

    if (MovingObject) {

        const ModelContainer = _Model.GetModelContainer();
        const ActualDistance = ModelContainer.position.clone().distanceTo(ClickedVector);
        const ClockDelta = _Clock.getDelta();

        _Model.UpdateModelMixer(ClockDelta);

        if (ActualDistance < Settings.ModelSizeZ / 8) MovingObject = false;

        ModelContainer.translateOnAxis(DestinationVector, 0.3);

        camera.position.x = ModelContainer.position.x + Settings.ModelCameraOffset.x;
        camera.position.y = ModelContainer.position.y + Settings.ModelCameraOffset.y;
        camera.position.z = ModelContainer.position.z + Settings.ModelCameraOffset.z;

        camera.lookAt(ModelContainer.position);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(Render.bind(null, { renderer: renderer, scene: scene, camera: camera }));
}