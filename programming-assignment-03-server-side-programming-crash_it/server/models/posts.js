// Post Document Schema

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, maxLength: 100 },
    content: { type: String, required: true },
    linkFlairID: { type: mongoose.Schema.Types.ObjectId, ref: 'LinkFlair' },
    postedBy: { type: String, required: true },
    postedDate: { type: Date, default: Date.now },
    communityID: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    commentIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    views: { type: Number, default: 0 },
});

postSchema.virtual('url').get(function() {
    return `/posts/${this._id}`;
});

module.exports = mongoose.model('Post', postSchema);
