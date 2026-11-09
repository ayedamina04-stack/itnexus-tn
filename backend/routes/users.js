
const express = require('express');
const router = express.Router();

const userController = require('../controller/user.controller');

const {
    protect,
    authorize
} = require('../middleware/auth.middleware');

// Toutes les routes utilisateurs nécessitent une connexion
router.use(protect);

// Créer un utilisateur : admin uniquement
router.post('/', authorize('admin'), userController.createUser);

// Consulter tous les utilisateurs : admin uniquement
router.get('/', authorize('admin'), userController.getUsers);

// Consulter un utilisateur : admin uniquement
router.get('/:id', authorize('admin'), userController.getUserById);

// Modifier un compte : propriétaire ou admin
router.put('/:id', userController.updateUser);

// Supprimer un compte : admin uniquement
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
