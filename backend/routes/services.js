const router = require('express').Router();
const auth = require('../middleware/auth');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const stripe = require('../config/stripe');

// This file is a placeholder for future service-related routes
// You can implement service-specific functionality here

router.get('/', (req, res) => {
    res.json({ message: 'Services route is working' });
});

// Create a service request
router.post('/request', auth, async (req, res) => {
    try {
        const { freelancerId, service } = req.body;

        // Verify freelancer exists
        const freelancer = await User.findOne({ _id: freelancerId, role: 'freelancer' });
        if (!freelancer) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        // Create service request
        const serviceRequest = new ServiceRequest({
            client: req.user.userId,
            freelancer: freelancerId,
            service: {
                title: service.title,
                description: service.description,
                amount: service.amount
            },
            status: 'accepted' // Automatically set as accepted for immediate payment
        });

        await serviceRequest.save();

        res.status(201).json(serviceRequest);
    } catch (err) {
        console.error('Service request creation error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get service requests for user (as client or freelancer)
router.get('/requests', auth, async (req, res) => {
    try {
        const requests = await ServiceRequest.find({
            $or: [
                { client: req.user.userId },
                { freelancer: req.user.userId }
            ]
        })
        .populate('client', 'username')
        .populate('freelancer', 'username profession');

        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update service request status (for freelancer)
router.patch('/request/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const request = await ServiceRequest.findOne({
            _id: req.params.id,
            freelancer: req.user.userId
        });

        if (!request) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        request.status = status;
        await request.save();

        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create payment intent
router.post('/request/:id/payment', auth, async (req, res) => {
    try {
        const request = await ServiceRequest.findOne({
            _id: req.params.id,
            client: req.user.userId,
            status: 'accepted'
        });

        if (!request) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: request.service.amount * 100, // Convert to cents
            currency: 'usd',
            metadata: {
                serviceRequestId: request._id.toString()
            }
        });

        // Update request with payment intent ID
        request.paymentIntentId = paymentIntent.id;
        await request.save();

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update payment status
router.post('/payment/confirm/:requestId', auth, async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        const request = await ServiceRequest.findOne({
            _id: req.params.requestId,
            client: req.user.userId
        });

        if (!request) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        // Verify payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            request.status = 'paid';
            request.paymentStatus = 'completed';
            await request.save();
            res.json({ success: true, request });
        } else {
            res.status(400).json({ message: 'Payment not completed' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 