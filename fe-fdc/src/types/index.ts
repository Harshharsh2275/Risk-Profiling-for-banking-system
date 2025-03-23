export type IdentityProofType = 
  | 'Aadhaar Card'
  | 'Passport'
  | 'Voter ID Card'
  | 'Driving License'
  | 'NREGA Job Card'
  | 'PAN Card';

export type AddressProofType = 
  | 'Aadhaar Card'
  | 'Passport'
  | 'Voter ID Card'
  | 'Driving License'
  | 'Utility Bill'
  | 'Bank Statement'
  | 'Employer Letter';

export type BusinessType = 'Company' | 'Partnership' | 'Trust';

export type RiskCategory = 'High' | 'Medium' | 'Low';

export type RiskProfile = 'PEP' | 'NRI' | 'High-Risk Country';

export type RegistrationStep = 'personal-info' | 'document-upload' | 'photo-capture';

export interface PersonalInfo {
  name: string;
  dateOfBirth: Date | null;
  identityProofType: IdentityProofType;
  identityProofNumber: string;
  identityProofIssueDate?: Date | null;
  identityProofExpiryDate?: Date | null;
  addressProofType: AddressProofType;
  addressProofNumber: string;
  addressProofValidTill?: Date | null;
  panCard: string;
  riskCategory: RiskCategory;
}

export interface DocumentUploads {
  photo: File | null;
  addressProofDocument: File | null;
  panCardDocument: File | null;
  signatureDocument: File | null;
}


export interface PhotoCapture {
  photo: File | null; // Base64 encoded string
}

export interface RegistrationData {
  personalInfo: PersonalInfo;
  documents: DocumentUploads;
  photo: PhotoCapture;
}

export enum VerificationStatus {
  VERIFIED = "verified",
  REJECTED = "rejected",
  SUSPENDED = "suspicious",
  PENDING = "pending"
}
