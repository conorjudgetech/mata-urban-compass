
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  
  const nextStep = () => {
    if (step === 3) {
      onClose();
      return;
    }
    setStep(step + 1);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Mastercard Travel Assistant</DialogTitle>
          <DialogDescription>
            Let's set up your preferences to personalize your travel experience.
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dietary">Dietary Preferences</Label>
              <Select defaultValue="none">
                <SelectTrigger id="dietary">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No restrictions</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="gluten-free">Gluten-free</SelectItem>
                  <SelectItem value="halal">Halal</SelectItem>
                  <SelectItem value="kosher">Kosher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4 py-4">
            <h3 className="text-sm font-medium">Special Discounts Eligibility</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="student" className="flex-1">Student</Label>
                <Switch id="student" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="senior" className="flex-1">Senior (65+)</Label>
                <Switch id="senior" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="disability" className="flex-1">Disability</Label>
                <Switch id="disability" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="family" className="flex-1">Family Discount</Label>
                <Switch id="family" />
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4 py-4">
            <h3 className="text-sm font-medium">Payment Preferences</h3>
            <div className="space-y-3">
              <div className="payment-method selected">
                <div className="h-6 w-6 bg-gradient-to-r from-mastercard-red to-mastercard-yellow rounded-full"></div>
                <span>Mastercard</span>
              </div>
              <div className="payment-method">
                <div className="h-6 w-6 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">A</span>
                </div>
                <span>Apple Pay</span>
              </div>
              <div className="payment-method">
                <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xs">G</span>
                </div>
                <span>Google Pay</span>
              </div>
              <div className="payment-method">
                <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xs">$</span>
                </div>
                <span>Cash</span>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center space-x-2">
                <Switch id="location" defaultChecked />
                <Label htmlFor="location">Allow location access for better routing</Label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                We'll use your location to provide better transit recommendations.
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            onClick={nextStep} 
            className="w-full bg-mastercard-red hover:bg-mastercard-red/90">
            {step === 3 ? "Get Started" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
