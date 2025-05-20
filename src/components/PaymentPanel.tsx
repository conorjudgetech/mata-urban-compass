
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface PaymentOption {
  id: string;
  name: string;
  price: string;
  discount?: string;
  type: string;
}

interface PaymentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pointsEarned: number, pointsSpent: number) => void;
  destination: string;
  availablePoints: number;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({
  isOpen,
  onClose,
  onSuccess,
  destination,
  availablePoints,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<string>('student');
  const [selectedPayment, setSelectedPayment] = useState('mastercard');
  const [loading, setLoading] = useState(false);
  const [useRewards, setUseRewards] = useState(false);
  
  const ticketOptions: PaymentOption[] = [
    {
      id: 'adult',
      name: 'Adult Ticket',
      price: '€7.00',
      type: 'Standard',
    },
    {
      id: 'student',
      name: 'Student Single',
      price: '€5.00',
      discount: '30% off',
      type: 'Student ID Required',
    },
  ];
  
  const handlePurchase = () => {
    if (!selectedTicket) {
      toast.error('Please select a ticket option');
      return;
    }
    
    setLoading(true);
    
    // Points earned from purchase - 10 for bus ticket (changed from 50)
    const pointsEarned = 10;
    
    // Points spent if using rewards - 100 points for €1.00 discount (changed from 50)
    const pointsSpent = useRewards ? 100 : 0;
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onSuccess(pointsEarned, pointsSpent);
    }, 1500);
  };

  // Calculate final price after rewards if applied
  const getFinalPrice = () => {
    const basePrice = selectedTicket === 'student' ? 5.00 : 7.00;
    if (useRewards) {
      return `€${(basePrice - 1).toFixed(2)}`;
    }
    return `€${basePrice.toFixed(2)}`;
  };
  
  // Disable rewards checkbox if user doesn't have enough points (100 points needed)
  const canUseRewards = availablePoints >= 100;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 rounded-xl">
        <DialogHeader>
          <DialogTitle>Purchase Transit Ticket</DialogTitle>
          <DialogDescription>
            Bus to {destination} - Aircoach Express
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-3">Ticket Options</h4>
            <RadioGroup value={selectedTicket} onValueChange={setSelectedTicket}>
              {ticketOptions.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between space-x-2 border rounded-lg p-3 mb-2 hover:border-mastercard-red transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ticket.id} id={`ticket-${ticket.id}`} />
                    <Label htmlFor={`ticket-${ticket.id}`} className="flex flex-col">
                      <span>{ticket.name}</span>
                      <span className="text-xs text-gray-500">{ticket.type}</span>
                    </Label>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{ticket.price}</div>
                    {ticket.discount && (
                      <div className="text-xs text-green-600">{ticket.discount}</div>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-3">Payment Method</h4>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
              <div className="payment-method selected rounded-lg hover:border-mastercard-red transition-colors">
                <RadioGroupItem value="mastercard" id="payment-mastercard" />
                <div className="h-6 w-6 bg-gradient-to-r from-mastercard-red to-mastercard-yellow rounded-full ml-2"></div>
                <Label htmlFor="payment-mastercard" className="ml-2">Mastercard •••• 1234</Label>
              </div>
              <div className="payment-method mt-2 rounded-lg">
                <RadioGroupItem value="apple" id="payment-apple" />
                <div className="h-6 w-6 bg-black rounded-full flex items-center justify-center ml-2">
                  <span className="text-white text-xs">A</span>
                </div>
                <Label htmlFor="payment-apple" className="ml-2">Apple Pay</Label>
              </div>
              <div className="payment-method mt-2 rounded-lg">
                <RadioGroupItem value="google" id="payment-google" />
                <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center ml-2">
                  <span className="text-gray-500 text-xs">G</span>
                </div>
                <Label htmlFor="payment-google" className="ml-2">Google Pay</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mb-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rewards" 
                checked={useRewards} 
                onCheckedChange={(checked) => setUseRewards(!!checked)} 
                disabled={!canUseRewards}
              />
              <div>
                <Label htmlFor="rewards" className="font-medium">Use Rewards</Label>
                <p className="text-xs text-gray-500">
                  {canUseRewards 
                    ? `Use ${availablePoints >= 100 ? 100 : availablePoints} of your ${availablePoints} points for €1.00 discount` 
                    : `You need 100 points for a discount (you have ${availablePoints})`
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Subtotal:</span>
              <span>€{selectedTicket === 'student' ? '5.00' : '7.00'}</span>
            </div>
            {useRewards && (
              <div className="flex justify-between mb-2 text-green-600">
                <span className="text-sm">Rewards Applied:</span>
                <span>-€1.00</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>{getFinalPrice()}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={handlePurchase}
            disabled={!selectedTicket || loading}
            className="w-full bg-mastercard-red hover:bg-mastercard-red/90 rounded-lg"
          >
            {loading ? 'Processing...' : `Pay Now ${getFinalPrice()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
