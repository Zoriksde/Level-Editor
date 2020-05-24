const _Player = new Player({ playerName: "Player" });
const _Plane = new Plane({ planeName: "Plane" });
const _Point = new Point({ pointName: "Point" });
const _Ally = new Ally({ allyName: "Ally" });

const ActualSpeed = 12;

let MovingObject = false;
let MovingAlly = false;
let IntegratedAlly = false;

let ClickedVector = new THREE.Vector3(0, 0, 0);
let DestinationVector = new THREE.Vector3(0, 0, 0);
let AllyDestinationVector = new THREE.Vector3(0, 0, 0);

$(document).ready(() => {

    const _WebGLCreator = new WebGLCreator({ creatorName: "WebGL" });
    const _WebGLScene = _WebGLCreator.GetScene();
    const _WebGLCamera = _WebGLCreator.GetCamera();
    const _WebGLRenderer = _WebGLCreator.GetRenderer();

    Render({ renderer: _WebGLRenderer, scene: _WebGLScene, camera: _WebGLCamera });

    _WebGLScene.add(_Player.GetPlayerContainer());
    _WebGLScene.add(_Plane.GetPlane());
    _WebGLScene.add(_Point.GetPoint());
    _WebGLScene.add(_Ally.GetAllyContainer());

    const DefaultPosition = _Player.GetPlayerContainer().position;

    _WebGLCamera.position.set(0, DefaultPosition.y + Settings.CameraOffset.y, DefaultPosition.z + Settings.CameraOffset.z);
    _WebGLCamera.lookAt(_Player.GetPlayerContainer().position);

    CreatePlayerRaycaster({
        scene: _WebGLScene, camera: _WebGLCamera,
        renderer: _WebGLRenderer, creator: _WebGLCreator
    });
})

const CreatePlayerRaycaster = ({ scene = null, camera = null, renderer = null, creator = null } = {}) => {
    if (!scene instanceof THREE.Scene || !camera instanceof THREE.PerspectiveCamera
        || !renderer instanceof THREE.WebGLRenderer || !creator instanceof WebGLCreator) return;

    const PlayerRaycaster = new THREE.Raycaster();
    const MousePosition = new THREE.Vector2();

    $('#MainWebGLRoot').on('mousedown', (ev) => {

        MousePosition.x = (ev.offsetX / renderer.domElement.width) * 2 - 1;
        MousePosition.y = -(ev.offsetY / renderer.domElement.height) * 2 + 1;

        PlayerRaycaster.setFromCamera(MousePosition, camera);
        const Intersects = PlayerRaycaster.intersectObjects(scene.children, true);

        if (Intersects.length > 0) {

            if (Intersects[0].object.name == Settings.AllyName) {
                if (MovingObject) {

                    SetModalMessage({
                        title: "Error 0x783", message: `
                    Cannot Initialize Ally while Player is moving forward !\n
                    You need to wait, until player stops moving though ! \n
                    0x783`, imageURL: '/gfx/error0x783.png'
                    });
                    return;
                }

                if (IntegratedAlly) {
                    SetModalMessage({
                        title: "Error 0x784", message: `
                    This Ally has been integrated yet correctly ! \n
                    You cannot integrate same ally more than once ! \n
                    0x784`, imageURL: '/gfx/error0x784.png'
                    });
                    return;
                }

                SetNewAlly();
            }
            else {
                if (MovingAlly) {

                    SetModalMessage({
                        title: "Error 0x782", message: `
                    Cannot Initialize Player while Ally is moving forward !\n
                    You need to wait, until ally stops moving though ! \n
                    0x782`, imageURL: '/gfx/error0x782.png'
                    });
                    return;
                }

                SetPlayerMovement({ intersects: Intersects });
            }
        }
    })
}

const SetActualPoint = ({ position = 0 } = {}) => {
    if (!position instanceof THREE.Vector3) return;

    _Point.GetPoint().position.x = position.x;
    _Point.GetPoint().position.y = Settings.PlayerSize * 2;
    _Point.GetPoint().position.z = position.z;
}

const Render = ({ renderer = null, scene = null, camera = null } = {}) => {
    if (!renderer instanceof THREE.WebGLRenderer || !scene instanceof THREE.Scene
        || !camera instanceof THREE.PerspectiveCamera) return;

    if (MovingAlly) {

        const AllyContainer = _Ally.GetAllyContainer();
        const ActualDistance = AllyContainer.position.clone()
            .distanceTo(_Player.GetPlayerContainer().position);

        if (ActualDistance < Settings.PlayerSize * 1.5) {
            MovingAlly = false;
            IntegratedAlly = true;
        }

        AllyContainer.translateOnAxis(AllyDestinationVector, ActualSpeed);
    }

    if (MovingObject) {

        const PlayerContainer = _Player.GetPlayerContainer();
        const ActualDistance = PlayerContainer.position.clone().distanceTo(ClickedVector);

        if (ActualDistance < Settings.PlayerSize / 8) MovingObject = false;

        PlayerContainer.translateOnAxis(DestinationVector, ActualSpeed);
        _Point.GetPoint().rotation.y += 0.05;

        if (IntegratedAlly) {
            const UpdatedPlayerPosition = PlayerContainer.position.clone()
                .sub(_Ally.GetAllyContainer().position).normalize();

            _Ally.GetAllyContainer().translateOnAxis(UpdatedPlayerPosition, ActualSpeed);
        }

        camera.position.x = PlayerContainer.position.x;
        camera.position.y = PlayerContainer.position.y + Settings.CameraOffset.y;
        camera.position.z = PlayerContainer.position.z + Settings.CameraOffset.z;

        camera.lookAt(PlayerContainer.position);

        SetOptionsView({ distance: ActualDistance });
    }

    renderer.render(scene, camera);
    requestAnimationFrame(Render.bind(null, { renderer: renderer, scene: scene, camera: camera }));
}


const SetOptionsView = ({ distance = null } = {}) => {
    if (distance == null) return;

    const PlayerContainer = _Player.GetPlayerContainer();
    const PositionX = Math.round(PlayerContainer.position.x, 2);
    const PositionY = Math.round(PlayerContainer.position.y, 2);
    const PositionZ = Math.round(PlayerContainer.position.z, 2);

    if (distance < Settings.PlayerSize / 8) distance = 0;

    $('#PlayerPosition').val(`Me: ( X: ${PositionX} Y: ${PositionY} Z: ${PositionZ} )`);
    $('#ActualDistance').val(`Distance: (${Math.round(distance, 2)})`);
}

const SetNewAlly = () => {
    const SourceVector = _Player.GetPlayerContainer().position;

    AllyDestinationVector = SourceVector.clone()
        .sub(_Ally.GetAllyContainer().position).normalize();

    const AllyRotation = Math.atan2(
        _Ally.GetAllyContainer().position.clone().x - SourceVector.x,
        _Ally.GetAllyContainer().position.clone().z - SourceVector.z
    );

    _Ally.GetAllyObject().rotation.y = AllyRotation + Math.PI;
    _Ally.GetAxesObject().rotation.y = AllyRotation + Math.PI;

    MovingAlly = true;
}

const SetPlayerMovement = ({ intersects = null } = {}) => {
    if (!intersects instanceof Array) return;

    ClickedVector = intersects[0].point;
    ClickedVector.y = Settings.PlayerSize;

    DestinationVector = ClickedVector.clone()
        .sub(_Player.GetPlayerContainer().position).normalize();

    const PlayerRotation = Math.atan2(
        _Player.GetPlayerContainer().position.clone().x - ClickedVector.x,
        _Player.GetPlayerContainer().position.clone().z - ClickedVector.z
    );

    _Player.GetPlayerObject().rotation.y = PlayerRotation + Math.PI;
    _Player.GetAxesObject().rotation.y = PlayerRotation + Math.PI;

    SetActualPoint({ position: ClickedVector });

    MovingObject = true;
}

const SetModalMessage = ({ title = "", message = "", imageURL = "" } = {}) => {

    $('#ModalMessageTitle').html(title);
    $('#ModalMessageDescription').html(message);
    $('#ModalMessageImage').attr('src', imageURL);

    $('#ModalMessage').modal('show');
}