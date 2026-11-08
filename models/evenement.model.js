const mongoose = require('mongoose');

const evenementSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    imageUrl: String,
    location: String,
    startDate: Date,
    endDate: Date,
    capacity: Number,
    registrationDeadline: Date,
    createdAt: Date,
    updatedAt: Date
}, { timestamps: true });

const Evenement = mongoose.model('Evenement', evenementSchema);

module.exports = Evenement;