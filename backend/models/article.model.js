
const mongoose = require('mongoose');

// Sous-modèle : commentaires d'un article
const commentaireSchema = new mongoose.Schema({
    auteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    contenu: {
        type: String,
        required: [true, 'Le commentaire est obligatoire'],
        trim: true,
        minlength: 1,
        maxlength: 1000
    },

    datecreation: {
        type: Date,
        default: Date.now
    }
});

// Modèle principal : article
const articleSchema = new mongoose.Schema({

    // Informations principales
    titre: {
        type: String,
        required: [true, 'Le titre est obligatoire'],
        trim: true,
        minlength: 5,
        maxlength: 200
    },

    contenu: {
        type: String,
        required: [true, 'Le contenu est obligatoire'],
        trim: true,
        minlength: 20
    },

    resume: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ''
    },

    urlImage: {
        type: String,
        trim: true,
        default: ''
    },

    urlSource: {
        type: String,
        trim: true,
        default: ''
    },

    // Auteur de l'article
    auteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Catégorie
    categorie: {
        type: String,
        enum: [
            'Intelligence artificielle',
            'Programmation',
            'Cybersécurité',
            'Développement web',
            'Data Science',
            'Réseaux',
            'Innovation',
            'Autre'
        ],
        default: 'Autre'
    },

    // État de publication
    statut: {
        type: String,
        enum: ['brouillon', 'publie'],
        default: 'brouillon'
    },

    datepub: {
        type: Date,
        default: null
    },

    // Statistiques et interactions
    vues: {
        type: Number,
        default: 0,
        min: 0
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    favoris: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    commentaires: {
        type: [commentaireSchema],
        default: []
    }

}, {
    timestamps: true
});

// Index pour faciliter les recherches
articleSchema.index({ titre: 'text', contenu: 'text', resume: 'text' });
articleSchema.index({ statut: 1, datepub: -1 });
articleSchema.index({ categorie: 1, statut: 1 });
articleSchema.index({ auteur: 1, createdAt: -1 });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
