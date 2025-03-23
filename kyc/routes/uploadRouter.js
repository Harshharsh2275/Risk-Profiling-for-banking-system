const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const { Photo } = require('../models/kycSchema');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const search = require('./../models/kycSchema')
const Types = require('mongoose');
const { automatedVerification } = require('../services/verification/verificationService');
// Ensure DB connection is established
mongoose.connection.once('open', () => {
  console.log('MongoDB connection established for file storage.');
});

// Create the uploads folder if it doesn't exist
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Save in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  }
});
const upload = multer({ storage });

// Upload route with userId parameter
router.post('/uploads/:userId', upload.single('photo'), async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    // Construct the image URL
    const imgUrl = path.resolve(__dirname, `../uploads/${req.file.filename}`);

    // Find the user by userId and update the recentPhotograph field
    const updatedUser = await search.IndividualKYC.findOneAndUpdate(
      {userId: new mongoose.Types.ObjectId(userId)},
      { recentPhotograph: imgUrl },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Image uploaded and recentPhotograph updated successfully',
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      img_url: imgUrl,
      updatedUser
    });
  } catch (error) {
    console.error('Error uploading image or updating user:', error);
    res.status(500).json({ error: 'Image upload or user update failed' });
  }
});

router.post('/verify/:verificationId', async (req, res) => {
  const { verificationId } = req.params;

  try {
    const result = await automatedVerification(verificationId);
    res.json(result);
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;