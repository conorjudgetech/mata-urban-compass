import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MapPin, Navigation } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, DirectionsService } from '@react-google-maps/api';

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
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

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

  useEffect(() => {
    if (journeyState === 'selecting_restaurant' || journeyState === 'walking_to_restaurant') {
      const origin = { lat: 53.351155, lng: -6.260818 }; // O'Connell Street Upper -> 53.3511813,-6.2635439  53.351155, -6.260818
      const destination = { lat: 53.348247, lng: -6.260775 }; // Govinda's -> 53.3484103,-6.2634032

      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
    else if (journeyState === 'ticket_purchased') {
      const origin = { lat: 53.427464, lng: -6.243327 }; // Dublin Airport Terminal 1
      const destination = { lat: 53.428083, lng: -6.244144 }; // Bus Stop

      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
    else if (journeyState === 'boarding_bus' || journeyState === 'on_bus' || journeyState === 'arrived_oconnell') {
      const origin = { lat: 53.428083, lng: -6.244144 }; // Bus Stop
      const destination = { lat: 53.351155, lng: -6.260818 }; // O'Connell Street Upper

      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [journeyState]);

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
            <LoadScript googleMapsApiKey="API_KEY">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: 53.427464, lng: -6.243327 }}
                zoom={13}
              >
                {/* Static Markers */}
                {(journeyState === 'selecting_route' || journeyState === 'route_selected' || journeyState === 'ticket_purchased' || journeyState === 'boarding_bus' || journeyState === 'on_bus' || journeyState === 'arrived_oconnell') && (
                  <Marker position={{ lat: 53.427464, lng: -6.243327 }} label="Airport" />
                )}
                {(journeyState === 'ticket_purchased') && (
                  <Marker position={{ lat: 53.428083, lng: -6.244144 }} label="Bus Stop" />
                )}
                {(journeyState === 'selecting_route' || journeyState === 'route_selected' || journeyState === 'on_bus' || journeyState === 'arrived_oconnell'
                  || journeyState === 'selecting_restaurant' || journeyState === 'walking_to_restaurant' || journeyState === 'arrived_govindas') && (
                  <Marker position={{ lat: 53.351155, lng: -6.260818 }} label="O'Connell Street Upper" />
                )}
                {(journeyState === 'selecting_restaurant' || journeyState === 'walking_to_restaurant' || journeyState === 'arrived_govindas') && (
                  <Marker position={{ lat: 53.3439, lng: -6.2641 }} label="Govinda's" />
                )}

                {/* Directions Renderer */}
                {directions && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{ suppressMarkers: true }}
                  />
                )}
                {/*directions && <DirectionsRenderer directions={directions} />*/}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      )}
    </div>
  );
};
