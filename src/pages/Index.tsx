
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import { ChatInterface } from '@/components/ChatInterface';
import { JourneyVisualizer, JourneyStep } from '@/components/JourneyVisualizer';
import { MapComponent } from '@/components/MapComponent';
import { PaymentPanel } from '@/components/PaymentPanel';
import { ContextualSuggestions } from '@/components/ContextualSuggestions';
import { PhotoTranslateModal } from '@/components/PhotoTranslateModal';

// Journey state types
type JourneyState = 
  | 'none' 
  | 'selecting_route'
  | 'route_selected'
  | 'ticket_purchased'
  | 'boarding_bus'
  | 'on_bus'
  | 'arrived_oconnell'
  | 'selecting_restaurant'
  | 'walking_to_restaurant'
  | 'arrived_govindas';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showPhotoTranslate, setShowPhotoTranslate] = useState(false);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [destination, setDestination] = useState('');
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [routeOptions, setRouteOptions] = useState<JourneyStep[][]>([]);
  const [activeJourney, setActiveJourney] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [journeyState, setJourneyState] = useState<JourneyState>('none');
  const [selectedRouteOption, setSelectedRouteOption] = useState<number | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(50); // Initialize with 50 points

  // Simulate first-time visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('mata_visited');
    if (hasVisited) {
      setShowOnboarding(false);
    } else {
      localStorage.setItem('mata_visited', 'true');
    }
  }, []);

  // Initialize journey options for airport to O'Connell Street
  const initializeRouteOptions = () => {
    setDestination("O'Connell Street");
    setActiveJourney(true);
    setJourneyState('selecting_route');
    
    // Two route options
    const busRoute: JourneyStep[] = [
      {
        id: 'start',
        title: 'Start',
        icon: 'start',
        status: 'completed',
        details: {
          location: 'Dublin Airport',
          time: '13:30',
        }
      },
      {
        id: 'ticket',
        title: 'Buy Ticket',
        icon: 'ticket',
        status: 'active',
        details: {
          price: '€7.00 (€5.00 Student)',
          time: 'Next bus: 13:45',
          instructions: 'Student ID discount automatically applied',
        }
      },
      {
        id: 'bus',
        title: 'Aircoach Bus',
        icon: 'bus',
        status: 'pending',
        details: {
          location: 'Zone 16',
          time: '13:45 - 14:28',
        }
      },
      {
        id: 'arrive',
        title: "O'Connell St",
        icon: 'finish',
        status: 'pending',
        details: {
          location: 'City Center',
          time: '14:28',
        }
      }
    ];

    const taxiRoute: JourneyStep[] = [
      {
        id: 'start-taxi',
        title: 'Start',
        icon: 'start',
        status: 'completed',
        details: {
          location: 'Dublin Airport',
          time: '13:30',
        }
      },
      {
        id: 'taxi',
        title: 'Taxi',
        icon: 'bus', // Using 'bus' icon for taxi as it's one of the allowed values
        status: 'active',
        details: {
          price: '€30.00',
          time: 'Available now',
          instructions: 'More expensive but faster option',
        }
      },
      {
        id: 'arrive-taxi',
        title: "O'Connell St",
        icon: 'finish',
        status: 'pending',
        details: {
          location: 'City Center',
          time: '14:00',
        }
      }
    ];
    
    // Set route options
    setRouteOptions([busRoute, taxiRoute]);
    setSelectedRouteOption(null);
    
    // Set initial journey steps to empty - will be populated when route is selected
    setJourneySteps([]);
    
    // Add contextual suggestions
    setSuggestions([
      {
        id: 'alert-1',
        type: 'alert',
        title: 'Football Event Alert',
        description: "There's a major football celebration near your route that may cause delays. Consider our suggested alternative.",
      }
    ]);
  };

  // Select a route option
  const selectRouteOption = (option: number) => {
    setSelectedRouteOption(option);
    setJourneyState('route_selected');
    setJourneySteps(routeOptions[option]);
    
    // Update suggestions based on selection
    if (option === 0) {
      // Bus option selected
      setSuggestions([
        {
          id: 'offer-1',
          type: 'offer',
          title: 'Student Discount Available',
          description: 'Your student status qualifies you for a 30% discount on the Aircoach Express.',
        }
      ]);
      toast.success('Aircoach Express Bus route selected!');
    } else {
      // Taxi option selected
      setSuggestions([
        {
          id: 'taxi-info',
          type: 'info',
          title: 'Taxi Information',
          description: 'Taxis are available outside Terminal 1. Average wait time: 5 minutes.',
        }
      ]);
      toast.success('Taxi route selected!');
    }
  };

  // Initialize journey steps for city center journey (second leg to Govinda's)
  const initializeGovindasJourney = () => {
    setDestination("Govinda's Restaurant");
    setActiveJourney(true);
    setJourneyState('selecting_restaurant');
    setJourneySteps([
      {
        id: 'start',
        title: 'Start',
        icon: 'start',
        status: 'completed',
        details: {
          location: "O'Connell Street",
          time: '14:30',
        }
      },
      {
        id: 'walk',
        title: 'Walk',
        icon: 'walk',
        status: 'active',
        details: {
          distance: '0.2 km',
          time: '5 minutes',
        }
      },
      {
        id: 'arrive',
        title: "Govinda's",
        icon: 'finish',
        status: 'pending',
        details: {
          location: 'Middle Abbey Street',
          time: '14:35',
          instructions: 'Vegan restaurant with affordable meals',
        }
      }
    ]);

    // Add contextual suggestions
    setSuggestions([
      {
        id: 'info-1',
        type: 'info',
        title: 'Restaurant Info',
        description: "Govinda's is a popular vegan restaurant with hearty meals. Perfect match for your dietary preferences!",
      },
      {
        id: 'time-1',
        type: 'time',
        title: 'Open Hours',
        description: 'Open until 21:00 today. No reservation needed for lunch service.',
      },
      {
        id: 'loyalty',
        type: 'offer',
        title: 'Mastercard Loyalty',
        description: 'Pay with your Mastercard at Govinda\'s to earn 10 additional points!',
      }
    ]);
  };

  const handleBuyTicket = () => {
    setShowPaymentPanel(true);
  };

  const handleStepClick = (step: JourneyStep) => {
    if ((step.id === 'ticket' && step.status === 'active') || 
        (step.id === 'taxi' && step.status === 'active')) {
      handleBuyTicket();
    }
    
    // Add handler for "I've Arrived" button for walking to Govinda's
    if (step.id === 'walk' && step.status === 'active' && 
        journeyState === 'walking_to_restaurant') {
      handleArrivalAtGovindas();
    }
  };

  const handlePaymentSuccess = (pointsEarned: number, pointsSpent: number) => {
    setShowPaymentPanel(false);
    setJourneyState('ticket_purchased');
    
    // Update loyalty points (add earned points, subtract spent points)
    setLoyaltyPoints(prev => prev + pointsEarned - pointsSpent);
    
    // Update journey steps
    setJourneySteps(prevSteps => prevSteps.map(step => {
      if (step.id === 'ticket') {
        return { ...step, status: 'completed' };
      }
      if (step.id === 'bus') {
        return { ...step, status: 'active' };
      }
      return step;
    }));
    
    // Add ticket to wallet
    const newTicket = {
      id: Date.now().toString(),
      type: 'Aircoach Express Bus',
      destination: destination,
      validFrom: '19 May, 13:45',
      validUntil: '19 May, 23:59',
      qrCode: 'qr-code-placeholder',
      isActive: true
    };
    
    setTickets(prev => [...prev, newTicket]);
    
    // Update suggestions
    setSuggestions([
      {
        id: 'boarding',
        type: 'info',
        title: 'Boarding Information',
        description: 'Your bus leaves in 10 minutes from Zone 16. Head there now!',
        action: {
          label: 'I\'ve Boarded the Bus',
          onClick: () => {
            setJourneyState('boarding_bus');
            updateJourneyAfterBoarding();
          },
        }
      }
    ]);
    
    // Show success message
    toast.success(`Your ticket to ${destination} has been added to your wallet!`);
  };

  const updateJourneyAfterBoarding = () => {
    setJourneyState('on_bus');
    
    // Update journey steps
    setJourneySteps(prevSteps => prevSteps.map(step => {
      if (step.id === 'bus') {
        return { ...step, status: 'completed' };
      }
      if (step.id === 'arrive') {
        return { ...step, status: 'active' };
      }
      return step;
    }));
    
    // Update suggestions
    setSuggestions([
      {
        id: 'on-journey',
        type: 'info',
        title: 'On Your Journey',
        description: 'You\'re on your way to O\'Connell Street! Estimated arrival in 43 minutes.',
      },
      {
        id: 'arrival',
        type: 'time',
        title: 'Journey Progress',
        description: 'Your bus is making good progress through traffic.',
        action: {
          label: 'I\'ve Arrived at O\'Connell Street',
          onClick: handleArrivalAtOConnell,
        }
      }
    ]);
    
    toast.success('You\'ve boarded the Aircoach Express Bus!');
  };

  const handleArrivalAtOConnell = () => {
    setJourneyState('arrived_oconnell');
    
    // Show vegan restaurant suggestion
    setSuggestions([
      {
        id: 'govindas-suggestion',
        type: 'offer',
        title: 'Vegan Restaurant Nearby',
        description: 'Govinda\'s Vegan Restaurant is just a 5-minute walk away. It matches your dietary preferences!',
        action: {
          label: 'Get Directions',
          onClick: initializeGovindasJourney,
        }
      },
      {
        id: 'mastercard-rewards',
        type: 'info',
        title: 'Mastercard Rewards Update',
        description: 'You\'ve earned points for your bus journey! Use them on your next purchase.',
      }
    ]);
    
    toast.success('You\'ve arrived at O\'Connell Street!');
  };

  const handleArrivalAtGovindas = () => {
    setJourneyState('arrived_govindas');
    
    // Update journey steps
    setJourneySteps(prevSteps => prevSteps.map(step => {
      if (step.id === 'walk') {
        return { ...step, status: 'completed' };
      }
      if (step.id === 'arrive') {
        return { ...step, status: 'completed' };
      }
      return step;
    }));
    
    // Add 10 more points for arriving at Govindas
    setLoyaltyPoints(prev => prev + 10);
    
    // Update suggestions
    setSuggestions([
      {
        id: 'arrived-govindas',
        type: 'info',
        title: 'Welcome to Govinda\'s!',
        description: 'You\'ve arrived at Govinda\'s Vegan Restaurant. Enjoy your meal!',
      },
      {
        id: 'mastercard-offer',
        type: 'offer',
        title: 'Mastercard Special',
        description: 'Show your Mastercard when paying to receive a 10% discount on your meal!',
      }
    ]);
    
    toast.success('You\'ve arrived at Govinda\'s Restaurant!');
  };

  const handleSendMessage = (message: string) => {
    // Process user's message based on current journey state
    const lowerMessage = message.toLowerCase();
    
    if (journeyState === 'none') {
      // Initial journey request
      if (lowerMessage.includes("o'connell") || 
          lowerMessage.includes("airport") || 
          lowerMessage.includes("city center") || 
          lowerMessage.includes("downtown")) {
        initializeRouteOptions();
      }
    } 
    else if (journeyState === 'ticket_purchased') {
      // Check if user has boarded
      if (lowerMessage.includes("yes") || 
          lowerMessage.includes("boarded") || 
          lowerMessage.includes("on bus")) {
        updateJourneyAfterBoarding();
      }
    }
    else if (journeyState === 'on_bus') {
      // Check if user has arrived
      if (lowerMessage.includes("yes") || 
          lowerMessage.includes("arrived") || 
          lowerMessage.includes("at o'connell")) {
        handleArrivalAtOConnell();
      }
    }
    else if (journeyState === 'arrived_oconnell') {
      // Check if user wants to go to restaurant
      if (lowerMessage.includes("yes") || 
          lowerMessage.includes("govinda") || 
          lowerMessage.includes("restaurant") ||
          lowerMessage.includes("direction")) {
        initializeGovindasJourney();
      }
    }
    else if (journeyState === 'walking_to_restaurant') {
      // Check if user has arrived at restaurant
      if (lowerMessage.includes("yes") || 
          lowerMessage.includes("arrived") || 
          lowerMessage.includes("at govinda")) {
        handleArrivalAtGovindas();
      }
    }
  };

  const handleSuggestAction = (action: string) => {
    if (action === 'airport') {
      initializeRouteOptions();
    } else if (action === 'govindas') {
      initializeGovindasJourney();
    }
  };

  const startWalkingToRestaurant = () => {
    setJourneyState('walking_to_restaurant');
    toast.success('Walking directions to Govinda\'s shown on map');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header loyaltyPoints={loyaltyPoints} />
      
      <main className="flex-1 container mx-auto p-4 max-w-6xl">
        {/* Initial onboarding modal */}
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
        
        {/* Photo translate modal */}
        <PhotoTranslateModal
          isOpen={showPhotoTranslate}
          onClose={() => setShowPhotoTranslate(false)}
        />
        
        {/* Payment panel */}
        <PaymentPanel
          isOpen={showPaymentPanel}
          onClose={() => setShowPaymentPanel(false)}
          onSuccess={handlePaymentSuccess}
          destination={destination}
          availablePoints={loyaltyPoints}
        />
        
        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Chat */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
              {/* Map component */}
              <div className="border-b">
                <MapComponent 
                  journeyState={journeyState} 
                  destination={destination}
                />
              </div>
              
              {/* Chat interface */}
              <div className="h-[400px]">
                <ChatInterface 
                  onSendMessage={handleSendMessage}
                  onUploadImage={() => setShowPhotoTranslate(true)}
                  onSuggestAction={handleSuggestAction}
                  journeyState={journeyState}
                />
              </div>
            </div>
          </div>
          
          {/* Right column - Journey & Suggestions */}
          <div className="space-y-6">
            {/* Journey visualizer */}
            {activeJourney && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden p-4">
                <h2 className="text-sm font-medium mb-3">Your Journey to {destination}</h2>
                <JourneyVisualizer 
                  steps={journeySteps} 
                  onStepClick={handleStepClick}
                  routeOptions={journeyState === 'selecting_route' ? routeOptions : undefined}
                  onRouteSelect={selectRouteOption}
                  selectedRoute={selectedRouteOption}
                />
                
                {/* Additional action button for walking to restaurant if needed */}
                {journeyState === 'selecting_restaurant' && (
                  <Button 
                    onClick={startWalkingToRestaurant}
                    className="w-full mt-2 bg-mastercard-red hover:bg-mastercard-red/90 rounded-lg"
                  >
                    Start Walking
                  </Button>
                )}
              </div>
            )}
            
            {/* Contextual suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden p-4">
                <h2 className="text-sm font-medium mb-3">Smart Suggestions</h2>
                <ContextualSuggestions 
                  suggestions={suggestions}
                  onSuggestionSelect={() => {}}
                />
              </div>
            )}
            
            {/* Loyalty info */}
            {tickets.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4">
                <h2 className="text-sm font-medium mb-3">Mastercard Rewards</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Points Balance</p>
                    <p className="text-2xl font-semibold">{loyaltyPoints}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-mastercard-red to-mastercard-yellow rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">MC</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
