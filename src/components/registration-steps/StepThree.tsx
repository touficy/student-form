import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentFormData } from "../StudentRegistrationForm";
import { useToast } from "@/hooks/use-toast";

interface StepThreeProps {
  formData: StudentFormData;
  updateFormData: (data: Partial<StudentFormData>) => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export const StepThree = ({ formData, updateFormData, onPrev, onSubmit }: StepThreeProps) => {
  const { toast } = useToast();

  const validateStep = () => {
    const requiredFields = ['motherMobile', 'motherOccupation'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof StudentFormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Mother's Mobile and Occupation).",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground">Parent Information</h3>
        <p className="text-muted-foreground">Please provide your parents' contact details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="motherName">Mother's Name (Optional)</Label>
          <Input
            id="motherName"
            value={formData.motherName}
            onChange={(e) => updateFormData({ motherName: e.target.value })}
            placeholder="Enter mother's name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherMobile">Mother's Mobile *</Label>
          <Input
            id="motherMobile"
            type="tel"
            value={formData.motherMobile}
            onChange={(e) => updateFormData({ motherMobile: e.target.value })}
            placeholder="Enter mother's mobile number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motherOccupation">Mother's Occupation *</Label>
        <Input
          id="motherOccupation"
          value={formData.motherOccupation}
          onChange={(e) => updateFormData({ motherOccupation: e.target.value })}
          placeholder="Enter mother's occupation"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fatherName">Father's Name (Optional)</Label>
          <Input
            id="fatherName"
            value={formData.fatherName}
            onChange={(e) => updateFormData({ fatherName: e.target.value })}
            placeholder="Enter father's name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherMobile">Father's Mobile (Optional)</Label>
          <Input
            id="fatherMobile"
            type="tel"
            value={formData.fatherMobile}
            onChange={(e) => updateFormData({ fatherMobile: e.target.value })}
            placeholder="Enter father's mobile number"
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} className="px-8">
          Previous
        </Button>
        <Button onClick={handleSubmit} className="px-8 bg-primary text-primary-foreground hover:bg-primary/90">
          Submit Registration
        </Button>
      </div>
    </div>
  );
};