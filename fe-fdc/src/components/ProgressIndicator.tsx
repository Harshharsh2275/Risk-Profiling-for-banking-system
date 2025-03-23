
import React from 'react';
import { Check } from 'lucide-react';
import { RegistrationStep } from '@/types';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: RegistrationStep;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 'personal-info', label: 'Personal Information' },
    { id: 'document-upload', label: 'Document Upload' },
    { id: 'photo-capture', label: 'Photo Verification' }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const isCompleted = (stepId: string) => {
    const currentStepIndex = getCurrentStepIndex();
    const stepIndex = steps.findIndex(step => step.id === stepId);
    return stepIndex < currentStepIndex;
  };

  const isActive = (stepId: string) => {
    return currentStep === stepId;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Indicator */}
            <div className="flex flex-col items-center relative">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted(step.id) 
                    ? "bg-brand-primary border-brand-primary text-white" 
                    : isActive(step.id)
                    ? "border-brand-primary text-brand-primary animate-pulse-slow"
                    : "border-muted-foreground text-muted-foreground"
                )}
              >
                {isCompleted(step.id) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span 
                className={cn(
                  "absolute -bottom-8 whitespace-nowrap text-sm font-medium",
                  isActive(step.id) ? "text-brand-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="w-full mx-4 max-w-28 h-0.5 relative">
                <div 
                  className={cn(
                    "absolute top-0 left-0 h-full", 
                    isCompleted(steps[index + 1].id) ? "bg-brand-primary w-full" : "bg-muted w-full"
                  )}
                />
                {isActive(steps[index + 1].id) && (
                  <div className="absolute top-0 left-0 h-full bg-brand-primary w-0 animate-[grow_0.5s_ease-out_forwards]" />
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
