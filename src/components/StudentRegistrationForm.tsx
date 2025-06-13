import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StepOne } from "./registration-steps/StepOne";
import { StepTwo } from "./registration-steps/StepTwo";
import { StepThree } from "./registration-steps/StepThree";
import { SuccessMessage } from "./registration-steps/SuccessMessage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const handleSubmit = async () => {
    try {
      let profileImageUrl = null;
      
      // Upload profile image if provided
      if (formData.profileImage) {
        const fileExt = formData.profileImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('student-profiles')
          .upload(fileName, formData.profileImage);
          
        if (uploadError) {
          throw new Error('Failed to upload profile image');
        }
        
        const { data: urlData } = supabase.storage
          .from('student-profiles')
          .getPublicUrl(fileName);
          
        profileImageUrl = urlData.publicUrl;
      }
      
      // Save student data to Supabase
      const { error } = await supabase
        .from('students')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth?.toISOString().split('T')[0],
          email: formData.email,
          mobile: formData.mobile,
          profile_image_url: profileImageUrl,
          blood_group: formData.bloodGroup,
          allergies: formData.allergies || null,
          medications: formData.medications || null,
          mother_name: formData.motherName || null,
          mother_mobile: formData.motherMobile,
          mother_occupation: formData.motherOccupation,
          father_name: formData.fatherName || null,
          father_mobile: formData.fatherMobile || null,
        });
      
      if (error) {
        throw error;
      }
      
      setIsSubmitted(true);
      toast({
        title: "Registration Successful",
        description: "Your registration has been submitted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error submitting your registration. Please try again.",
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