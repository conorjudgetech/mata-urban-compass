
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-5 w-5 ml-2"
                >
                  <circle cx="18" cy="24" r="10" fill="#EB001B" />
                  <circle cx="30" cy="24" r="10" fill="#F79E1B" />
                  <path
                    d="M23 24c0-4.4 2.4-8.3 6-10.3 -1.3-0.5-2.7-0.7-4-0.7 -5.5 0-10 4.5-10 10s4.5 10 10 10c1.4 0 2.7-0.2 4-0.7 -3.6-2-6-5.9-6-10.3z"
                    fill="#FF5F00"
                  />
                </svg>
                <Label htmlFor="payment-mastercard" className="ml-2">Mastercard •••• 1234</Label>
              </div>
              <div className="payment-method mt-2 rounded-lg">
                <RadioGroupItem value="apple" id="payment-apple" />
                <svg
                  viewBox="0 0 17 21"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-black items-center justify-center ml-1"
                  fill="#000000"
                >
                  <path d="M13.63 10.78c-.01-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.78-3.32-1.81-1.41-.14-2.75.83-3.47.83-.72 0-1.84-.81-3.02-.79-1.55.02-2.99.9-3.79 2.29-1.61 2.8-.41 6.93 1.16 9.2.77 1.12 1.68 2.37 2.89 2.32 1.17-.05 1.62-.75 3.05-.75 1.42 0 1.83.75 3.06.73 1.27-.02 2.07-1.13 2.82-2.26.89-1.3 1.25-2.56 1.27-2.63-.03-.01-2.43-.93-2.45-3.68zm-2.29-7c.63-.77 1.06-1.84.94-2.9-.91.04-2 .6-2.65 1.37-.58.67-1.09 1.75-.96 2.78 1 .08 2.03-.5 2.67-1.25z" />
                </svg>
                <Label htmlFor="payment-apple" className="ml-2">Apple Pay</Label>
              </div>
              <div className="payment-method mt-2 rounded-lg">
                <RadioGroupItem value="google" id="payment-google" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="h-4 w-4 items-center justify-center ml-2" >
                  <path fill="#4285F4" d="M533.5 278.4c0-17.5-1.4-34.5-4.1-50.9H272v96.5h146.9c-6.4 34.8-25.2 64.3-53.5 84v69h86.3c50.5-46.5 81.8-115 81.8-198.6z" />
                  <path fill="#34A853" d="M272 544.3c72.9 0 134-24.2 178.6-65.6l-86.3-69c-24 16.1-54.6 25.6-92.3 25.6-70.9 0-131-47.9-152.5-112.1H32v70.6c44.7 88.1 136.4 150.5 240 150.5z" />
                  <path fill="#FBBC05" d="M119.5 323.2c-10.1-30.3-10.1-62.8 0-93.1V159.5H32c-44.7 88.1-44.7 192.4 0 280.5l87.5-70.6z" />
                  <path fill="#EA4335" d="M272 107.5c39.7 0 75.4 13.6 103.5 40.3l77.6-77.6C406 24.3 344.9 0 272 0 168.4 0 76.7 62.4 32 150.5l87.5 70.6C141 155.4 201.1 107.5 272 107.5z" />
                </svg>
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
