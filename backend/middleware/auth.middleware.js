
const jwt = require('jsonwebtoken');

// Vérifier si l'utilisateur est connecté
module.exports.protect = (req, res, next) => {
    try {
        // Récupérer le JWT depuis le cookie
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: 'Accès refusé. Veuillez vous connecter.'
            });
        }

        // Vérifier et décoder le JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Mettre les informations de l'utilisateur à disposition
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Session invalide ou expirée. Veuillez vous reconnecter.'
        });
    }
};

// Vérifier le rôle de l'utilisateur
module.exports.authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Accès interdit. Vous n avez pas les permissions nécessaires.'
            });
        }

        next();
    };
};
