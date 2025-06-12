import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export const SuccessMessage = () => {
  const handleNewRegistration = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Registration Successful!
          </h2>
          
          <div className="bg-accent/20 rounded-lg p-6 mb-6">
            <p className="text-lg text-foreground leading-relaxed">
              Thank you for your submission. Our team will review your details and contact you within 2 working days.
            </p>
          </div>
          
          <div className="space-y-4 text-muted-foreground">
            <p>
              You will receive a confirmation email at the address you provided.
            </p>
            <p>
              If you have any questions, please don't hesitate to contact our admissions office.
            </p>
          </div>
          
          <Button 
            onClick={handleNewRegistration}
            className="mt-8"
            variant="outline"
          >
            Submit Another Registration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};