const _Player = new Player({ playerName: "Player" });
const _Plane = new Plane({ planeName: "Plane" });
const _Point = new Point({ pointName: "Point" });

let ActualMoves = 0;

$(document).ready(() => {

    const _WebGLCreator = new WebGLCreator({ creatorName: "WebGL", enableOrbitControles: false });
    const _WebGLScene = _WebGLCreator.GetScene();
    const _WebGLCamera = _WebGLCreator.GetCamera();
    const _WebGLRenderer = _WebGLCreator.GetRenderer();

    _WebGLCreator.Render();

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

    InitializeChangeSpeed({ creator: _WebGLCreator });
})

const CreatePlayerRaycaster = ({ scene = null, camera = null, renderer = null, creator = null }) => {
    if (!scene instanceof THREE.Scene || !camera instanceof THREE.PerspectiveCamera
        || !renderer instanceof THREE.WebGLRenderer || !creator instanceof WebGLCreator) return;

    const PlayerRaycaster = new THREE.Raycaster();
    const MousePosition = new THREE.Vector2();

    $('#MainWebGLRoot').on('mousedown', (ev) => {

        let ClickedVector = new THREE.Vector3(0, 0, 0);
        let DestinationVector = new THREE.Vector3(0, 0, 0);

        MousePosition.x = (event.offsetX / renderer.domElement.width) * 2 - 1;
        MousePosition.y = -(event.offsetY / renderer.domElement.height) * 2 + 1;

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

            _Player.GetPlayerObject().rotation.y = PlayerRotation;
            SetActualPoint({ position: ClickedVector });

            creator.SetMovingObject({
                object: _Player,
                destinationVector: DestinationVector, clickedVector: ClickedVector,
                point: _Point
            });

            ActualMoves++;
            $("#MovesCounter").val(`Moves: ${ActualMoves}`);
        }
    })
}

const InitializeChangeSpeed = ({ creator = null } = {}) => {
    if (!creator instanceof WebGLCreator) return;

    $("#ActualSpeedRange").on('input', (ev) => {

        const ActualSpeed = $("#ActualSpeedRange").val();

        creator.actualSpeed = ActualSpeed;
        $('#ActualSpeed').val(`Speed: ${ActualSpeed}`);
    })
}

const SetActualPoint = ({ position = 0 } = {}) => {
    if (!position instanceof THREE.Vector3) return;

    _Point.GetPoint().position.x = position.x;
    _Point.GetPoint().position.y = Settings.PlayerSize * 2;
    _Point.GetPoint().position.z = position.z;
}