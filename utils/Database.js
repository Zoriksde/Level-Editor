const Datastore = require('nedb');

const LevelsCollection = new Datastore({
    filename: 'Levels.db',
    autoload: true
})

module.exports.GetLevelsCollection = LevelsCollection;