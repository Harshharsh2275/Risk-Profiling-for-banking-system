const path = require('path');
const { VerificationRequest } = require('../../models/verificationSchema');
const { IndividualKYC } = require('../../models/kycSchema');
const { compareImages } = require('./imageComparison');
const { sendVerificationEmail } = require('./emailService');

// Perform automated verification
const automatedVerification = async (verificationId) => {
  try {
    const verificationRequest = await VerificationRequest.findById(verificationId);
    if (!verificationRequest) {
      return { success: false, message: 'Verification request not found' };
    }

    const kycRecord = await IndividualKYC.findById(verificationRequest.userId);
    if (!kycRecord) {
      return { success: false, message: 'KYC record not found' };
    }

    const originalPhotoPath = path.join(__dirname, '..', kycRecord.img_url);
    const comparisonResult = await compareImages(originalPhotoPath, verificationRequest.verificationPhoto);

    if (!comparisonResult.success) {
      return comparisonResult;
    }

    if (comparisonResult.similarityScore > 0.8) {
      verificationRequest.verificationStatus = 'verified';
      kycRecord.verificationStatus = 'verified';
      await kycRecord.save();
      await sendVerificationEmail(kycRecord.email, 'verified');
    } else if (comparisonResult.similarityScore > 0.5) {
      verificationRequest.verificationStatus = 'pending';
    } else {
      verificationRequest.verificationStatus = 'rejected';
      await sendVerificationEmail(kycRecord.email, 'rejected');
    }

    verificationRequest.verifiedAt = new Date();
    await verificationRequest.save();

    return {
      success: true,
      status: verificationRequest.verificationStatus,
      similarityScore: comparisonResult.similarityScore
    };
  } catch (error) {
    console.error('Error in automated verification:', error);
    return { success: false, message: 'Error in automated verification' };
  }
};

module.exports = { automatedVerification };
