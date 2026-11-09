
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Créer un utilisateur (admin uniquement)
module.exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Tous les champs obligatoires doivent être remplis.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins 8 caractères.'
            });
        }

        const emailNormalise = email.trim().toLowerCase();
        const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValide.test(emailNormalise)) {
            return res.status(400).json({
                message: 'Adresse email invalide.'
            });
        }

        const rolesAutorises = ['user', 'author', 'admin'];

        if (role && !rolesAutorises.includes(role)) {
            return res.status(400).json({
                message: 'Rôle invalide.'
            });
        }

        const existe = await User.findOne({
            email: emailNormalise
        });

        if (existe) {
            return res.status(409).json({
                message: 'Cette adresse email existe déjà.'
            });
        }

        const motDePasseHache = await bcrypt.hash(password, 12);

        const nouvelUtilisateur = await User.create({
            name: name.trim(),
            email: emailNormalise,
            password: motDePasseHache,
            role: role || 'user'
        });

        return res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: {
                id: nouvelUtilisateur._id,
                name: nouvelUtilisateur.name,
                email: nouvelUtilisateur.email,
                role: nouvelUtilisateur.role
            }
        });

    } catch (error) {
        console.error('Erreur création utilisateur :', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Cette adresse email existe déjà.'
            });
        }

        return res.status(500).json({
            message: 'Erreur interne du serveur.'
        });
    }
};


// Consulter tous les utilisateurs (admin uniquement)
module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select(
            'name email role age phone address bio isActive createdAt'
        );

        return res.status(200).json(users);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erreur lors de la récupération des utilisateurs.'
        });
    }
};


// Consulter un utilisateur (admin uniquement)
module.exports.getUserById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable.'
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erreur lors de la récupération du compte.'
        });
    }
};


// Modifier un utilisateur
module.exports.updateUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable.'
            });
        }

        const estAdmin = req.user.role === 'admin';
        const estProprietaire = req.user.id === user._id.toString();

        if (!estAdmin && !estProprietaire) {
            return res.status(403).json({
                message: 'Vous ne pouvez modifier que votre propre compte.'
            });
        }

        // Champs modifiables par l'utilisateur
        const champsAutorises = [
            'name',
            'email',
            'age',
            'phone',
            'address',
            'bio'
        ];

        champsAutorises.forEach(champ => {
            if (req.body[champ] !== undefined) {
                user[champ] = req.body[champ];
            }
        });

        // Normalisation des données
        if (typeof user.name === 'string') {
            user.name = user.name.trim();
        }

        if (typeof user.email === 'string') {
            user.email = user.email.trim().toLowerCase();
        }

        // Seul un admin peut modifier le rôle et l'état du compte
        if (estAdmin) {
            if (req.body.role !== undefined) {
                if (!['user', 'admin', 'author'].includes(req.body.role)) {
                    return res.status(400).json({
                        message: 'Rôle invalide.'
                    });
                }

                user.role = req.body.role;
            }

            if (req.body.isActive !== undefined) {
                if (typeof req.body.isActive !== 'boolean') {
                    return res.status(400).json({
                        message: 'État du compte invalide.'
                    });
                }

                user.isActive = req.body.isActive;
            }
        }

        await user.save();

        return res.status(200).json({
            message: 'Compte modifié avec succès.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                age: user.age,
                phone: user.phone,
                address: user.address,
                bio: user.bio,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error('Erreur modification utilisateur :', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Cette adresse email est déjà utilisée.'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: 'Erreur lors de la modification du compte.'
        });
    }
};


// Supprimer un utilisateur (admin uniquement)
module.exports.deleteUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur introuvable.'
            });
        }

        return res.status(200).json({
            message: 'Utilisateur supprimé avec succès.'
        });

    } catch (error) {
        console.error('Erreur suppression utilisateur :', error);

        return res.status(500).json({
            message: 'Erreur lors de la suppression.'
        });
    }
};
