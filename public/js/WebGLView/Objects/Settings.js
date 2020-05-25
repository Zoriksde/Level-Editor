const Settings = {

    BasicMaterial: new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('gfx/Textures/texture.png'),
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
        opacity: 1
    }),

    PhongMaterial: new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('gfx/Textures/texture.png'),
        side: THREE.DoubleSide,
        specular: 0x111111,
        shininess: 30,
        opacity: 1
    }),

    LightColor: 0xc0c0c0,

    LightMaterial: new THREE.MeshBasicMaterial({
        color: this.LightColor,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 1
    }),

    BasicTreasureMaterial: new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('gfx/Textures/chest.jpg'),
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
        opacity: 1
    }),

    PhongTreasureMaterial: new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('gfx/Textures/chest.jpg'),
        side: THREE.DoubleSide,
        specular: 0x111111,
        shininess: 25,
        opacity: 1
    }),

    BasicPlayerMaterial: new THREE.MeshBasicMaterial({
        color: 0xfe7834,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
        opacity: 1
    }),

    PlaneSize: 2200,

    BasicPlaneMaterial: new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('gfx/Textures/stone.jpg'),
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
        opacity: 1
    }),

    BasicPointMaterial: new THREE.MeshBasicMaterial({
        color: 0xff2222,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 1
    }),

    CameraOffset: {
        y: 300, z: 800
    },

    PlayerSize: 80,

    BasicModelMaterial: new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("/gfx/Materials/spider.png"),
        morphTargets: true
    }),

    ModelCameraOffset: {
        x: 20, y: 40, z: -25
    },

    ModelSizeZ: -1,

    BasicAllyMaterial: new THREE.MeshBasicMaterial({
        color: 0x32f081,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 1
    }),

    AllyRadius: 50,

    AllySegments: 64,

    AllyName: "Ally",

    BasicAllyModelMaterial: new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("/gfx/Materials/spider.png"),
        morphTargets: true
    }),

    BasicSkyboxMaterials: [
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/gfx/Skybox/skybox_front_side.jpg'),
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/gfx/Skybox/skybox_back_side.jpg'),
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/gfx/Skybox/skybox_up_side.jpg'),
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/gfx/Skybox/skybox_down_side.jpg'),
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/gfx/Skybox/skybox_right_side.jpg'),
            side: THREE.BackSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/gfx/Skybox/skybox_left_side.jpg'),
            side: THREE.BackSide
        }),
    ],

    SkyboxSize: 10000
}