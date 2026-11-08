const ArticleModel = require('../models/article.model');

module.exports.getArticleById = async (req, res) => {
    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.creerArticle = async (req, res) => {
    try {
        const { titre, contenu, urlImage, urlSource } = req.body;

        const article = new ArticleModel({
            titre,
            contenu,
            resume: req.body.resume || '',
            urlImage,
            urlSource,
            datepub: req.body.datepub || null,
            vues: 0,
            datecreation: new Date(),
            datemisAJour: new Date()
        });

        await article.save();
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.mettreAJourArticle = async (req, res) => {
    try {
        const article = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                datemisAJour: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!article) return res.status(404).json({ message: 'Article not found' });

        res.status(200).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.supprimerArticle = async (req, res) => {
    try {
        const article = await ArticleModel.findByIdAndDelete(req.params.id);

        if (!article) return res.status(404).json({ message: 'Article not found' });

        res.status(200).json({ message: 'Article deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.publierArticle = async (req, res) => {
    try {
        const article = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            {
                datepub: new Date(),
                datemisAJour: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!article) return res.status(404).json({ message: 'Article not found' });

        res.status(200).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.incrementerVues = async (req, res) => {
    try {
        const article = await ArticleModel.findById(req.params.id);

        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.vues = (article.vues || 0) + 1;
        article.datemisAJour = new Date();
        await article.save();

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.rechercherArticles = async (req, res) => {
    try {
        const motCle = req.query.motCle || '';

        if (!motCle) {
            const articles = await ArticleModel.find();
            return res.status(200).json(articles);
        }

        const articles = await ArticleModel.find({
            $or: [
                { titre: { $regex: motCle, $options: 'i' } },
                { contenu: { $regex: motCle, $options: 'i' } },
                { resume: { $regex: motCle, $options: 'i' } }
            ]
        });

        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.genererResume = async (req, res) => {
    try {
        const { contenu } = req.body;

        if (!contenu) {
            return res.status(400).json({ message: 'Le contenu est requis' });
        }

        const resume = contenu.trim();
        const resumeCourte = resume.length > 160 ? resume.substring(0, 157) + '...' : resume;

        res.status(200).json({ resume: resumeCourte });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.suggérerCategorie = async (req, res) => {
    try {
        const { titre = '', contenu = '' } = req.body;
        const texte = `${titre} ${contenu}`.toLowerCase();

        if (/sport|football|basket|tennis|fitness|athletisme/.test(texte)) {
            return res.status(200).json({ categorie: 'Sport' });
        }

        if (/informatique|javascript|node|python|java|web|logiciel|programmation/.test(texte)) {
            return res.status(200).json({ categorie: 'Informatique' });
        }

        if (/culture|cinéma|film|musique|art|littérature/.test(texte)) {
            return res.status(200).json({ categorie: 'Culture' });
        }

        if (/santé|médecine|nutrition|bien-être|sport|medecine/.test(texte)) {
            return res.status(200).json({ categorie: 'Santé' });
        }

        res.status(200).json({ categorie: 'Général' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
