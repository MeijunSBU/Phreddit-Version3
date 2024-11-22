// routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const Communities = require('../models/communities');

// // Endpoint to add a postID too the postIDs of a community
// router.post('/:communityId/postIDs', async (req, res) => {
//     try {
//         const { communityId } = req.params;
//         const { postId } = req.body;

//         // add postId to communities
//         const community = await Communities.findByIdAndUpdate(
//             communityId,
//             { $addToSet: { postIDs: postId } }, // use add to set to avoid duplicates
//             { new: true } // Return the update document
//         );

//         if (!community) 
//             return res.status(404).json({ message: 'Community not found' });

//         res.json(community);

//     } catch (err) {
//         console.error('Error updating community postIDs: ', err);
//         res.status(500).json({ message: 'Error updating community postIDs' });
//     }
// })


// Route to get all communities
router.get('/', async (req, res) => {
    try {
        const communities = await Communities.find();
        console.log(communities);
        res.json(communities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to create a new community
router.post('/', async (req, res) => {
    const newCommunity = new Communities(req.body);
    try {
        const savedCommunity = await newCommunity.save();
        res.status(201).json(savedCommunity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to get a specific community by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const community = await Communities.findById(req.params.id);
//         if (!community) return res.status(404).json({ message: "Community not found" });
//         res.json(community);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// Route to delete a community by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedCommunity = await Communities.findByIdAndDelete(req.params.id);
        if (!deletedCommunity) return res.status(404).json({ message: "Community not found" });
        res.json({ message: "Community deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

console.log("Community routes loaded");

module.exports = router;
