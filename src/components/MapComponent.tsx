
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';

interface MapComponentProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  isExpanded = true,
  onToggleExpand,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(!isExpanded);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggleExpand) {
      onToggleExpand();
    }
  };

  return (
    <div className={`relative bg-gray-100 overflow-hidden transition-all duration-300 rounded-lg border ${isCollapsed ? 'h-12' : 'h-64 md:h-96'}`}>
      <div 
        className="absolute top-0 left-0 right-0 h-12 bg-white dark:bg-gray-900 border-b flex items-center justify-between px-4 z-10"
        onClick={handleToggle}
      >
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-mastercard-red" />
          <span className="font-medium">Live Navigation</span>
        </div>
        <Button variant="ghost" size="sm">
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="w-full h-full pt-12">
          {/* This would be where the actual map goes */}
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
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-mastercard-red">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="absolute left-1/4 top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-blue-500">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="absolute left-3/4 bottom-1/3 transform -translate-x-1/2 -translate-y-1/2 text-green-500">
                <MapPin className="h-6 w-6" />
              </div>
            </div>
            <span className="text-gray-400 z-10">Map view - Interactive map will appear here</span>
          </div>
        </div>
      )}
    </div>
  );
};
