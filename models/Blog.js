const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Creative Monk' },
    imageUrl: { type: String, required: true },
    tags: [{ type: String }],
    published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
