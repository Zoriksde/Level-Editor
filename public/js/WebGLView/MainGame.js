const _Connection = new Connection({ connectionName: "ConnectionToServer" });
const Types = ["Wall", "Enemy", "Treasure", "Light"];
const Lights = [];

$(document).ready(() => {
    const _WebGLCreator = new WebGLCreator({ creatorName: "WebGL", enableOrbitControles: true });
    const _WebGLScene = _WebGLCreator.GetScene();

    _WebGLCreator.Render();

    _Connection.GetLevelInfoData({ scene: _WebGLScene });

    InitializeLightIntensityRange();
    InitializeLightPositionRange();
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