
const mongoose = require('mongoose');
const EvenementModel = require('../models/evenement.model');


// ========================================
// FONCTIONS UTILITAIRES
// ========================================

const idValide = (id) => mongoose.Types.ObjectId.isValid(id);

const peutGerer = (evenement, user) => {
    const auteurId = evenement.author?._id
        ? evenement.author._id.toString()
        : evenement.author.toString();

    return user.role === 'admin' || auteurId === user.id;
};


// ========================================
// 1. CREER UN EVENEMENT
// ========================================
module.exports.createEvenement = async (req, res) => {
    try {
        const {
            title,
            description,
            imageUrl,
            location,
            city,
            category,
            type,
            startDate,
            endDate,
            registrationDeadline,
            capacity
        } = req.body;

        if (
            typeof title !== 'string' ||
            typeof description !== 'string' ||
            typeof location !== 'string' ||
            !title.trim() ||
            !description.trim() ||
            !location.trim()
        ) {
            return res.status(400).json({
                message: 'Titre, description et lieu obligatoires.'
            });
        }

        const evenement = await EvenementModel.create({
            title: title.trim(),
            description: description.trim(),
            imageUrl: imageUrl || '',
            location: location.trim(),
            city: city || '',
            category: category || 'Autre',
            type: type || 'Présentiel',
            startDate,
            endDate,
            registrationDeadline,
            capacity,
            author: req.user.id,
            status: 'brouillon'
        });

        return res.status(201).json({
            message: 'Événement créé en brouillon.',
            evenement
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la création de l’événement.'
        });
    }
};


// ========================================
// 2. RECHERCHER LES EVENEMENTS PUBLIES
// ========================================
module.exports.getEvenements = async (req, res) => {
    try {
        const { motCle, city, category, type, date } = req.query;

        const filtre = {
            status: 'publie'
        };

        if (city) filtre.city = city;
        if (category) filtre.category = category;
        if (type) filtre.type = type;

        if (date) {
            const dateRecherchee = new Date(date);

            if (Number.isNaN(dateRecherchee.getTime())) {
                return res.status(400).json({
                    message: 'Date de recherche invalide.'
                });
            }

            const debutJour = new Date(dateRecherchee);
            debutJour.setHours(0, 0, 0, 0);

            const finJour = new Date(dateRecherchee);
            finJour.setHours(23, 59, 59, 999);

            filtre.startDate = {
                $gte: debutJour,
                $lte: finJour
            };
        }

        if (typeof motCle === 'string' && motCle.trim()) {
            filtre.$text = {
                $search: motCle.trim()
            };
        }

        const evenements = await EvenementModel.find(filtre)
            .populate('author', 'name')
            .sort({ startDate: 1 });

        return res.status(200).json(evenements);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la recherche des événements.'
        });
    }
};


// ========================================
// 3. CONSULTER UN EVENEMENT PUBLIE
// ========================================
module.exports.getEvenementById = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findOne({
            _id: req.params.id,
            status: 'publie'
        })
            .populate('author', 'name')
            .populate('comments.auteur', 'name');

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        return res.status(200).json(evenement);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la consultation.'
        });
    }
};


// ========================================
// 4. MODIFIER UN EVENEMENT
// ========================================
module.exports.updateEvenement = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findById(req.params.id);

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        if (!peutGerer(evenement, req.user)) {
            return res.status(403).json({
                message: 'Vous ne pouvez pas modifier cet événement.'
            });
        }

        const champsAutorises = [
            'title',
            'description',
            'imageUrl',
            'location',
            'city',
            'category',
            'type',
            'startDate',
            'endDate',
            'registrationDeadline',
            'capacity'
        ];

        champsAutorises.forEach(champ => {
            if (req.body[champ] !== undefined) {
                evenement[champ] = req.body[champ];
            }
        });

        if (evenement.capacity < evenement.registrations.length) {
            return res.status(400).json({
                message: 'La capacité ne peut pas être inférieure au nombre d’inscrits.'
            });
        }

        await evenement.save();

        return res.status(200).json({
            message: 'Événement modifié avec succès.',
            evenement
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la modification.'
        });
    }
};


// ========================================
// 5. SUPPRIMER UN EVENEMENT
// ========================================
module.exports.deleteEvenement = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findById(req.params.id);

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        if (!peutGerer(evenement, req.user)) {
            return res.status(403).json({
                message: 'Vous ne pouvez pas supprimer cet événement.'
            });
        }

        await evenement.deleteOne();

        return res.status(200).json({
            message: 'Événement supprimé avec succès.'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de la suppression.'
        });
    }
};


// ========================================
// 6. PUBLIER UN EVENEMENT
// ========================================
module.exports.publierEvenement = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findById(req.params.id);

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        if (!peutGerer(evenement, req.user)) {
            return res.status(403).json({
                message: 'Action interdite.'
            });
        }

        evenement.status = 'publie';
        await evenement.save();

        return res.status(200).json({
            message: 'Événement publié avec succès.',
            evenement
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: 'Erreur lors de la publication.'
        });
    }
};


// ========================================
// 7. DEPUBLIER UN EVENEMENT
// ========================================
module.exports.depublierEvenement = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findById(req.params.id);

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        if (!peutGerer(evenement, req.user)) {
            return res.status(403).json({
                message: 'Action interdite.'
            });
        }

        evenement.status = 'brouillon';
        await evenement.save();

        return res.status(200).json({
            message: 'Événement dépublié.',
            evenement
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la dépublication.'
        });
    }
};


// ========================================
// 8. S'INSCRIRE A UN EVENEMENT
// ========================================
module.exports.inscrireEvenement = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findOne({
            _id: req.params.id,
            status: 'publie'
        });

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        const maintenant = new Date();

        if (maintenant > evenement.registrationDeadline) {
            return res.status(400).json({
                message: 'La date limite d’inscription est dépassée.'
            });
        }

        if (maintenant >= evenement.startDate) {
            return res.status(400).json({
                message: 'Cet événement a déjà commencé.'
            });
        }

        const dejaInscrit = evenement.registrations.some(
            inscription =>
                inscription.utilisateur.toString() === req.user.id
        );

        if (dejaInscrit) {
            return res.status(409).json({
                message: 'Vous êtes déjà inscrit à cet événement.'
            });
        }

        if (evenement.registrations.length >= evenement.capacity) {
            return res.status(400).json({
                message: 'Désolé, cet événement est complet.'
            });
        }

        evenement.registrations.push({
            utilisateur: req.user.id
        });

        await evenement.save();

        return res.status(201).json({
            message: 'Inscription réussie !',
            nombreInscrits: evenement.registrations.length
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Erreur lors de l’inscription.'
        });
    }
};


// ========================================
// 9. ANNULER SON INSCRIPTION
// ========================================
module.exports.annulerInscription = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findById(req.params.id);

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        const inscription = evenement.registrations.find(
            item => item.utilisateur.toString() === req.user.id
        );

        if (!inscription) {
            return res.status(404).json({
                message: 'Vous n’êtes pas inscrit à cet événement.'
            });
        }

        evenement.registrations.pull(inscription._id);
        await evenement.save();

        return res.status(200).json({
            message: 'Inscription annulée.',
            nombreInscrits: evenement.registrations.length
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de l’annulation.'
        });
    }
};


// ========================================
// 10. AIMER / RETIRER UN LIKE
// ========================================
module.exports.toggleLike = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findOne({
            _id: req.params.id,
            status: 'publie'
        });

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        const dejaLike = evenement.likes.some(
            id => id.toString() === req.user.id
        );

        if (dejaLike) {
            evenement.likes.pull(req.user.id);
        } else {
            evenement.likes.addToSet(req.user.id);
        }

        await evenement.save();

        return res.status(200).json({
            message: dejaLike ? 'Like retiré.' : 'Événement aimé.',
            likes: evenement.likes.length,
            liked: !dejaLike
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors du like.'
        });
    }
};


// ========================================
// 11. AJOUTER / RETIRER DES FAVORIS
// ========================================
module.exports.toggleFavori = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findOne({
            _id: req.params.id,
            status: 'publie'
        });

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        const dejaFavori = evenement.favorites.some(
            id => id.toString() === req.user.id
        );

        if (dejaFavori) {
            evenement.favorites.pull(req.user.id);
        } else {
            evenement.favorites.addToSet(req.user.id);
        }

        await evenement.save();

        return res.status(200).json({
            message: dejaFavori
                ? 'Événement retiré des favoris.'
                : 'Événement ajouté aux favoris.',
            favoris: evenement.favorites.length,
            saved: !dejaFavori
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la gestion des favoris.'
        });
    }
};


// ========================================
// 12. AJOUTER UN COMMENTAIRE
// ========================================
module.exports.ajouterCommentaire = async (req, res) => {
    try {
        const { contenu } = req.body;

        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        if (typeof contenu !== 'string' || !contenu.trim()) {
            return res.status(400).json({
                message: 'Le commentaire est obligatoire.'
            });
        }

        const evenement = await EvenementModel.findOne({
            _id: req.params.id,
            status: 'publie'
        });

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        evenement.comments.push({
            auteur: req.user.id,
            contenu: contenu.trim()
        });

        await evenement.save();

        return res.status(201).json({
            message: 'Commentaire ajouté.',
            comments: evenement.comments
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: 'Erreur lors de l’ajout du commentaire.'
        });
    }
};


// ========================================
// 13. SUPPRIMER UN COMMENTAIRE
// ========================================
module.exports.supprimerCommentaire = async (req, res) => {
    try {
        if (
            !idValide(req.params.id) ||
            !idValide(req.params.commentaireId)
        ) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findById(req.params.id);

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        const commentaire = evenement.comments.id(
            req.params.commentaireId
        );

        if (!commentaire) {
            return res.status(404).json({
                message: 'Commentaire introuvable.'
            });
        }

        const estAdmin = req.user.role === 'admin';
        const estAuteur = commentaire.auteur.toString() === req.user.id;

        if (!estAdmin && !estAuteur) {
            return res.status(403).json({
                message: 'Vous ne pouvez supprimer que vos propres commentaires.'
            });
        }

        commentaire.deleteOne();
        await evenement.save();

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
// 14. INCREMENTER LES VUES
// ========================================
module.exports.incrementerVues = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findOneAndUpdate(
            {
                _id: req.params.id,
                status: 'publie'
            },
            {
                $inc: { views: 1 }
            },
            {
                new: true
            }
        );

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        return res.status(200).json({
            message: 'Vue enregistrée.',
            views: evenement.views
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de l’incrémentation des vues.'
        });
    }
};


// ========================================
// 15. CONSULTER MES EVENEMENTS
// ========================================
module.exports.getMesEvenements = async (req, res) => {
    try {
        const filtre = {};

        if (req.user.role !== 'admin') {
            filtre.author = req.user.id;
        }

        const evenements = await EvenementModel.find(filtre)
            .populate('author', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json(evenements);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erreur lors de la récupération de vos événements.'
        });
    }
};


// ========================================
// 16. CONSULTER UN DE MES EVENEMENTS
// ========================================
module.exports.getMonEvenementById = async (req, res) => {
    try {
        if (!idValide(req.params.id)) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        const evenement = await EvenementModel.findById(req.params.id)
            .populate('author', 'name')
            .populate('comments.auteur', 'name');

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        if (!peutGerer(evenement, req.user)) {
            return res.status(403).json({
                message: 'Vous ne pouvez pas consulter cet événement.'
            });
        }

        return res.status(200).json(evenement);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erreur lors de la consultation de l’événement.'
        });
    }
};


// ========================================
// 17. MODIFIER UN COMMENTAIRE
// ========================================
module.exports.modifierCommentaire = async (req, res) => {
    try {
        const { contenu } = req.body;

        if (
            !idValide(req.params.id) ||
            !idValide(req.params.commentaireId)
        ) {
            return res.status(400).json({
                message: 'Identifiant invalide.'
            });
        }

        if (typeof contenu !== 'string' || !contenu.trim()) {
            return res.status(400).json({
                message: 'Le commentaire est obligatoire.'
            });
        }

        const evenement = await EvenementModel.findById(req.params.id);

        if (!evenement) {
            return res.status(404).json({
                message: 'Événement introuvable.'
            });
        }

        const commentaire = evenement.comments.id(
            req.params.commentaireId
        );

        if (!commentaire) {
            return res.status(404).json({
                message: 'Commentaire introuvable.'
            });
        }

        const estAdmin = req.user.role === 'admin';
        const estAuteur = commentaire.auteur.toString() === req.user.id;

        if (!estAdmin && !estAuteur) {
            return res.status(403).json({
                message: 'Vous ne pouvez modifier que vos propres commentaires.'
            });
        }

        commentaire.contenu = contenu.trim();

        await evenement.save();

        return res.status(200).json({
            message: 'Commentaire modifié avec succès.',
            commentaire
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: 'Erreur lors de la modification du commentaire.'
        });
    }
};


// ========================================
// 18. CONSULTER MES INSCRIPTIONS
// ========================================
module.exports.getMesInscriptions = async (req, res) => {
    try {
        const evenements = await EvenementModel.find({
            'registrations.utilisateur': req.user.id
        })
            .populate('author', 'name')
            .sort({ startDate: 1 });

        return res.status(200).json(evenements);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erreur lors de la récupération de vos inscriptions.'
        });
    }
};

