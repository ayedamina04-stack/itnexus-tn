
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const helmet = require('helmet');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

const { connectToMongoDB } = require('./config/mongo.con');

// Importation des routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/article');
const evenementsRouter = require('./routes/evenement');
const authRouter = require('./routes/auth');

const app = express();


// ========================================
// 1. SECURITE HTTP
// ========================================
app.use(helmet());


// ========================================
// 2. CONFIGURATION CORS
// ========================================
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));


// ========================================
// 3. LIMITATION DES REQUETES
// ========================================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        message: 'Trop de requêtes. Veuillez réessayer plus tard.'
    }
});

app.use(limiter);


// ========================================
// 4. MIDDLEWARES
// ========================================
app.use(logger('dev'));

app.use(express.json({
    limit: '10kb'
}));

app.use(express.urlencoded({
    extended: false,
    limit: '10kb'
}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


// ========================================
// 5. ROUTES
// ========================================
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/evenements', evenementsRouter);
app.use('/auth', authRouter);


// ========================================
// 6. ROUTE INTROUVABLE
// ========================================
app.use((req, res) => {
    res.status(404).json({
        message: 'Route introuvable.'
    });
});


// ========================================
// 7. GESTION DES ERREURS
// ========================================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        message: 'Une erreur est survenue sur le serveur.'
    });
});


// ========================================
// 8. DEMARRAGE DU SERVEUR
// ========================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectToMongoDB();

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });

    } catch (error) {
        console.error(
            'Impossible de démarrer le serveur :',
            error.message
        );

        process.exit(1);
    }
};

startServer();

module.exports = app;
