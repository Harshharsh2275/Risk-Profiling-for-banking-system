const express = require('express');
const {
  initiateInitialVerification,
  initiateReverification,
  submitReverificationPhoto,
  checkVerificationStatus,
  processVerification,
  getPendingVerifications,
  getUserVerificationHistory,
  getCurrentVerificationStatus
} = require('../Controllers/verificationController');

const router = express.Router();

// Route for initiating initial verification after KYC
router.post('/initial/:userId', initiateInitialVerification);

// Route for initiating re-verification
router.post('/initiate', initiateReverification);

// Route for submitting photo during re-verification
router.post('/:verificationId/submit-photo', submitReverificationPhoto);

// Route for checking verification status
router.get('/:verificationId/status', checkVerificationStatus);

// Route for getting current user verification status
router.get('/status/current', getCurrentVerificationStatus);

// Route for getting user's verification history
router.get('/history', getUserVerificationHistory);

// Admin routes
router.get('/pending', getPendingVerifications);
router.put('/:verificationId/process', processVerification);

module.exports = router;