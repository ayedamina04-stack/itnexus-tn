
const express = require('express');
const router = express.Router();

const authController = require('../controller/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const { rateLimit } = require('express-rate-limit');

// Limiter les tentatives d'inscription et de connexion
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Maximum 10 tentatives
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Trop de tentatives. Réessayez dans 15 minutes.'
    }
});

// Inscription
router.post('/register', authLimiter, authController.register);

// Connexion
router.post('/login', authLimiter, authController.login);

// Vérifier la session
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        message: 'Utilisateur authentifié',
        user: req.user
    });
});

// Déconnexion
router.post('/logout', authController.logout);

module.exports = router;
