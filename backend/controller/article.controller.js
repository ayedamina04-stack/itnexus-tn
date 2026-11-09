
const mongoose = require('mongoose');
const Article = require('../models/article.model');

// Vérifier si l'identifiant MongoDB est valide
const idValide = (id) => mongoose.Types.ObjectId.isValid(id);

// Vérifier si l'utilisateur peut gérer un article
const peutGerer = (article, user) => {
    return user.role === 'admin' ||
        article.auteur.toString() === user.id;
};

// Vérifier si un article peut être consulté
const peutConsulter = (article, user) => {
    return article.statut === 'publie' ||
        (user && peutGerer(article, user));
};


// ========================================
// 1. CRÉER UN ARTICLE
// ========================================
module.exports.creerArticle = async (req, res) => {
    try {
        const { titre, contenu, resume, urlImage, urlSource, categorie } = req.body;

        if (
            typeof titre !== 'string' ||
            typeof contenu !== 'string' ||
            titre.trim().length < 5 ||
            contenu.trim().length < 20
        ) {
            return res.status(400).json({
                message: 'Titre (5 caractères minimum) et contenu (20 caractères minimum) obligatoires.'
            });
        }

        const article = await Article.create({
            titre: titre.trim(),
            contenu: contenu.trim(),
            resume: resume || '',
            urlImage: urlImage || '',
            urlSource: urlSource || '',
            categorie: categorie || 'Autre',
            auteur: req.user.id,
            statut: 'brouillon'
        });

        return res.status(201).json({
            message: 'Article créé en brouillon.',
            article
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la création de l’article.'
        });
    }
};


// ========================================
// 2. RECHERCHER LES ARTICLES
// ========================================
module.exports.rechercherArticles = async (req, res) => {
    try {
        const { motCle = '', categorie } = req.query;

        const filtre = {};

        // Les utilisateurs publics ne voient que les articles publiés
        if (!req.user || req.user.role === 'user') {
            filtre.statut = 'publie';
        }

        if (categorie) {
            filtre.categorie = categorie;
        }

        if (typeof motCle === 'string' && motCle.trim()) {
            filtre.$text = { $search: motCle.trim() };
        }

        const articles = await Article.find(filtre)
            .populate('auteur', 'name')
            .sort({ datepub: -1 });

        return res.status(200).json(articles);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la recherche des articles.'
        });
    }
};


// ========================================
// 3. CONSULTER UN ARTICLE
// ========================================
module.exports.getArticleById = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({ message: 'Identifiant invalide.' });
        }

        const article = await Article.findById(req.params.id)
            .populate('auteur', 'name')
            .populate('commentaires.auteur', 'name');

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        if (!peutConsulter(article, req.user)) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        return res.status(200).json(article);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la consultation.'
        });
    }
};


// ========================================
// 4. MODIFIER UN ARTICLE
// ========================================
module.exports.mettreAJourArticle = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({ message: 'Identifiant invalide.' });
        }

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        if (!peutGerer(article, req.user)) {
            return res.status(403).json({ message: 'Vous ne pouvez pas modifier cet article.' });
        }

        const champsAutorises = [
            'titre',
            'contenu',
            'resume',
            'urlImage',
            'urlSource',
            'categorie'
        ];

        champsAutorises.forEach(champ => {
            if (req.body[champ] !== undefined) {
                article[champ] = req.body[champ];
            }
        });

        article.datemisAJour = new Date();

        await article.save();

        return res.status(200).json({
            message: 'Article modifié avec succès.',
            article
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la modification.'
        });
    }
};


// ========================================
// 5. SUPPRIMER UN ARTICLE
// ========================================
module.exports.supprimerArticle = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({ message: 'Identifiant invalide.' });
        }

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        if (!peutGerer(article, req.user)) {
            return res.status(403).json({ message: 'Vous ne pouvez pas supprimer cet article.' });
        }

        await article.deleteOne();

        return res.status(200).json({
            message: 'Article supprimé avec succès.'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la suppression.'
        });
    }
};


// ========================================
// 6. PUBLIER UN ARTICLE
// ========================================
module.exports.publierArticle = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({ message: 'Identifiant invalide.' });
        }

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        if (!peutGerer(article, req.user)) {
            return res.status(403).json({ message: 'Action interdite.' });
        }

        article.statut = 'publie';
        article.datepub = new Date();

        await article.save();

        return res.status(200).json({
            message: 'Article publié avec succès.',
            article
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: 'Impossible de publier cet article.'
        });
    }
};


// ========================================
// 7. DÉPUBLIER UN ARTICLE
// ========================================
module.exports.depublierArticle = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({ message: 'Identifiant invalide.' });
        }

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        if (!peutGerer(article, req.user)) {
            return res.status(403).json({ message: 'Action interdite.' });
        }

        article.statut = 'brouillon';
        article.datepub = null;

        await article.save();

        return res.status(200).json({
            message: 'Article dépublié.',
            article
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la dépublication.'
        });
    }
};


// ========================================
// 8. INCRÉMENTER LES VUES
// ========================================
module.exports.incrementerVues = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({ message: 'Identifiant invalide.' });
        }

        const article = await Article.findOneAndUpdate(
            { _id: req.params.id, statut: 'publie' },
            { $inc: { vues: 1 } },
            { new: true }
        );

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        return res.status(200).json({
            message: 'Vue enregistrée.',
            vues: article.vues
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de l’incrémentation des vues.'
        });
    }
};


// ========================================
// 9. AIMER / RETIRER UN LIKE
// ========================================
module.exports.toggleLike = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({ message: 'Identifiant invalide.' });
        }

        const article = await Article.findOne({
            _id: req.params.id,
            statut: 'publie'
        });

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        const dejaLike = article.likes.some(
            id => id.toString() === req.user.id
        );

        if (dejaLike) {
            article.likes.pull(req.user.id);
        } else {
            article.likes.addToSet(req.user.id);
        }

        await article.save();

        return res.status(200).json({
            message: dejaLike ? 'Like retiré.' : 'Article aimé.',
            likes: article.likes.length,
            liked: !dejaLike
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors du like.'
        });
    }
};


// ========================================
// 10. AJOUTER / RETIRER DES FAVORIS
// ========================================
module.exports.toggleFavori = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({ message: 'Identifiant invalide.' });
        }

        const article = await Article.findOne({
            _id: req.params.id,
            statut: 'publie'
        });

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        const dejaFavori = article.favoris.some(
            id => id.toString() === req.user.id
        );

        if (dejaFavori) {
            article.favoris.pull(req.user.id);
        } else {
            article.favoris.addToSet(req.user.id);
        }

        await article.save();

        return res.status(200).json({
            message: dejaFavori ? 'Article retiré des favoris.' : 'Article ajouté aux favoris.',
            favoris: article.favoris.length,
            saved: !dejaFavori
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la gestion des favoris.'
        });
    }
};


// ========================================
// 11. AJOUTER UN COMMENTAIRE
// ========================================
module.exports.ajouterCommentaire = async (req, res) => {
    try {
        const { contenu } = req.body;

        if (!idValide(req.params.id)) {
            return res.status(400).json({ message: 'Identifiant invalide.' });
        }

        if (typeof contenu !== 'string' || !contenu.trim()) {
            return res.status(400).json({ message: 'Le commentaire est obligatoire.' });
        }

        const article = await Article.findOne({
            _id: req.params.id,
            statut: 'publie'
        });

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        article.commentaires.push({
            auteur: req.user.id,
            contenu: contenu.trim()
        });

        await article.save();

        return res.status(201).json({
            message: 'Commentaire ajouté.',
            commentaires: article.commentaires
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        return res.status(500).json({
            message: 'Erreur lors de l’ajout du commentaire.'
        });
    }
};


// ========================================
// 12. SUPPRIMER UN COMMENTAIRE
// ========================================
module.exports.supprimerCommentaire = async (req, res) => {
    try {
        if (!idValide(req.params.id) || !idValide(req.params.commentaireId)) {
            return res.status(400).json({ message: 'Identifiant invalide.' });
        }

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable.' });
        }

        const commentaire = article.commentaires.id(req.params.commentaireId);

        if (!commentaire) {
            return res.status(404).json({ message: 'Commentaire introuvable.' });
        }

        const estAdmin = req.user.role === 'admin';
        const estAuteur = commentaire.auteur.toString() === req.user.id;

        if (!estAdmin && !estAuteur) {
            return res.status(403).json({
                message: 'Vous ne pouvez supprimer que vos propres commentaires.'
            });
        }

        commentaire.deleteOne();
        await article.save();

        return res.status(200).json({
            message: 'Commentaire supprimé.'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la suppression du commentaire.'
        });
    }
};


// ========================================
// 13. GÉNÉRER UN RÉSUMÉ
// ========================================
module.exports.genererResume = async (req, res) => {
    try {
        const { contenu } = req.body;

        if (typeof contenu !== 'string' || !contenu.trim()) {
            return res.status(400).json({
                message: 'Le contenu est obligatoire.'
            });
        }

        const texte = contenu.trim();
        const resume = texte.length > 160
            ? texte.substring(0, 157) + '...'
            : texte;

        return res.status(200).json({ resume });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la génération du résumé.'
        });
    }
};


// ========================================
// 14. SUGGÉRER UNE CATÉGORIE
// ========================================
module.exports.suggérerCategorie = async (req, res) => {
    try {
        const { titre = '', contenu = '' } = req.body;

        if (typeof titre !== 'string' || typeof contenu !== 'string') {
            return res.status(400).json({ message: 'Données invalides.' });
        }

        const texte = `${titre} ${contenu}`.toLowerCase();

        let categorie = 'Autre';

        if (/intelligence artificielle|machine learning|deep learning|chatgpt|ia\b/.test(texte)) {
            categorie = 'Intelligence artificielle';
        } else if (/cybersécurité|cybersecurity|hacking|phishing|malware|sécurité informatique/.test(texte)) {
            categorie = 'Cybersécurité';
        } else if (/javascript|node\.?js|react|html|css|frontend|backend|développement web/.test(texte)) {
            categorie = 'Développement web';
        } else if (/python|java|programmation|algorithme|c\+\+/.test(texte)) {
            categorie = 'Programmation';
        } else if (/data science|big data|analyse de données|machine learning/.test(texte)) {
            categorie = 'Data Science';
        } else if (/réseau|network|cloud|serveur|infrastructure/.test(texte)) {
            categorie = 'Réseaux';
        } else if (/innovation|startup|technologie|technologies/.test(texte)) {
            categorie = 'Innovation';
        }

        return res.status(200).json({ categorie });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la suggestion de catégorie.'
        });
    }
};
