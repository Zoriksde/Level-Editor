class Connection {
    constructor({ connectionName = "" }) {

        this.connectionName = connectionName;
    }

    GetLevelInfoData({ scene = null } = {}) {
        if (!scene instanceof THREE.Scene) return;

        $.ajax({
            url: '/GetCurrentLevel',
            method: 'POST',
            success: (data) => {
                DrawActualLevel({ data: data, scene: scene });
            },
            error: (xhr, status, error) => {
                console.log(`Error E: ${error} with status S: ${status} has occured!`);
            }
        })
    }
}