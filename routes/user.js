const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/', userController.SetDefaultPage);
router.get('/LevelEditor', userController.SetEditorPage);
router.get('/ViewHexagon', userController.SetHexagonPage);
router.get('/PlayGame', userController.SetGamePage);
router.get('/PlayerMovement', userController.SetMovementPage);
router.get('/AllyMovement', userController.SetAllyPage);

router.post('/SaveCurrentLevel', userController.SaveCurrentLevel);
router.post('/LoadLevels', userController.LoadLevels);
router.post('/SetCurrentLevel', userController.SetCurrentLevel);
router.post('/GetCurrentLevel', userController.GetCurrentLevel);

module.exports = router;