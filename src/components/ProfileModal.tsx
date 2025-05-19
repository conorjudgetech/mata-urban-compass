
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
          <DialogDescription>
            Review and update your personal information and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" value="Conor" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value="Judge" readOnly />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value="conor.judge@example.com" readOnly />
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-mastercard-red rounded-full flex items-center justify-center text-white text-xs font-medium">S</div>
              <span>Student</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Dietary Preference</Label>
            <Select defaultValue="vegan">
              <SelectTrigger>
                <SelectValue placeholder="Select dietary preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="none">No Preference</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup defaultValue="mastercard">
              <div className="flex items-center space-x-2 border p-2 rounded-md">
                <RadioGroupItem value="mastercard" id="mastercard" />
                <div className="h-6 w-6 bg-gradient-to-r from-mastercard-red to-mastercard-yellow rounded-full"></div>
                <Label htmlFor="mastercard">Mastercard •••• 1234</Label>
              </div>
              <div className="flex items-center space-x-2 border p-2 rounded-md mt-2">
                <RadioGroupItem value="apple" id="apple" />
                <div className="h-6 w-6 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">A</span>
                </div>
                <Label htmlFor="apple">Apple Pay</Label>
              </div>
              <div className="flex items-center space-x-2 border p-2 rounded-md mt-2">
                <RadioGroupItem value="google" id="google" />
                <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xs">G</span>
                </div>
                <Label htmlFor="google">Google Pay</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Travel Preference</Label>
            <Select defaultValue="budget">
              <SelectTrigger>
                <SelectValue placeholder="Select travel preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="eco">Low-emissions</SelectItem>
                <SelectItem value="fast">Fastest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
