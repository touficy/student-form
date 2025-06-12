import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInYears } from "date-fns";
import { StudentFormData } from "../StudentRegistrationForm";
import { useToast } from "@/hooks/use-toast";

interface StepOneProps {
  formData: StudentFormData;
  updateFormData: (data: Partial<StudentFormData>) => void;
  onNext: () => void;
}

export const StepOne = ({ formData, updateFormData, onNext }: StepOneProps) => {
  const { toast } = useToast();

  const validateStep = () => {
    const requiredFields = ['firstName', 'lastName', 'gender', 'email', 'mobile'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof StudentFormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.dateOfBirth) {
      toast({
        title: "Validation Error",
        description: "Please select your date of birth.",
        variant: "destructive",
      });
      return false;
    }

    const age = differenceInYears(new Date(), formData.dateOfBirth);
    if (age < 18) {
      toast({
        title: "Validation Error",
        description: "You must be at least 18 years old to register.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.profileImage && !formData.profileImage.name.toLowerCase().endsWith('.png')) {
      toast({
        title: "Validation Error",
        description: "Profile image must be a .png file.",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateFormData({ profileImage: file });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground">Student Demographics</h3>
        <p className="text-muted-foreground">Please provide your basic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gender *</Label>
        <Select value={formData.gender} onValueChange={(value) => updateFormData({ gender: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : ''}
          onChange={(e) => {
            const date = e.target.value ? new Date(e.target.value) : undefined;
            updateFormData({ dateOfBirth: date });
          }}
          max={new Date().toISOString().split('T')[0]}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="Enter your email address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile">Mobile Number *</Label>
        <Input
          id="mobile"
          type="tel"
          value={formData.mobile}
          onChange={(e) => updateFormData({ mobile: e.target.value })}
          placeholder="Enter your mobile number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileImage">Profile Image (PNG only) *</Label>
        <Input
          id="profileImage"
          type="file"
          accept=".png"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        {formData.profileImage && (
          <p className="text-sm text-muted-foreground">
            Selected: {formData.profileImage.name}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={handleNext} className="px-8">
          Next Step
        </Button>
      </div>
    </div>
  );
};