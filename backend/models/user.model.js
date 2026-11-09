
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    // Informations personnelles
    name: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true,
        minlength: 2,
        maxlength: 100
    },

    email: {
        type: String,
        required: [true, "L'email est obligatoire"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide']
    },

    password: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire'],
        minlength: 8,
        select: false
    },

    age: {
        type: Number,
        min: 13,
        max: 120
    },

    phone: {
        type: String,
        trim: true,
        maxlength: 20
    },

    address: {
        type: String,
        trim: true,
        maxlength: 200
    },

    // Gestion des rôles
    role: {
        type: String,
        enum: ['user', 'admin', 'author'],
        default: 'user'
    },

    // Informations supplémentaires pour les auteurs
    bio: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ''
    },

    // Activation ou désactivation du compte
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
