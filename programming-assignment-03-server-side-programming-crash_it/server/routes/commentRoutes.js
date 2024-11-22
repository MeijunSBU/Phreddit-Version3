const express = require('express');
const router = express.Router();
const Comments = require('../models/comments');  // Adjust this to your Comments model

// Add commentID to parent comment's array
router.post('/:commentId/commentIDs', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { newCommentID } = req.body;

    // add childId to parent comment
    const parentComment = await Comments.findById(commentId);

    if (!parentComment) 
      return res.status(404).json({ message: 'Comment not found' });

    parentComment.commentIDs.push(newCommentID);
    await parentComment.save();

    res.json(parentComment);

  } catch (err) {
    console.error('Error updating parent comment commentIDs: ', err);
    res.status(500).json({ message: 'Error updating parent comment commentIDs' });
  }
});

// Route to get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comments.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a new comment
router.post('/', async (req, res) => {
  const newComment = new Comments(req.body);
  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to get a specific comment by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const comment = await Comments.findById(req.params.id);
//     if (!comment) return res.status(404).json({ message: "Comment not found" });
//     res.json(comment);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// Route to delete a comment by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedComment = await Comments.findByIdAndDelete(req.params.id);
    if (!deletedComment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
