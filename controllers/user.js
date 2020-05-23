const Level = require('../models/Level');
let ActualLevel = {};

module.exports.SetDefaultPage = (req, res, next) => {
    res.render('index', {
        title: 'Info',
        path: '/'
    });
}

module.exports.SetEditorPage = (req, res, next) => {
    res.render('editor', {
        title: 'LevelEditor',
        path: '/LevelEditor'
    });
}

module.exports.SetHexagonPage = (req, res, next) => {
    res.render('hexagon', {
        title: 'View Hexagon',
        path: '/ViewHexagon'
    });
}

module.exports.SetGamePage = (req, res, next) => {
    res.render('game', {
        title: 'Play Game',
        path: '/PlayGame'
    });
}

module.exports.SetMovementPage = (req, res, next) => {
    res.render('movement', {
        title: 'Player Movement',
        path: '/PlayerMovement'
    });
}

module.exports.SaveCurrentLevel = (req, res, next) => {
    const LevelName = req.body.name;
    const LevelAuthor = req.body.author;
    const LevelInfo = req.body.level;

    const _Level = new Level({ name: LevelName, author: LevelAuthor, levelInfo: LevelInfo });
    _Level.save();

    res.end();
}

module.exports.LoadLevels = (req, res, next) => {
    Level.GetLevels((levels) => {
        res.send(levels);
    })
}

module.exports.SetCurrentLevel = (req, res, next) => {
    ActualLevel = req.body;
    res.end();
}

module.exports.GetCurrentLevel = (req, res, next) => {
    res.send(ActualLevel);
}