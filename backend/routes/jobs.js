const router = require('express').Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('client', 'username email')
            .populate('assignedTo', 'username email')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get job by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('client', 'username email')
            .populate('assignedTo', 'username email');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new job
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, budget, skills, deadline, posterRole } = req.body;
        
        // Create job with the poster's role
        const job = new Job({
            title,
            description,
            budget,
            skills,
            deadline,
            client: req.user.userId,
            posterRole: posterRole || 'client' // Default to client if not specified
        });
        
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update job status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Only the job owner can update status
        if (job.client.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        job.status = req.body.status;
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Apply for a job
router.post('/:id/apply', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.status !== 'open') {
            return res.status(400).json({ message: 'Job is not open for applications' });
        }

        // Check if user is a freelancer
        const user = await User.findById(req.user.userId);
        if (user.role !== 'freelancer') {
            return res.status(403).json({ message: 'Only freelancers can apply for jobs' });
        }

        // Cannot apply to own job
        if (job.client.toString() === req.user.userId) {
            return res.status(400).json({ message: 'Cannot apply to your own job' });
        }

        // Check if already applied
        if (job.candidates.includes(req.user.userId)) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }

        // Add user to candidates array
        job.candidates.push(req.user.userId);
        await job.save();
        
        res.json(job);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get job candidates
router.get('/:id/candidates', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Only job owner can view candidates
        if (job.client.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to view candidates' });
        }

        const candidates = await User.find({ _id: { $in: job.candidates } })
            .select('username profession hourlyRate skills');
        res.json(candidates);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get user's jobs
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let jobs;
        if (user.role === 'client') {
            jobs = await Job.find({ client: user._id })
                .populate('assignedTo', 'username email');
        } else {
            jobs = await Job.find({ assignedTo: user._id })
                .populate('client', 'username email');
        }

        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Select a candidate for the job
router.post('/:id/select-candidate', auth, async (req, res) => {
    try {
        const { candidateId } = req.body;
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Only job owner can select candidate
        if (job.client.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to select candidate' });
        }

        if (job.status !== 'open') {
            return res.status(400).json({ message: 'Job is not open for selection' });
        }

        // Verify candidate has applied
        if (!job.candidates.includes(candidateId)) {
            return res.status(400).json({ message: 'This user has not applied for the job' });
        }

        job.assignedTo = candidateId;
        job.status = 'in-progress';
        await job.save();
        
        res.json(job);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router; 