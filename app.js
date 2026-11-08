
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { connectToMongoDB } = require('./config/mongo.con');

// Importation des routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/article');
const evenementsRouter = require('./routes/evenement');
const authRouter = require('./routes/auth');

const app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/evenements', evenementsRouter);
app.use('/auth', authRouter);

// Route inexistante
app.use((req, res) => {
    res.status(404).json({
        message: 'Route introuvable'
    });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        message: 'Une erreur est survenue sur le serveur'
    });
});

// Démarrage du serveur après connexion MongoDB
const PORT = process.env.PORT || process.env.port || 5000;

const startServer = async () => {
    try {
        await connectToMongoDB();

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        console.error('Impossible de démarrer le serveur :', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;
