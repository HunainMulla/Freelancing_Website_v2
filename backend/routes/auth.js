const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res, next) => {
    try {
        console.log('Received registration request body:', req.body);

        const { 
            username, 
            email, 
            password, 
            role,
            profession,
            hourlyRate,
            background,
            description,
            skills,
            profilePicture 
        } = req.body;

        // Basic validation
        if (!username || !email || !password || !role) {
            return res.status(400).json({ 
                message: 'Please provide all required fields (username, email, password, role)' 
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password first
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user data object
        const userData = {
            username,
            email,
            password: hashedPassword,
            role,
            profilePicture
        };

        console.log('Role:', role);

        // Add freelancer specific fields if role is freelancer
        if (role === 'freelancer') {
            console.log('Freelancer data:', { profession, hourlyRate, background, description, skills });
            
            if (!profession || !hourlyRate || !background || !description) {
                return res.status(400).json({ 
                    message: 'Please provide all required freelancer fields (profession, hourlyRate, background, description)' 
                });
            }

            Object.assign(userData, {
                profession,
                hourlyRate: Number(hourlyRate),
                background,
                description,
                skills: Array.isArray(skills) ? skills.filter(Boolean) : 
                       typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : 
                       []
            });
        }

        console.log('Final user data:', userData);

        // Create new user
        user = new User(userData);

        // Validate the document
        const validationError = user.validateSync();
        if (validationError) {
            console.log('Mongoose validation error:', validationError);
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: Object.values(validationError.errors).map(err => err.message)
            });
        }

        // Save user
        await user.save();
        console.log('User saved successfully');

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Send response
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                ...(role === 'freelancer' && {
                    profession: user.profession,
                    hourlyRate: user.hourlyRate,
                    background: user.background,
                    description: user.description,
                    skills: user.skills
                })
            }
        });
    } catch (err) {
        console.error('Registration error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        next(err);
    }
});

// Login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                ...(user.role === 'freelancer' && {
                    profession: user.profession,
                    hourlyRate: user.hourlyRate,
                    background: user.background,
                    description: user.description,
                    skills: user.skills
                })
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router; 