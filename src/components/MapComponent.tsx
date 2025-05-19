
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MapPin, Navigation } from 'lucide-react';

interface MapComponentProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  journeyState?: string;
  destination?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  isExpanded = true,
  onToggleExpand,
  journeyState = 'none',
  destination = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(!isExpanded);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggleExpand) {
      onToggleExpand();
    }
  };

  // Define map title based on journey state
  const getMapTitle = () => {
    if (!destination) return "Dublin Map";
    
    if (journeyState === 'arrived_govindas') {
      return `Arrived at ${destination}`;
    }
    
    if (journeyState === 'arrived_oconnell') {
      return "Arrived at O'Connell Street";
    }
    
    return `Route to ${destination}`;
  };

  return (
    <div className={`relative bg-gray-100 overflow-hidden transition-all duration-300 rounded-lg border ${isCollapsed ? 'h-12' : 'h-64 md:h-96'}`}>
      <div 
        className="absolute top-0 left-0 right-0 h-12 bg-white dark:bg-gray-900 border-b flex items-center justify-between px-4 z-10 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-mastercard-red" />
          <span className="font-medium">{getMapTitle()}</span>
        </div>
        <Button variant="ghost" size="sm">
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="w-full h-full pt-12">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
            {/* Map placeholder */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              
              {/* Dublin Airport */}
              <div className="absolute left-1/4 top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-blue-500">
                <MapPin className="h-6 w-6" />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white px-1 rounded">
                  Dublin Airport
                </div>
              </div>
              
              {/* O'Connell Street */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-mastercard-red">
                <MapPin className="h-6 w-6" />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white px-1 rounded">
                  O'Connell Street
                </div>
              </div>
              
              {/* Govinda's Restaurant - only show if relevant */}
              {(journeyState === 'selecting_restaurant' || 
                journeyState === 'walking_to_restaurant' || 
                journeyState === 'arrived_govindas') && (
                <div className="absolute left-3/4 bottom-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500">
                  <MapPin className="h-6 w-6" />
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white px-1 rounded whitespace-nowrap">
                    Govinda's
                  </div>
                </div>
              )}
              
              {/* Route line from Airport to O'Connell Street - show except at arrival */}
              {journeyState !== 'arrived_oconnell' && 
               journeyState !== 'selecting_restaurant' && 
               journeyState !== 'walking_to_restaurant' && 
               journeyState !== 'arrived_govindas' && (
                <svg className="absolute inset-0 z-0" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M 25% 33% L 50% 50%" 
                    stroke="#EB001B" 
                    strokeWidth="3"
                    strokeDasharray={journeyState === 'on_bus' ? "0" : "5,5"}
                    fill="none"
                  />
                </svg>
              )}
              
              {/* Route line from O'Connell Street to Govinda's - only show if relevant */}
              {(journeyState === 'selecting_restaurant' || 
                journeyState === 'walking_to_restaurant' || 
                journeyState === 'arrived_govindas') && (
                <svg className="absolute inset-0 z-0" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M 50% 50% L 75% 50%" 
                    stroke="#22C55E" 
                    strokeWidth="3"
                    strokeDasharray={journeyState === 'walking_to_restaurant' ? "0" : "5,5"}
                    fill="none"
                  />
                </svg>
              )}
              
              {/* Current location - position dynamically based on journey state */}
              <div className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                journeyState === 'none' || 
                journeyState === 'selecting_route' || 
                journeyState === 'route_selected' || 
                journeyState === 'ticket_purchased' ? 'left-1/4 top-1/3' : 
                journeyState === 'boarding_bus' || 
                journeyState === 'on_bus' ? 'left-3/8 top-5/12' : 
                journeyState === 'arrived_oconnell' || 
                journeyState === 'selecting_restaurant' ? 'left-1/2 top-1/2' : 
                journeyState === 'walking_to_restaurant' ? 'left-5/8 top-1/2' : 
                journeyState === 'arrived_govindas' ? 'left-3/4 bottom-1/2' : 'left-3/8 top-5/12'
              }`}>
                <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse border-2 border-white"></div>
              </div>

              {/* Current vehicle if on bus */}
              {(journeyState === 'on_bus') && (
                <div className="absolute left-3/8 top-5/12 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-5 w-10 bg-yellow-500 rounded border border-yellow-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">BUS</span>
                  </div>
                </div>
              )}
            </div>
            <div className="z-10 bg-white p-2 rounded-md shadow-sm text-xs">
              {journeyState === 'none' ? 'Interactive map of Dublin' : 
               journeyState === 'selecting_route' ? 'Select a route option to see it on the map' : 
               journeyState === 'ticket_purchased' ? 'Your ticket is ready. Head to Zone 16 to board the bus.' : 
               journeyState === 'on_bus' ? 'You are currently on the Aircoach bus to O\'Connell Street.' : 
               journeyState === 'arrived_oconnell' ? 'You have arrived at O\'Connell Street. Explore nearby attractions!' : 
               journeyState === 'selecting_restaurant' ? 'View walking route to Govinda\'s Vegan Restaurant' : 
               journeyState === 'walking_to_restaurant' ? 'Follow the green path to reach Govinda\'s Restaurant' : 
               journeyState === 'arrived_govindas' ? 'You have arrived at Govinda\'s Restaurant. Enjoy your meal!' : 
               'Interactive map showing your route'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
