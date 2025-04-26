const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
    try {
        const { bio, skills } = req.body;
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (bio) user.bio = bio;
        if (skills) user.skills = skills;

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user's jobs
router.get('/jobs', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let jobs;
        if (user.role === 'client') {
            jobs = await Job.find({ client: user._id });
        } else {
            jobs = await Job.find({ assignedTo: user._id });
        }

        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 