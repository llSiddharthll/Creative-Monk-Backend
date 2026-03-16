const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // Icon name/identifier
    details: [{ type: String }], // Points about the service
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
