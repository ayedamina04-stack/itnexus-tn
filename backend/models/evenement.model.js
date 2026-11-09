
const mongoose = require('mongoose');

// ========================================
// SOUS-MODELE : COMMENTAIRE
// ========================================
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


// ========================================
// SOUS-MODELE : INSCRIPTION
// ========================================
const inscriptionSchema = new mongoose.Schema({
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    dateInscription: {
        type: Date,
        default: Date.now
    }
});


// ========================================
// MODELE PRINCIPAL : EVENEMENT
// ========================================
const evenementSchema = new mongoose.Schema({

    // Informations principales
    title: {
        type: String,
        required: [true, 'Le titre est obligatoire'],
        trim: true,
        minlength: 5,
        maxlength: 200
    },

    description: {
        type: String,
        required: [true, 'La description est obligatoire'],
        trim: true,
        minlength: 20
    },

    imageUrl: {
        type: String,
        trim: true,
        default: ''
    },

    location: {
        type: String,
        required: [true, 'Le lieu est obligatoire'],
        trim: true,
        maxlength: 200
    },

    // Type et catégorie
    city: {
        type: String,
        trim: true,
        default: ''
    },

    category: {
        type: String,
        enum: [
            'Conférence',
            'Workshop',
            'Hackathon',
            'Formation',
            'Networking',
            'Compétition',
            'Autre'
        ],
        default: 'Autre'
    },

    type: {
        type: String,
        enum: ['Présentiel', 'En ligne', 'Hybride'],
        default: 'Présentiel'
    },

    // Dates
    startDate: {
        type: Date,
        required: [true, 'La date de début est obligatoire']
    },

    endDate: {
        type: Date,
        required: [true, 'La date de fin est obligatoire'],
        validate: {
            validator: function(value) {
                return !this.startDate || value > this.startDate;
            },
            message: 'La date de fin doit être après la date de début.'
        }
    },

    registrationDeadline: {
        type: Date,
        required: [true, "La date limite d'inscription est obligatoire"],
        validate: {
            validator: function(value) {
                return !this.startDate || value <= this.startDate;
            },
            message: "La date limite doit être avant ou le jour du début de l'événement."
        }
    },

    // Capacité
    capacity: {
        type: Number,
        required: [true, 'La capacité maximale est obligatoire'],
        min: [1, 'La capacité doit être au minimum de 1']
    },

    // Auteur de l'événement
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Publication
    status: {
        type: String,
        enum: ['brouillon', 'publie'],
        default: 'brouillon'
    },

    // Inscriptions
    registrations: {
        type: [inscriptionSchema],
        default: []
    },

    // Interactions
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    comments: {
        type: [commentaireSchema],
        default: []
    },

    // Nombre de vues
    views: {
        type: Number,
        default: 0,
        min: 0
    }

}, {
    timestamps: true
});


// ========================================
// INDEX POUR LES RECHERCHES
// ========================================
evenementSchema.index({ title: 'text', description: 'text' });
evenementSchema.index({ status: 1, startDate: 1 });
evenementSchema.index({ city: 1, category: 1 });
evenementSchema.index({ author: 1, createdAt: -1 });


// Création du modèle
const Evenement = mongoose.model('Evenement', evenementSchema);

module.exports = Evenement;
