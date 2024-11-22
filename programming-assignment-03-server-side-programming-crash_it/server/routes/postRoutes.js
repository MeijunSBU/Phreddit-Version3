// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const Posts = require('../models/posts'); // Adjust this to the correct path of your Posts model
const Community = require('../models/communities');

// Add commentID to post commentIDs
router.post('/:postId/commentIDs', async (req, res) => {
    try {
      const { postId } = req.params;
      const { commentID } = req.body;
  
      // add childId to parent comment
      const post = await Posts.findById(postId);
  
      if (!post) 
        return res.status(404).json({ message: 'Post not found' });
  
      console.log(commentID);
      post.commentIDs.push(commentID);
      await post.save();
  
      res.json(post);
  
    } catch (err) {
      console.error('Error updating parent comment commentIDs: ', err);
      res.status(500).json({ message: 'Error updating post commentIDs' });
    }
});

// Endpoint to increment and decrease the view count of a post
router.post('/:postId/views', async (req, res) => {
    try {
        const { postId } = req.params;
        const { decide } = req.body;

        let post = null;

        if ( decide === 1 )
        {
            // Decrease the view count by 1
            post = await Posts.findByIdAndUpdate(
                postId,
                { $inc: { views: -1 } },
                { new: true } // Return the update document
            );
        }
        else
        {
            // Increment the view count by 1
            post = await Posts.findByIdAndUpdate(
                postId,
                { $inc: { views: 1 } },
                { new: true } // Return the update document
            );
        }

        if (!post) 
            return res.status(404).json({ message: 'Post not found' });

        res.json(post);

    } catch (err) {
        console.error('Error updating view count: ', err);
        res.status(500).json({ message: 'Error updating views count' });
    }
})

// Route to get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to create a new post
router.post('/', async (req, res) => {
    const { title, content, linkFlairID, postedBy, postedDate, communityID, views, commentIDs } = req.body;
    
    const newPost = new Posts({
        title,
        content,
        linkFlairID,
        postedBy,
        postedDate,
        communityID,
        views,
        commentIDs
    });

    try {
        const savedPost = await newPost.save();

        const postCommunity = await Community.findById(communityID);
        postCommunity.postIDs.push(savedPost._id);

        await postCommunity.save();
        
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to get a specific post by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const post = await Posts.findById(req.params.id);
//         if (!post) return res.status(404).json({ message: "Post not found" });
//         res.json(post);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// Route to delete a post by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await Posts.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: "Post not found" });
        res.json({ message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
