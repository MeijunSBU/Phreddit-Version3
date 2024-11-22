// Community Document Schema

const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 500 },
    postIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    startDate: { type: Date, default: Date.now },
    members: [{ type: String, required: true }],
    membersCount: { type: Number, default: 0 },
});

communitySchema.virtual('url').get(function() {
    return `/communities/${this._id}`;
});

module.exports = mongoose.model('Community', communitySchema);
