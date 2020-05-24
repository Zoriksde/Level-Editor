const _Player = new Player({ playerName: "Player" });
const _Plane = new Plane({ planeName: "Plane" });
const _Point = new Point({ pointName: "Point" });

let ActualMoves = 0;
let MovingObject = false;
let ActualSpeed = 3;

let ClickedVector = new THREE.Vector3(0, 0, 0);
let DestinationVector = new THREE.Vector3(0, 0, 0);

$(document).ready(() => {

    const _WebGLCreator = new WebGLCreator({ creatorName: "WebGL" });
    const _WebGLScene = _WebGLCreator.GetScene();
    const _WebGLCamera = _WebGLCreator.GetCamera();
    const _WebGLRenderer = _WebGLCreator.GetRenderer();

    Render({ renderer: _WebGLRenderer, scene: _WebGLScene, camera: _WebGLCamera });

    _WebGLScene.add(_Player.GetPlayerContainer());
    _WebGLScene.add(_Plane.GetPlane());
    _WebGLScene.add(_Point.GetPoint());

    const DefaultPosition = _Player.GetPlayerContainer().position;

    _WebGLCamera.position.set(0, DefaultPosition.y + Settings.CameraOffset.y, DefaultPosition.z + Settings.CameraOffset.z);
    _WebGLCamera.lookAt(_Player.GetPlayerContainer().position);

    CreatePlayerRaycaster({
        scene: _WebGLScene, camera: _WebGLCamera,
        renderer: _WebGLRenderer, creator: _WebGLCreator
    });

    InitializeChangeSpeed();
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
        const Intersects = PlayerRaycaster.intersectObjects(scene.children);

        if (Intersects.length > 0) {

            ClickedVector = Intersects[0].point;
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

            ActualMoves++;
            $("#MovesCounter").val(`Moves: ${ActualMoves}`);
        }
    })
}

const InitializeChangeSpeed = () => {
    $("#ActualSpeedRange").on('input', (ev) => {

        const ActualSpeedValue = $("#ActualSpeedRange").val();

        ActualSpeed = ActualSpeedValue;
        $('#ActualSpeed').val(`Speed: ${ActualSpeed}`);
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

    if (MovingObject) {

        const PlayerContainer = _Player.GetPlayerContainer();
        const ActualDistance = PlayerContainer.position.clone().distanceTo(ClickedVector);

        if (ActualDistance < Settings.PlayerSize / 8) MovingObject = false;

        PlayerContainer.translateOnAxis(DestinationVector, ActualSpeed);
        _Point.GetPoint().rotation.y += 0.05;

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