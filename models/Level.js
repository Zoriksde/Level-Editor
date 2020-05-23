const LevelsCollection = require('../utils/Database').GetLevelsCollection;

class Level {
    constructor({ name = "", author = "", levelInfo = [] }) {

        this.name = name;
        this.author = author;
        this.levelInfo = levelInfo;
    }

    save() {
        LevelsCollection.insert(this, (err, docs) => { });
    }

    static GetLevels(callback) {
        if (callback == null) return;

        LevelsCollection.find({}, (err, docs) => {
            callback(JSON.stringify(docs));
        })
    }
}

module.exports = Level;