const UserModel = require('../models/user.model');

module.exports.createUser = async (req, res) => {
    try {
        const user = new UserModel(req.body);
        console.log('Creating user with data:', req.body); // Debugging line
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports.getUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.hello = async (req, res) => {
    res.status(200).json({ message: 'Hello, World!' });
};

module.exports.createUserAdmin = async (req, res) => {
    try {
        // Ensure role is admin regardless of request body
        const adminData = Object.assign({}, req.body, { role: 'admin' });
        const admin = new UserModel(adminData);
        await admin.save();
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports.createAuthor = async(req, res) => {
    try {
        // Ensure role is admin regardless of request body
        const authorData = Object.assign({}, req.body, { role: 'author'});
        const author = new UserModel(authorData);
        await author.save();
        res.status(201).json(author);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};