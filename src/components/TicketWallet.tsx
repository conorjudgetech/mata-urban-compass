
import React from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Card, CardContent } from '@/components/ui/card';

interface Ticket {
  id: string;
  type: string;
  destination: string;
  validFrom: string;
  validUntil: string;
  qrCode: string;
}

interface TicketWalletProps {
  tickets: Ticket[];
}

export const TicketWallet: React.FC<TicketWalletProps> = ({ tickets }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span>My Tickets</span>
          {tickets.length > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-mastercard-red text-[10px] font-medium text-white">
              {tickets.length}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Your Tickets & Passes</DrawerTitle>
          <DrawerDescription>
            All your active and upcoming transit tickets
          </DrawerDescription>
        </DrawerHeader>
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
                      <div className="bg-black rounded-full px-2 py-1">
                        <span className="text-xs text-white">Active</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <span>Barcelona Central</span>
                        <ArrowRight className="h-3 w-3 mx-1" />
                        <span>{ticket.destination}</span>
                      </div>
                      <div className="mt-1">
                        Valid: {ticket.validFrom} - {ticket.validUntil}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="p-2 bg-white border border-gray-200 rounded-md">
                        {/* Placeholder for QR code */}
                        <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-500">QR Code</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-center mt-2 text-gray-500">
                      Scan this code to validate your ticket
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
