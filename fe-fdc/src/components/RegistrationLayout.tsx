
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';
import { RegistrationStep } from '@/types';

interface RegistrationLayoutProps {
  children: React.ReactNode;
  currentStep: RegistrationStep;
  title: string;
  subtitle: string;
}

export const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({
  children,
  currentStep,
  title,
  subtitle
}) => {
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-surface to-white flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={handleBackToHome}
        >
          
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Lock className="h-4 w-4 mr-1" />
          
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <ProgressIndicator currentStep={currentStep} />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="heading-2 text-brand-dark mb-2">{title}</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">{subtitle}</p>
          </div>
          
          {children}
          
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Your data is encrypted and securely stored following industry standards.</p>
            <p className="mt-1">We comply with all KYC/AML regulations.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
