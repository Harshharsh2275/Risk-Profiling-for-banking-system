const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Device Information Schema
const deviceInfoSchema = new Schema({
  macAddress: { type: String, required: true },
  ipAddress: { type: String, required: true },
  deviceFingerprint: { type: String },
  userAgent: { type: String },
  lastSeen: { type: Date, default: Date.now }
});

// Verification Request Schema
const verificationRequestSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'IndividualKYC', 
    required: [true, 'User ID is required'] 
  },
  deviceInfo: deviceInfoSchema,
  verificationPhoto: { type: String }, // Base64 encoded string or path to stored image
  verificationType: { 
    type: String, 
    enum: ['initial', 're-verification'], 
    default: 're-verification' 
  },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected', 'suspicious'], 
    default: 'pending' 
  },
  requestedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
  verificationAttempts: { type: Number, default: 1 },
  suspiciousActivity: {
    reason: { type: String },
    detectedAt: { type: Date },
    additionalDetails: { type: Schema.Types.Mixed }
  }
});

// Create a TTL index to automatically delete verification requests after 7 days if still pending
verificationRequestSchema.index({ "requestedAt": 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60, partialFilterExpression: { verificationStatus: "pending" } });

module.exports = {
  DeviceInfo: mongoose.model('DeviceInfo', deviceInfoSchema),
  VerificationRequest: mongoose.model('VerificationRequest', verificationRequestSchema)
};