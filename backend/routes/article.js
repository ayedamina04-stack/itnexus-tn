
const express = require('express');
const router = express.Router();

const articleController = require('../controller/article.controller');

const {
    protect,
    authorize
} = require('../middleware/auth.middleware');

// ========================================
// ROUTES PUBLIQUES
// ========================================

// Consulter les articles publiés
router.get('/', articleController.rechercherArticles);

// Consulter un article
router.get('/:id', articleController.getArticleById);

// Incrémenter les vues
router.post('/increment-vues/:id', articleController.incrementerVues);

// Générer un résumé
router.post('/resume', articleController.genererResume);

// Suggérer une catégorie
router.post('/categorie', articleController.suggérerCategorie);


// ========================================
// ROUTES RÉSERVÉES AUX AUTEURS ET ADMINS
// ========================================

// Créer un article
router.post(
    '/',
    protect,
    authorize('author', 'admin'),
    articleController.creerArticle
);

// Modifier un article (le contrôleur vérifie son propriétaire)
router.put(
    '/:id',
    protect,
    authorize('author', 'admin'),
    articleController.mettreAJourArticle
);

// Supprimer un article
router.delete(
    '/:id',
    protect,
    authorize('author', 'admin'),
    articleController.supprimerArticle
);

// Publier un article
router.post(
    '/publier/:id',
    protect,
    authorize('author', 'admin'),
    articleController.publierArticle
);

// Dépublier un article
router.post(
    '/depublier/:id',
    protect,
    authorize('author', 'admin'),
    articleController.depublierArticle
);


// ========================================
// ROUTES RÉSERVÉES AUX UTILISATEURS CONNECTÉS
// ========================================

// Aimer / retirer un like
router.post(
    '/:id/like',
    protect,
    articleController.toggleLike
);

// Ajouter / retirer des favoris
router.post(
    '/:id/favori',
    protect,
    articleController.toggleFavori
);

// Ajouter un commentaire
router.post(
    '/:id/commentaires',
    protect,
    articleController.ajouterCommentaire
);

// Supprimer un commentaire
router.delete(
    '/:id/commentaires/:commentaireId',
    protect,
    articleController.supprimerCommentaire
);

module.exports = router;
