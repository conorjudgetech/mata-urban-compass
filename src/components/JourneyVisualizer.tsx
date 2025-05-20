
import React, { useState } from 'react';
import { 
  Check, 
  MapPin, 
  Bus, 
  Train, 
  Ticket, 
  Utensils, 
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface JourneyStep {
  id: string;
  title: string;
  icon: 'start' | 'ticket' | 'bus' | 'train' | 'switch' | 'eat' | 'finish' | 'walk';
  status: 'pending' | 'active' | 'completed';
  details?: {
    time?: string;
    price?: string;
    location?: string;
    instructions?: string;
    distance?: string;
  };
}

interface JourneyVisualizerProps {
  steps: JourneyStep[];
  onStepClick: (step: JourneyStep) => void;
  routeOptions?: JourneyStep[][];
  onRouteSelect?: (routeIndex: number) => void;
  selectedRoute?: number | null;
  journeyState?: string;
}

export const JourneyVisualizer: React.FC<JourneyVisualizerProps> = ({ 
  steps,
  onStepClick,
  routeOptions,
  onRouteSelect,
  selectedRoute,
  journeyState,
}) => {
  // Always expand the active step automatically
  const [expandedStep, setExpandedStep] = useState<string | null>(
    steps.find(step => step.status === 'active')?.id || null
  );
  
  const getIcon = (iconType: JourneyStep['icon']) => {
    switch (iconType) {
      case 'start':
        return <MapPin className="h-5 w-5" />;
      case 'ticket':
        return <Ticket className="h-5 w-5" />;
      case 'bus':
        return <Bus className="h-5 w-5" />;
      case 'train':
        return <Train className="h-5 w-5" />;
      case 'eat':
        return <Utensils className="h-5 w-5" />;
      case 'finish':
        return <MapPin className="h-5 w-5" />;
      case 'walk':
        return <ArrowUpRight className="h-5 w-5" />;
      case 'switch':
        return <ArrowRight className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const handleStepClick = (step: JourneyStep) => {
    setExpandedStep(expandedStep === step.id ? null : step.id);
    onStepClick(step);
  };

  // Show route options if they exist and no route is selected yet
  if (routeOptions && selectedRoute === null) {
    return (
      <div className="w-full mb-4">
        <div className="space-y-4">
          {routeOptions.map((routeSteps, index) => (
            <div 
              key={`route-${index}`} 
              className={cn(
                "p-4 border rounded-xl cursor-pointer transition-all",
                "hover:border-mastercard-red"
              )}
              onClick={() => onRouteSelect && onRouteSelect(index)}
            >
              <h3 className="font-medium mb-2">
                {index === 0 ? 'Option 1: Aircoach Express Bus' : 'Option 2: Taxi'}
              </h3>
              <div className="text-sm text-gray-600 mb-3">
                {index === 0 ? 
                 '€7.00 (€5.00 Student) • 43 minutes • Student discount available • Earn 10 points • Less affected by football event' :
                 '€30.00 • 25 minutes • No waiting time • May be delayed by football event'}
              </div>
              
              <div className="flex items-center space-x-2">
                {routeSteps.map((step, stepIndex) => (
                  <div key={step.id} className="flex items-center">
                    <div className={cn(
                      "p-1.5 rounded-full",
                      "bg-gray-100 text-gray-500"
                    )}>
                      {getIcon(step.icon)}
                    </div>
                    {stepIndex < routeSteps.length - 1 && (
                      <div className="px-1">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full mt-3 bg-mastercard-red hover:bg-mastercard-red/90 rounded-lg"
              >
                {index === 0 ? 'Select Bus' : 'Select Taxi'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-4">
      <div className="space-y-0">
        <div className="journey-steps-vertical">
          {steps.map((step, index) => (
            <div key={step.id} className="flex">
              <div className="journey-step-indicator">
                <div className={cn(
                  "journey-step-icon",
                  step.status === 'completed' ? "bg-green-100 text-green-600" : 
                  step.status === 'active' ? "bg-mastercard-red/10 text-mastercard-red" :
                  "bg-gray-100 text-gray-500"
                )}>
                  {step.status === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    getIcon(step.icon)
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={cn(
                    "journey-line-vertical",
                    steps[index + 1].status !== 'pending' ? "bg-green-500" : "bg-gray-200"
                  )}></div>
                )}
              </div>
              
              <div 
                className={cn(
                  "journey-step-content",
                  step.status === 'active' && "active",
                  step.status === 'completed' && "completed"
                )}
                onClick={() => handleStepClick(step)}
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium",
                    step.status === 'active' && "text-mastercard-red",
                    step.status === 'completed' && "text-green-600"
                  )}>
                    {step.title}
                  </span>
                </div>
                
                {(expandedStep === step.id || step.status === 'active') && step.details && (
                  <div className="mt-3 pt-3 border-t text-sm">
                    {step.details.time && (
                      <div className="flex justify-between mb-1">
                        <span>Time:</span>
                        <span className="font-medium">{step.details.time}</span>
                      </div>
                    )}
                    {step.details.price && (
                      <div className="flex justify-between mb-1">
                        <span>Price:</span>
                        <span className="font-medium">{step.details.price}</span>
                      </div>
                    )}
                    {step.details.location && (
                      <div className="flex justify-between mb-1">
                        <span>Location:</span>
                        <span className="font-medium">{step.details.location}</span>
                      </div>
                    )}
                    {step.details.distance && (
                      <div className="flex justify-between mb-1">
                        <span>Distance:</span>
                        <span className="font-medium">{step.details.distance}</span>
                      </div>
                    )}
                    {step.details.instructions && (
                      <div className="mt-2 text-xs text-gray-600">
                        {step.details.instructions}
                      </div>
                    )}
                    {step.status === 'active' && (
                      <Button className="w-full mt-2 bg-mastercard-red hover:bg-mastercard-red/90 rounded-lg">
                        {step.icon === 'ticket' ? 'Buy Ticket' : 
                         step.icon === 'bus' && journeyState === 'ticket_purchased' ? 'View Ticket in Wallet' :
                         step.icon === 'walk' && journeyState === 'walking_to_restaurant' ? "I've Arrived" : 
                         'Details'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
