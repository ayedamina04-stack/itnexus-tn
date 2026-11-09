
const express = require('express');
const router = express.Router();

const evenementController = require('../controller/evenement.controller');

const {
    protect,
    authorize
} = require('../middleware/auth.middleware');


// ========================================
// ROUTES GET PUBLIQUES ET PERSONNELLES
// ========================================

// Consulter les événements publiés
router.get('/', evenementController.getEvenements);

// Consulter tous mes événements (author/admin)
router.get(
    '/mes-evenements',
    protect,
    authorize('author', 'admin'),
    evenementController.getMesEvenements
);

// Consulter un de mes événements, même en brouillon
router.get(
    '/mes-evenements/:id',
    protect,
    authorize('author', 'admin'),
    evenementController.getMonEvenementById
);

// Consulter mes inscriptions
router.get(
    '/mes-inscriptions',
    protect,
    evenementController.getMesInscriptions
);

// Consulter un événement publié par son identifiant
router.get('/:id', evenementController.getEvenementById);


// ========================================
// ROUTES RESERVEES AUX AUTEURS ET ADMINS
// ========================================

// Créer un événement
router.post(
    '/',
    protect,
    authorize('author', 'admin'),
    evenementController.createEvenement
);

// Modifier un événement
router.put(
    '/:id',
    protect,
    authorize('author', 'admin'),
    evenementController.updateEvenement
);

// Supprimer un événement
router.delete(
    '/:id',
    protect,
    authorize('author', 'admin'),
    evenementController.deleteEvenement
);

// Publier un événement
router.post(
    '/publier/:id',
    protect,
    authorize('author', 'admin'),
    evenementController.publierEvenement
);

// Dépublier un événement
router.post(
    '/depublier/:id',
    protect,
    authorize('author', 'admin'),
    evenementController.depublierEvenement
);


// ========================================
// ROUTES RESERVEES AUX UTILISATEURS CONNECTES
// ========================================

// S'inscrire à un événement
router.post(
    '/:id/inscription',
    protect,
    evenementController.inscrireEvenement
);

// Annuler son inscription
router.delete(
    '/:id/inscription',
    protect,
    evenementController.annulerInscription
);

// Aimer / retirer un like
router.post(
    '/:id/like',
    protect,
    evenementController.toggleLike
);

// Ajouter / retirer des favoris
router.post(
    '/:id/favori',
    protect,
    evenementController.toggleFavori
);

// Ajouter un commentaire
router.post(
    '/:id/commentaires',
    protect,
    evenementController.ajouterCommentaire
);

// Modifier un commentaire
router.put(
    '/:id/commentaires/:commentaireId',
    protect,
    evenementController.modifierCommentaire
);

// Supprimer un commentaire
router.delete(
    '/:id/commentaires/:commentaireId',
    protect,
    evenementController.supprimerCommentaire
);


// ========================================
// ROUTE PUBLIQUE : COMPTER LES VUES
// ========================================
router.post(
    '/increment-vues/:id',
    evenementController.incrementerVues
);


module.exports = router;
