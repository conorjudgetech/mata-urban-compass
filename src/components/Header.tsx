
import React, { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TicketWallet } from './TicketWallet';
import { ProfileModal } from './ProfileModal';

export const Header: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);
  
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <div className="flex items-center gap-1">
            <div className="h-8 w-8 bg-mastercard-red rounded-full"></div>
            <div className="h-8 w-8 bg-mastercard-yellow rounded-full -ml-4"></div>
          </div>
          <span className="ml-2 font-semibold text-lg">MATA</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* My Tickets moved to the top navbar */}
        <TicketWallet />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-gray-200 rounded-xl shadow-lg p-2 w-48">
            <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowProfile(true)} className="rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Profile Modal */}
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </header>
  );
};
