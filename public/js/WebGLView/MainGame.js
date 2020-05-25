const _Connection = new Connection({ connectionName: "ConnectionToServer" });
const Types = ["Wall", "Enemy", "Treasure", "Light"];
const Lights = [];
const AllAllies = [];
const IntegratedAllies = [];
const IntegratedObjects = [];

const _Model = new Model({ modelName: "Model" });
const _Clock = new THREE.Clock();
const _Ring = new Ring({ ringName: "Ring" });
const ActualSpeed = 0.5;

let MovingObject = false;
let RotatingRing = false;
let MovingAlly = false;

let ClickedVector = new THREE.Vector3(0, 0, 0);
let DestinationVector = new THREE.Vector3(0, 0, 0);
let AllyDestinationVector = new THREE.Vector3(0, 0, 0);
let SourceVector = new THREE.Vector3(0, 0, 0);

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

        AllAllies.push(_Hexagon.GetAllyObject());
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

    _Model.InitializeModel('/data/spider.json', (model) => {
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

    $('#MainWebGLRoot').on('mousemove', (ev) => {

        MousePosition.x = (ev.offsetX / renderer.domElement.width) * 2 - 1;
        MousePosition.y = -(ev.offsetY / renderer.domElement.height) * 2 + 1;

        ModelRaycaster.setFromCamera(MousePosition, camera);
        const Intersects = ModelRaycaster.intersectObjects(scene.children, true);

        if (Intersects.length > 0) {
            const FirstObject = Intersects[0].object;

            if (FirstObject.name == Settings.AllyModelName && !IntegratedObjects.includes(FirstObject))
                DisplayCurrentRing({ object: FirstObject.parent, scene: scene });
            else
                HideCurrentRing({ scene: scene });
        }
    })

    $('#MainWebGLRoot').on('mousedown', (ev) => {

        MousePosition.x = (ev.offsetX / renderer.domElement.width) * 2 - 1;
        MousePosition.y = -(ev.offsetY / renderer.domElement.height) * 2 + 1;

        ModelRaycaster.setFromCamera(MousePosition, camera);
        const Intersects = ModelRaycaster.intersectObjects(scene.children, true);

        if (Intersects.length > 0) {
            const FirstObject = Intersects[0].object;

            if (FirstObject.name == Settings.AllyModelName) {

                if (MovingObject) {

                    SetModalMessage({
                        title: "Error 0x983", message: `
                    Cannot Initialize Ally while Player is moving forward !\n
                    You need to wait, until player stops moving though ! \n
                    0x983`, imageURL: '/gfx/Errors/error0x983.png'
                    });
                    return;
                }

                if (IntegratedObjects.includes(FirstObject)) {

                    SetModalMessage({
                        title: "Error 0x784", message: `
                    This Ally has been integrated yet correctly ! \n
                    You cannot integrate same ally more than once ! \n
                    0x784`, imageURL: '/gfx/Errors/error0x984.png'
                    });

                    return;
                }

                SetNewAlly({ clickedObject: FirstObject });
            }
            else {
                if (MovingAlly) {

                    SetModalMessage({
                        title: "Error 0x982", message: `
                    Cannot Initialize Player while Ally is moving forward !\n
                    You need to wait, until ally stops moving though ! \n
                    0x982`, imageURL: '/gfx/Errors/error0x982.png'
                    });
                    return;
                }

                SetPlayerMovement({ intersects: Intersects });
            }
        }
    })
}

const Render = ({ renderer = null, scene = null, camera = null } = {}) => {
    if (!renderer instanceof THREE.WebGLRenderer || !scene instanceof THREE.Scene
        || !camera instanceof THREE.PerspectiveCamera) return;

    const ClockDelta = _Clock.getDelta();
    _Model.UpdateModelMixer(ClockDelta);

    if (MovingObject) {

        const ModelContainer = _Model.GetModelContainer();
        const ActualDistance = ModelContainer.position.clone().distanceTo(ClickedVector);

        if (ActualDistance < Settings.ModelSizeZ / 8) {
            MovingObject = false;
            _Model.SetModelAnimation({ animationName: "Stand" });
        }

        ModelContainer.translateOnAxis(DestinationVector, ActualSpeed);

        if (IntegratedAllies.length > 0) {

            IntegratedAllies.forEach((integratedAlly) => {

                const UpdatedPlayerPosition = ModelContainer.position.clone()
                    .sub(integratedAlly.GetModelContainer().getWorldPosition()).normalize();

                integratedAlly.GetModelContainer().translateOnAxis(UpdatedPlayerPosition, ActualSpeed);
            })
        }

        camera.position.x = ModelContainer.position.x + Settings.ModelCameraOffset.x;
        camera.position.y = ModelContainer.position.y + Settings.ModelCameraOffset.y;
        camera.position.z = ModelContainer.position.z + Settings.ModelCameraOffset.z;

        camera.lookAt(ModelContainer.position);
    }

    if (RotatingRing) _Ring.rotation.z += 0.02;

    AllAllies.forEach((object) => {
        object.UpdateModelMixer();
    })

    if (MovingAlly) {

        const Model = IntegratedAllies[IntegratedAllies.length - 1];
        const ActualDistance = Model.GetModelContainer().getWorldPosition().clone().distanceTo(ClickedVector);

        if (ActualDistance < Settings.ModelSizeZ) {
            MovingAlly = false;
            Model.SetModelAnimation({ animationName: "Stand" });
        }

        Model.GetModelContainer().translateOnAxis(AllyDestinationVector, ActualSpeed);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(Render.bind(null, { renderer: renderer, scene: scene, camera: camera }));
}

const DisplayCurrentRing = ({ object = null, scene = null } = {}) => {
    if (!object instanceof THREE.Object3D || !scene instanceof THREE.Scene) return;

    RotatingRing = true;

    _Ring.position.x = object.getWorldPosition().x;
    _Ring.position.z = object.getWorldPosition().z;

    scene.add(_Ring);
}

const HideCurrentRing = ({ scene = null } = {}) => {
    if (!scene instanceof THREE.Scene) return;

    RotatingRing = false;
    scene.remove(_Ring);
}

const SetNewAlly = ({ clickedObject = null } = {}) => {
    if (!clickedObject instanceof THREE.Object3D) return;

    SourceVector = _Model.GetModelContainer().getWorldPosition();

    AllyDestinationVector = SourceVector.clone()
        .sub(clickedObject.getWorldPosition()).normalize();

    AllAllies.forEach((ally) => {
        if (ally.GetModelObject() == clickedObject) {

            const AllyModelRotation = Math.atan2(
                clickedObject.getWorldPosition().clone().x - SourceVector.x,
                clickedObject.getWorldPosition().clone().z - SourceVector.z
            );

            clickedObject.rotation.y = AllyModelRotation - Math.PI / 2;
            ally.SetModelAnimation({ animationName: "run" });

            IntegratedAllies.push(ally);
            IntegratedObjects.push(clickedObject);
            MovingAlly = true;

            return;
        }
    })
}

const SetPlayerMovement = ({ intersects = null } = {}) => {
    if (!intersects instanceof Array) return;

    ClickedVector = intersects[0].point;
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

const SetModalMessage = ({ title = "", message = "", imageURL = "" } = {}) => {

    $('#ModalMessageTitle').html(title);
    $('#ModalMessageDescription').html(message);
    $('#ModalMessageImage').attr('src', imageURL);

    $('#ModalMessage').modal('show');
}