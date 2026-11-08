var express = require('express');
var router = express.Router();
const evenementController = require('../controller/evenement.controller');

// CRUD routes for evenements
router.post('/', evenementController.createEvenement);
router.get('/', evenementController.getEvenements);
router.get('/:id', evenementController.getEvenementById);
router.put('/:id', evenementController.updateEvenement);
router.delete('/:id', evenementController.deleteEvenement);

module.exports = router;
