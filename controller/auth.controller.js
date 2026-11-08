
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// INSCRIPTION
module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Le nom, l email et le mot de passe sont obligatoires.'
            });
        }

        if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                message: 'Données invalides.'
            });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({
                message: 'Le nom doit contenir au moins 2 caractères.'
            });
        }

        const emailNormalise = email.trim().toLowerCase();
        const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValide.test(emailNormalise)) {
            return res.status(400).json({
                message: 'Adresse email invalide.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins 8 caractères.'
            });
        }

        const utilisateurExistant = await User.findOne({
            email: emailNormalise
        });

        if (utilisateurExistant) {
            return res.status(409).json({
                message: 'Cette adresse email est déjà utilisée.'
            });
        }

        const motDePasseHache = await bcrypt.hash(password, 12);

        const nouvelUtilisateur = await User.create({
            name: name.trim(),
            email: emailNormalise,
            password: motDePasseHache,
            role: 'user'
        });

        return res.status(201).json({
            message: 'Inscription réussie !',
            user: {
                id: nouvelUtilisateur._id,
                name: nouvelUtilisateur.name,
                email: nouvelUtilisateur.email,
                role: nouvelUtilisateur.role,
                createdAt: nouvelUtilisateur.createdAt
            }
        });

    } catch (error) {
        console.error('Erreur inscription :', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Cette adresse email est déjà utilisée.'
            });
        }

        return res.status(500).json({
            message: 'Erreur interne du serveur.'
        });
    }
};


// CONNEXION
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email et mot de passe obligatoires.'
            });
        }

        const emailNormalise = email.trim().toLowerCase();

        // Chercher l'utilisateur et récupérer son mot de passe caché
        const utilisateur = await User.findOne({
            email: emailNormalise
        }).select('+password');

        if (!utilisateur) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect.'
            });
        }

        if (!utilisateur.isActive) {
            return res.status(403).json({
                message: 'Votre compte est désactivé.'
            });
        }

        // Comparer le mot de passe saisi avec le hash enregistré
        const motDePasseCorrect = await bcrypt.compare(
            password,
            utilisateur.password
        );

        if (!motDePasseCorrect) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect.'
            });
        }

        // Créer le JWT
        const token = jwt.sign(
            {
                id: utilisateur._id,
                role: utilisateur.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        // Envoyer le JWT dans un cookie sécurisé
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'Connexion réussie !',
            user: {
                id: utilisateur._id,
                name: utilisateur.name,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });

    } catch (error) {
        console.error('Erreur connexion :', error);

        return res.status(500).json({
            message: 'Erreur interne du serveur.'
        });
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return res.status(200).json({
        message: 'Déconnexion réussie !'
    });
};
