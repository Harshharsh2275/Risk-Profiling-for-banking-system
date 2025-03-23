
import React, { useState } from 'react';
import { toast } from 'sonner';
import { RegistrationLayout } from '@/components/RegistrationLayout';
import { PersonalInfoForm } from '@/components/PersonalInfoForm';
import { DocumentUploadForm } from '@/components/DocumentUploadForm';
import { PhotoCaptureForm } from '@/components/PhotoCaptureForm';
import { RegistrationData, RegistrationStep } from '@/types';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal-info');
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({});
  const userId = JSON.parse(localStorage.getItem("user") || '""');
  const navigate = useNavigate();
  const handlePersonalInfoSubmit = (data: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    setCurrentStep('document-upload');
    window.scrollTo(0, 0);
    toast.success("Personal information saved successfully");
  };

  const handleDocumentUploadSubmit = (data: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    setCurrentStep('photo-capture');
    window.scrollTo(0, 0);
    toast.success("Documents uploaded successfully");
  };

  const handlePhotoSubmit = async (data: Partial<RegistrationData>) => {
    const completeData = { ...registrationData, ...data };
  
    console.log("Submitting data:", completeData);
  
    try {
      const response = await fetch(`http://localhost:3000/api/kyc/individual/${userId}`, {
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
      const formData = new FormData();
      formData.append('photo', data.photo.photo); // `imageFile` should be a File object
      const res = await fetch(`http://localhost:3000/api/uploads/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: formData
      });
      console.log('Registration Successful:', result);
  
      // Show success message
      toast.success("Registration completed successfully!");
  
      // Redirect after a delay
      setTimeout(() => {
        toast("Redirecting to dashboard...");
        // You can use Next.js router for redirection
        navigate('/validate');
      }, 2000);
  
    } catch (error) {
      console.error('Error submitting registration data:', error);
      toast.error("Failed to submit registration. Please try again.");
    }
  };
  

  const goBackToPreviousStep = () => {
    if (currentStep === 'document-upload') {
      setCurrentStep('personal-info');
    } else if (currentStep === 'photo-capture') {
      setCurrentStep('document-upload');
    }
    window.scrollTo(0, 0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal-info':
        return (
          <PersonalInfoForm 
            onSubmit={handlePersonalInfoSubmit}
            initialData={registrationData.personalInfo}
          />
        );
      case 'document-upload':
        return (
          <DocumentUploadForm 
            onSubmit={handleDocumentUploadSubmit}
            onBack={goBackToPreviousStep}
            initialData={registrationData.documents}
          />
        );
      case 'photo-capture':
        return (
          <PhotoCaptureForm 
            onSubmit={handlePhotoSubmit}
            onBack={goBackToPreviousStep}
            initialData={registrationData.photo}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'personal-info':
        return "Personal Information";
      case 'document-upload':
        return "Upload Your Documents";
      case 'photo-capture':
        return "Photo Verification";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 'personal-info':
        return "Please provide your details as they appear on your official documents";
      case 'document-upload':
        return "Upload clear scans or photos of your identity and address proof documents";
      case 'photo-capture':
        return "Take a photo for identity verification and fraud prevention";
      default:
        return "";
    }
  };

  return (
    <RegistrationLayout 
      currentStep={currentStep}
      title={getStepTitle()}
      subtitle={getStepSubtitle()}
    >
      <div className="animate-fade-in">
        {renderStepContent()}
      </div>
    </RegistrationLayout>
  );
};

export default Registration;
