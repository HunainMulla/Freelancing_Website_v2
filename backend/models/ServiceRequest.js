const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'paid', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'refunded'],
        default: 'pending'
    },
    paymentIntentId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema); 