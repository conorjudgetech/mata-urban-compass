
import React, { useState } from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationPanel } from './NotificationPanel';

export const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  
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
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-5 w-5" />
          <span className="notification-badge">3</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Travel Preferences</DropdownMenuItem>
            <DropdownMenuItem>Payment Methods</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {showNotifications && (
        <div className="absolute right-4 top-14 z-50">
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        </div>
      )}
    </header>
  );
};
