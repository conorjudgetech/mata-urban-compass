
import React from 'react';
import { Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface TicketData {
  id: string;
  type: string;
  destination: string;
  validFrom: string;
  validUntil: string;
  qrCode: string;
  isActive: boolean;
}

export const TicketWallet: React.FC = () => {
  // Sample tickets - one active, two inactive
  const tickets: TicketData[] = [
    {
      id: '1',
      type: 'Aircoach Express Bus',
      destination: "O'Connell Street",
      validFrom: '19 May, 13:45',
      validUntil: '19 May, 23:59',
      qrCode: 'qr-code-placeholder',
      isActive: true
    },
    {
      id: '2',
      type: 'Train',
      destination: 'Barcelona to Madrid',
      validFrom: '01 May, 10:00',
      validUntil: '01 May, 23:59',
      qrCode: 'qr-code-placeholder',
      isActive: false
    },
    {
      id: '3',
      type: 'Luas Tram',
      destination: 'Dublin City',
      validFrom: '02 May, 09:30',
      validUntil: '02 May, 23:59',
      qrCode: 'qr-code-placeholder',
      isActive: false
    }
  ];

  const activeTickets = tickets.filter(ticket => ticket.isActive);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Ticket className="h-4 w-4" />
          <span className="hidden sm:inline">My Tickets</span>
          {activeTickets.length > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-mastercard-red text-[10px] font-medium text-white">
              {activeTickets.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Tickets & Passes</DialogTitle>
          <DialogDescription>
            All your active and upcoming transit tickets
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 pb-6">
          {tickets.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No tickets in your wallet yet
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden">
                  <div className="h-2 mastercard-gradient w-full" />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{ticket.type}</h3>
                      <div className={`rounded-full px-2 py-1 text-xs text-white ${ticket.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                        {ticket.isActive ? 'Active' : 'Expired'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <span>Dublin Airport</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-1">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{ticket.destination}</span>
                      </div>
                      <div className="mt-1">
                        Valid: {ticket.validFrom} - {ticket.validUntil}
                      </div>
                    </div>
                    {ticket.isActive && (
                      <>
                        <div className="flex justify-center">
                          <div className="p-2 bg-white border border-gray-200 rounded-md">
                            {/* QR code placeholder - in a real app, this would be generated */}
                            <div className="w-32 h-32 bg-[url('/qr-code-example.svg')] bg-contain bg-no-repeat bg-center">
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-center mt-2 text-gray-500">
                          Booking Reference: ABC123456 • Scan to validate
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
