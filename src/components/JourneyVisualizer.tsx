
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
}

export const JourneyVisualizer: React.FC<JourneyVisualizerProps> = ({ 
  steps,
  onStepClick,
}) => {
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
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const handleStepClick = (step: JourneyStep) => {
    setExpandedStep(expandedStep === step.id ? null : step.id);
    onStepClick(step);
  };

  return (
    <div className="w-full mb-4">
      <div className="overflow-x-auto pb-4">
        <div className="flex items-center gap-4 min-w-max px-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={cn(
                  "journey-step",
                  step.status === 'active' && "active",
                  step.status === 'completed' && "completed"
                )}
                onClick={() => handleStepClick(step)}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-full",
                    step.status === 'completed' 
                      ? "bg-green-100 text-green-600" 
                      : step.status === 'active'
                        ? "bg-mastercard-red/10 text-mastercard-red"
                        : "bg-gray-100 text-gray-500"
                  )}>
                    {step.status === 'completed' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      getIcon(step.icon)
                    )}
                  </div>
                  <span className={cn(
                    "font-medium",
                    step.status === 'active' && "text-mastercard-red",
                    step.status === 'completed' && "text-green-600"
                  )}>
                    {step.title}
                  </span>
                </div>
                
                {expandedStep === step.id && step.details && (
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
                        {step.icon === 'ticket' ? 'Buy Ticket' : step.icon === 'bus' ? 'Book Bus' : 'Details'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className="journey-line flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
