const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    id: String,
    titre: String,
    contenu: String,
    resume: String,
    urlImage: String,
    urlSource: String,
    datepub: Date,
    vues: Number,
    datecreation: Date,
    datemisAJour: Date
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;