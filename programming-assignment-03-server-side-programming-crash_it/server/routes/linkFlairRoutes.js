const express = require('express');
const router = express.Router();
const LinkFlairs = require('../models/linkflairs');  // Adjust this to your LinkFlairs model

// Route to get all link flairs
router.get('/', async (req, res) => {
  try {
    const linkFlairs = await LinkFlairs.find();
    res.json(linkFlairs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a new link flair
router.post('/', async (req, res) => {
  const newLinkFlair = new LinkFlairs(req.body);
  try {
    const savedLinkFlair = await newLinkFlair.save();
    res.status(201).json(savedLinkFlair);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to get a specific link flair by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const linkFlair = await LinkFlairs.findById(req.params.id);
//     if (!linkFlair) return res.status(404).json({ message: "LinkFlair not found" });
//     res.json(linkFlair);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



// Route to delete a link flair by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedLinkFlair = await LinkFlairs.findByIdAndDelete(req.params.id);
    if (!deletedLinkFlair) return res.status(404).json({ message: "LinkFlair not found" });
    res.json({ message: "LinkFlair deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
