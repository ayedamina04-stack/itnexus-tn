var express = require('express');
var router = express.Router();
const articleController = require('../controller/article.controller');

// CRUD routes for articles
router.post('/', articleController.creerArticle);
router.get('/', articleController.rechercherArticles);
router.get('/:id', articleController.getArticleById);
router.put('/:id', articleController.mettreAJourArticle);
router.delete('/:id', articleController.supprimerArticle);

// Routes métier
router.post('/publier/:id', articleController.publierArticle);
router.post('/increment-vues/:id', articleController.incrementerVues);
router.post('/resume', articleController.genererResume);
router.post('/categorie', articleController.suggérerCategorie);

module.exports = router;
