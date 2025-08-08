import User from '../models/User.model.js';
import mongoose from 'mongoose';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUsersByIds = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty userIds array.' });
        }
        const validUserIds = userIds.filter(id => mongoose.Types.ObjectId.isValid(id));
        if (validUserIds.length === 0) {
            return res.status(200).json([]); // No valid user IDs to search for
        }
        const users = await User.find({ _id: { $in: validUserIds.map(id => new mongoose.Types.ObjectId(id)) } }, 'fullName email');
        res.status(200).json(users);
    } catch (err) {
        console.error("Error in getUsersByIds:", err); // More detailed logging
        res.status(500).json({ message: err.message });
    }
};