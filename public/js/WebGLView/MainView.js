let AxesEnabled = false;
let HexagonEnabled = true;
const TypesButton = [];
let CurrentEnemy = null;

const _Axes = new THREE.AxesHelper(800);
let _Hexagon = new Wall({ hexagonName: "Wall" }, {
    radius: 100, row: 0, col: 0,
    inDoor: 2, outDoor: 3, containsLight: false
});

$(document).ready(() => {
    const _WebGLCreator = new WebGLCreator({ creatorName: "WebGL" });
    const _WebGLScene = _WebGLCreator.GetScene();
    const _WebGLCamera = _WebGLCreator.GetCamera();
    const _WebGLRenderer = _WebGLCreator.GetRenderer();

    Render({ renderer: _WebGLRenderer, scene: _WebGLScene, camera: _WebGLCamera });
    _WebGLScene.add(_Hexagon.GetHexagon());

    InitializeShowAxesButton({ scene: _WebGLScene });
    InitializeShowHexagon({ scene: _WebGLScene });
    InitializeButtonTypes({ scene: _WebGLScene }, $('#ShowWallHexagon'), $('#ShowEnemyHexagon'),
        $('#ShowTreasureHexagon'), $('#ShowLightHexagon'));
})

const InitializeShowAxesButton = ({ scene = null }) => {
    if (!scene instanceof THREE.Scene) return;

    $('#ShowAxes').on('click', (ev) => {

        if (AxesEnabled) {
            scene.remove(_Axes);
            SetCurrentState({ item: $("#ShowAxes"), message: 'Show Axes', state: !AxesEnabled });
        }

        else {
            scene.add(_Axes);
            SetCurrentState({ item: $("#ShowAxes"), message: 'Hide Axes', state: !AxesEnabled });
        }

        AxesEnabled = !AxesEnabled;
    })
}

const InitializeShowHexagon = ({ scene = null } = {}) => {
    if (!scene instanceof THREE.Scene) return;

    $('#ChangeHexagonState').on('click', (ev) => {

        if (HexagonEnabled) {
            scene.remove(_Hexagon.GetHexagon());
            SetCurrentState({ item: $("#ChangeHexagonState"), message: 'Show Hexagon', state: !HexagonEnabled });
            SetTypeButtonEnable({ enable: false });
        }

        else {
            scene.add(_Hexagon.GetHexagon());
            SetCurrentState({ item: $("#ChangeHexagonState"), message: 'Hide Hexagon', state: !HexagonEnabled });
            SetTypeButtonEnable({ enable: true });
        }

        HexagonEnabled = !HexagonEnabled;
    })
}

const InitializeButtonTypes = ({ scene = null } = {}, ...buttons) => {
    if (!buttons instanceof Array || !scene instanceof THREE.Scene) return;

    buttons.forEach((button) => {
        TypesButton.push(button);

        button.on('click', (ev) => {

            buttons.forEach((btn) => {
                btn.removeClass('btn-primary');
                btn.addClass('btn-secondary');
            })

            button.removeClass('btn-secondary');
            button.addClass('btn-primary');

            ChangeCurrentModel({ type: button.attr('type'), scene: scene });
        })
    })
}

const SetCurrentState = ({ item = null, message = "", state = false } = {}) => {
    item.html(message);

    if (state) {
        item.removeClass('btn-success');
        item.addClass('btn-danger');
    }
    else {
        item.removeClass('btn-danger');
        item.addClass('btn-success');
    }
}

const SetTypeButtonEnable = ({ enable = false } = {}) => {
    TypesButton.forEach((button) => button.attr('disabled', !enable));
}

const ChangeCurrentModel = ({ type = null, scene = null } = {}) => {
    if (type == null || !scene instanceof THREE.Scene) return;

    CurrentEnemy = null;
    scene.remove(_Hexagon.GetHexagon());

    if (type == TypesButton[0].attr('type')) {
        _Hexagon = new Wall({ hexagonName: "Wall" }, {
            radius: 100, row: 0, col: 0,
            inDoor: 2, outDoor: 3, containsLight: false
        });
    }
    else if (type == TypesButton[1].attr('type')) {
        _Hexagon = new Enemy({ hexagonName: "Enemy" }, {
            radius: 100, row: 0, col: 0,
            inDoor: 2, outDoor: 3, containsLight: false
        });

        CurrentEnemy = _Hexagon;
    }
    else if (type == TypesButton[2].attr('type')) {
        _Hexagon = new Treasure({ hexagonName: "Treasure" }, {
            radius: 100, row: 0, col: 0,
            inDoor: 2, outDoor: 3, containsLight: false
        });
    }
    else if (type == TypesButton[3].attr('type')) {
        _Hexagon = new Light({ hexagonName: "Light" }, {
            radius: 100, row: 0, col: 0,
            inDoor: 2, outDoor: 3, containsLight: true
        });
    }

    scene.add(_Hexagon.GetHexagon());
}

const Render = ({ renderer = null, scene = null, camera = null } = {}) => {
    if (!renderer instanceof THREE.WebGLRenderer || !scene instanceof THREE.Scene
        || !camera instanceof THREE.PerspectiveCamera) return;

    if (CurrentEnemy) console.log(CurrentEnemy.ally.UpdateModelMixer());

    renderer.render(scene, camera);
    requestAnimationFrame(Render.bind(null, { renderer: renderer, scene: scene, camera: camera }));
}