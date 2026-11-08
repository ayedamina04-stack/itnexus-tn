const EvenementModel = require('../models/evenement.model');

module.exports.createEvenement = async (req, res) => {
    try {
        const evenement = new EvenementModel(req.body);
        await evenement.save();
        res.status(201).json(evenement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.getEvenements = async (req, res) => {
    try {
        const evenements = await EvenementModel.find();
        res.status(200).json(evenements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getEvenementById = async (req, res) => {
    try {
        const evenement = await EvenementModel.findById(req.params.id);
        if (!evenement) return res.status(404).json({ message: 'Evenement not found' });
        res.status(200).json(evenement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateEvenement = async (req, res) => {
    try {
        const evenement = await EvenementModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!evenement) return res.status(404).json({ message: 'Evenement not found' });
        res.status(200).json(evenement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.deleteEvenement = async (req, res) => {
    try {
        const evenement = await EvenementModel.findByIdAndDelete(req.params.id);
        if (!evenement) return res.status(404).json({ message: 'Evenement not found' });
        res.status(200).json({ message: 'Evenement deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
