import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StepOne } from "./registration-steps/StepOne";
import { StepTwo } from "./registration-steps/StepTwo";
import { StepThree } from "./registration-steps/StepThree";
import { SuccessMessage } from "./registration-steps/SuccessMessage";
import { useToast } from "@/hooks/use-toast";

export interface StudentFormData {
  // Step 1 - Demographics
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date | undefined;
  email: string;
  mobile: string;
  profileImage: File | null;
  
  // Step 2 - Medical
  bloodGroup: string;
  allergies: string;
  medications: string;
  
  // Step 3 - Parent Info
  motherMobile: string;
  motherOccupation: string;
  fatherName: string;
  fatherMobile: string;
  motherName: string;
}

const initialFormData: StudentFormData = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: undefined,
  email: "",
  mobile: "",
  profileImage: null,
  bloodGroup: "",
  allergies: "",
  medications: "",
  motherMobile: "",
  motherOccupation: "",
  fatherName: "",
  fatherMobile: "",
  motherName: "",
};

export const StudentRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (data: Partial<StudentFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    try {
      // Store in localStorage (simulating file storage)
      const existingData = localStorage.getItem('students');
      const students = existingData ? JSON.parse(existingData) : [];
      
      const studentData = {
        ...formData,
        id: Date.now(),
        submittedAt: new Date().toISOString(),
        profileImageName: formData.profileImage?.name || null,
      };
      
      students.push(studentData);
      localStorage.setItem('students', JSON.stringify(students, null, 2));
      
      setIsSubmitted(true);
      toast({
        title: "Registration Successful",
        description: "Your registration has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <StepTwo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <StepThree
            formData={formData}
            updateFormData={updateFormData}
            onPrev={prevStep}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">
            Step {currentStep} of {totalSteps}
          </CardTitle>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};