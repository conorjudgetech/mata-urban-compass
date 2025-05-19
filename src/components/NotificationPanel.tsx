
import React from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Journey Started',
      description: 'Your journey to the airport has begun. Tap to view details.',
      time: '2 mins ago',
      read: false,
    },
    {
      id: '2',
      title: 'Ticket Purchased',
      description: 'Your Airport Express ticket has been purchased successfully.',
      time: '5 mins ago',
      read: false,
    },
    {
      id: '3',
      title: 'Route Update',
      description: 'Your bus will arrive in 5 minutes at stop #204.',
      time: '10 mins ago',
      read: true,
    },
  ];

  return (
    <Card className="w-[350px] max-w-[calc(100vw-2rem)] shadow-lg animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-mastercard-red" />
          <CardTitle>Notifications</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-md cursor-pointer border ${
                  !notification.read ? 'bg-gray-50 border-mastercard-red' : 'bg-transparent'
                }`}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-sm">{notification.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
