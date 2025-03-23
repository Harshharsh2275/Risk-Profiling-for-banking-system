const jimp = require('jimp');

// Compare images using pixel difference (basic approach)
const compareImages = async (originalPhotoPath, verificationPhotoData) => {
  try {
    // Load original KYC photo
    const originalImage = await jimp.read(originalPhotoPath);

    // Load verification photo from base64 data
    const verificationPhotoBuffer = Buffer.from(
      verificationPhotoData.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
    const verificationImage = await jimp.read(verificationPhotoBuffer);

    // Resize for comparison
    originalImage.resize(200, 200);
    verificationImage.resize(200, 200);

    // Compute pixel difference and similarity
    const diff = jimp.diff(originalImage, verificationImage);
    const similarity = 1 - diff.percent;

    return {
      success: true,
      similarityScore: similarity,
      isMatch: similarity > 0.5 // Threshold for matching
    };
  } catch (error) {
    console.error('Error comparing images:', error);
    return { success: false, message: 'Error comparing images' };
  }
};

module.exports = { compareImages };
