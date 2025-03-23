import React, { useState } from 'react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { DocumentUploadForm } from './DocumentUploadForm';
import { PhotoCaptureForm } from './PhotoCaptureForm';
import { RegistrationLayout } from './RegistrationLayout';
import type { PhotoCapture, RegistrationData } from '@/types'; // Import the new type

export const RegistrationFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegistrationData>>({});

  const handleNext = (data: Partial<RegistrationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async (data: Partial<RegistrationData | PhotoCapture>) => {
    console.log("submiting");
    
    const completeData = { ...formData, ...data };
  
    try {
      const response = await fetch('http://localhost:3000/api/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completeData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit registration data.');
      }
  
      const result = await response.json();
      console.log('Registration Successful:', result);
    } catch (error) {
      console.error('Error submitting registration data:', error);
    }
  };

  return (
    <RegistrationLayout
      currentStep={step === 1 ? 'personal-info' : step === 2 ? 'document-upload' : 'photo-capture'}
      title={
        step === 1
          ? 'Personal Information'
          : step === 2
          ? 'Document Upload'
          : 'Photo Verification'
      }
      subtitle="Complete all steps to finish your registration."
    >
      {step === 1 && (
        <PersonalInfoForm
          onSubmit={handleNext}
          initialData={formData.personalInfo}
        />
      )}
      {step === 2 && (
        <DocumentUploadForm
          onSubmit={handleNext}
          onBack={handleBack}
          initialData={formData.documents}
        />
      )}
      {step === 3 && (
        <PhotoCaptureForm
          onSubmit={handleFinalSubmit}
          onBack={handleBack}
          initialData={formData.photo}
        />
      )}
    </RegistrationLayout>
  );
};
