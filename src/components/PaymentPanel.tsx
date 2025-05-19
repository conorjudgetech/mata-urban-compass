
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
  onSuccess: () => void;
  destination: string;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({
  isOpen,
  onClose,
  onSuccess,
  destination,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('mastercard');
  const [loading, setLoading] = useState(false);
  
  const ticketOptions: PaymentOption[] = [
    {
      id: 'single',
      name: 'Single Ticket',
      price: '€3.00',
      type: 'Standard',
    },
    {
      id: 'day',
      name: 'Day Pass',
      price: '€8.50',
      type: 'Unlimited 24h',
    },
    {
      id: 'student',
      name: 'Student Single',
      price: '€1.50',
      discount: '50% off',
      type: 'Student ID Required',
    },
  ];
  
  const handlePurchase = () => {
    if (!selectedTicket) {
      toast.error('Please select a ticket option');
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onSuccess();
      toast.success('Ticket purchased successfully!');
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Transit Ticket</DialogTitle>
          <DialogDescription>
            Select your ticket to {destination}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-3">Ticket Options</h4>
            <RadioGroup value={selectedTicket || ''} onValueChange={setSelectedTicket}>
              {ticketOptions.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between space-x-2 border rounded-lg p-3 mb-2"
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
              <div className="payment-method selected">
                <RadioGroupItem value="mastercard" id="payment-mastercard" />
                <div className="h-6 w-6 bg-gradient-to-r from-mastercard-red to-mastercard-yellow rounded-full ml-2"></div>
                <Label htmlFor="payment-mastercard" className="ml-2">Mastercard •••• 1234</Label>
              </div>
              <div className="payment-method mt-2">
                <RadioGroupItem value="apple" id="payment-apple" />
                <div className="h-6 w-6 bg-black rounded-full flex items-center justify-center ml-2">
                  <span className="text-white text-xs">A</span>
                </div>
                <Label htmlFor="payment-apple" className="ml-2">Apple Pay</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Subtotal:</span>
              <span>€{selectedTicket === 'student' ? '1.50' : selectedTicket === 'day' ? '8.50' : '3.00'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Service Fee:</span>
              <span>€0.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>€{selectedTicket === 'student' ? '1.50' : selectedTicket === 'day' ? '8.50' : '3.00'}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={handlePurchase}
            disabled={!selectedTicket || loading}
            className="w-full bg-mastercard-red hover:bg-mastercard-red/90"
          >
            {loading ? 'Processing...' : 'Purchase Ticket'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
