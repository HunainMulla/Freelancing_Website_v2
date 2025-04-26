const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

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

// Add portfolio work
router.post('/portfolio', auth, upload.single('image'), async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'freelancer') {
            return res.status(403).json({ message: 'Only freelancers can add portfolio items' });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

        // Upload to cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'freelancer_portfolio',
            resource_type: 'auto'
        });

        // Add to user's portfolio
        user.portfolio.push({
            title: req.body.title,
            description: req.body.description,
            imageUrl: result.secure_url
        });

        await user.save();
        res.json({ message: 'Portfolio item added', portfolio: user.portfolio });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete portfolio work
router.delete('/portfolio/:workId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the portfolio item
        const portfolioItem = user.portfolio.id(req.params.workId);
        if (!portfolioItem) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }

        // Extract public_id from Cloudinary URL
        const publicId = portfolioItem.imageUrl.split('/').slice(-1)[0].split('.')[0];
        
        // Delete from Cloudinary
        await cloudinary.uploader.destroy('freelancer_portfolio/' + publicId);

        // Remove from user's portfolio
        portfolioItem.remove();
        await user.save();

        res.json({ message: 'Portfolio item deleted', portfolio: user.portfolio });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all freelancers
router.get('/freelancers', async (req, res) => {
    try {
        const freelancers = await User.find({ role: 'freelancer' })
            .select('-password')
            .select('-email'); // Don't send sensitive info

        res.json(freelancers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single freelancer profile
router.get('/freelancer/:id', async (req, res) => {
    try {
        const freelancer = await User.findOne({ 
            _id: req.params.id,
            role: 'freelancer'
        }).select('-password -email'); // Don't send sensitive info

        if (!freelancer) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        res.json(freelancer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 