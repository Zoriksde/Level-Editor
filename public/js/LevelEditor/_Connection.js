class Connection {
    constructor({ connectionName = "" }) {

        this.connectionName = connectionName;
    }

    Save({ data = null }) {
        if (data == null) return;

        $.ajax({
            url: '/SaveCurrentLevel',
            method: 'POST',
            data: data,
            success: (data) => { },
            error: (xhr, status, error) => {
                console.log(`Error E: ${error} with status S: ${status} has occured!`);
            }
        })
    }

    LoadLevels() {

        $.ajax({
            url: '/LoadLevels',
            method: 'POST',
            success: (data) => {
                const Levels = JSON.parse(data);
                SetLevelsLayout({ data: Levels });
            },
            error: (xhr, status, error) => {
                console.log(`Error E: ${error} with status S: ${status} has occured!`);
            }
        })
    }

    SetCurrentLevel({ data = null } = {}) {
        if (!data instanceof Array) return;

        $.ajax({
            url: '/SetCurrentLevel',
            method: 'POST',
            data: data,
            success: (data) => { },
            error: (xhr, status, error) => {
                console.log(`Error E: ${error} with status S: ${status} has occured!`);
            }
        })
    }
}