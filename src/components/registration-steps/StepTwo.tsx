import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentFormData } from "../StudentRegistrationForm";
import { useToast } from "@/hooks/use-toast";

interface StepTwoProps {
  formData: StudentFormData;
  updateFormData: (data: Partial<StudentFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const bloodGroups = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

export const StepTwo = ({ formData, updateFormData, onNext, onPrev }: StepTwoProps) => {
  const { toast } = useToast();

  const validateStep = () => {
    if (!formData.bloodGroup) {
      toast({
        title: "Validation Error",
        description: "Please select your blood group.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground">Medical Information</h3>
        <p className="text-muted-foreground">Please provide your medical details</p>
      </div>

      <div className="space-y-2">
        <Label>Blood Group *</Label>
        <Select value={formData.bloodGroup} onValueChange={(value) => updateFormData({ bloodGroup: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your blood group" />
          </SelectTrigger>
          <SelectContent>
            {bloodGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies (Optional)</Label>
        <Textarea
          id="allergies"
          value={formData.allergies}
          onChange={(e) => updateFormData({ allergies: e.target.value })}
          placeholder="List any allergies you have"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications">Current Medications (Optional)</Label>
        <Textarea
          id="medications"
          value={formData.medications}
          onChange={(e) => updateFormData({ medications: e.target.value })}
          placeholder="List any medications you are currently taking"
          rows={3}
        />
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} className="px-8">
          Previous
        </Button>
        <Button onClick={handleNext} className="px-8">
          Next Step
        </Button>
      </div>
    </div>
  );
};