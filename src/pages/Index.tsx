
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import { ChatInterface } from '@/components/ChatInterface';
import { JourneyVisualizer, JourneyStep } from '@/components/JourneyVisualizer';
import { MapComponent } from '@/components/MapComponent';
import { PaymentPanel } from '@/components/PaymentPanel';
import { ContextualSuggestions } from '@/components/ContextualSuggestions';
import { PhotoTranslateModal } from '@/components/PhotoTranslateModal';
import { TicketWallet } from '@/components/TicketWallet';

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
  const [showOnboarding, setShowOnboarding] = useState(false); // Changed to false to prevent login flash
  const [showPhotoTranslate, setShowPhotoTranslate] = useState(false);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [showTicketWallet, setShowTicketWallet] = useState(false);
  const [destination, setDestination] = useState('');
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [routeOptions, setRouteOptions] = useState<JourneyStep[][]>([]);
  const [activeJourney, setActiveJourney] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [journeyState, setJourneyState] = useState<JourneyState>('none');
  const [selectedRouteOption, setSelectedRouteOption] = useState<number | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(100); // Updated to start with 100 points
  const [todaysRewards, setTodaysRewards] = useState(0); // Added today's rewards counter

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
    
    // Two route options - updated option 2 to Dublin Bus 16
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

    const dublinBusRoute: JourneyStep[] = [
      {
        id: 'start-bus',
        title: 'Start',
        icon: 'start',
        status: 'completed',
        details: {
          location: 'Dublin Airport',
          time: '13:30',
        }
      },
      {
        id: 'ticket-bus',
        title: 'Buy Ticket',
        icon: 'ticket',
        status: 'active',
        details: {
          price: '€3.30',
          time: 'Next bus: 13:50',
          instructions: 'Exact change only or Leap Card required',
        }
      },
      {
        id: 'bus-16',
        title: 'Dublin Bus 16',
        icon: 'bus',
        status: 'pending',
        details: {
          location: 'Stop 7041',
          time: '13:50 - 14:50',
        }
      },
      {
        id: 'arrive-bus',
        title: "O'Connell St",
        icon: 'finish',
        status: 'pending',
        details: {
          location: 'City Center',
          time: '14:50',
        }
      }
    ];
    
    // Set route options
    setRouteOptions([busRoute, dublinBusRoute]);
    setSelectedRouteOption(null);
    
    // Set initial journey steps to empty - will be populated when route is selected
    setJourneySteps([]);
    
    // Add contextual suggestions with updated football event message
    setSuggestions([
      {
        id: 'alert-1',
        type: 'alert',
        title: 'Football Event Alert',
        description: "There's a major football celebration near your route that may cause delays. The Aircoach Express Bus (Option 1) will be less affected by the disruption than the Dublin Bus 16 (Option 2).",
      }
    ]);
    
    // Add user response to chat
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: "How do I get to O'Connell Street from the airport?",
      timestamp: new Date()
    };
  };

  // Select a route option
  const selectRouteOption = (option: number) => {
    setSelectedRouteOption(option);
    setJourneyState('route_selected');
    setJourneySteps(routeOptions[option]);
    
    // Add user response to chat that they selected this option
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: option === 0 ? "I'll take the Aircoach Express Bus option." : "I'll take the Dublin Bus 16 option.",
      timestamp: new Date()
    };
    
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
    } else {
      // Dublin Bus option selected
      setSuggestions([
        {
          id: 'bus-info',
          type: 'info',
          title: 'Dublin Bus Information',
          description: 'Dublin Bus 16 requires exact change or a Leap Card. Student discounts need a Student Leap Card.',
        }
      ]);
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

    // Add user response to chat that they want to go to Govinda's
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: "Yes, I'd like to go to Govinda's Restaurant.",
      timestamp: new Date()
    };

    // Update suggestions
    setSuggestions([
      {
        id: 'info-1',
        type: 'info',
        title: 'Restaurant Info',
        description: "Govinda's is a popular vegan restaurant with hearty meals. Perfect match for your dietary preferences!",
      }
    ]);
  };

  const handleBuyTicket = () => {
    setShowPaymentPanel(true);
  };

  const handleViewTicketInWallet = () => {
    setShowTicketWallet(true);
  };

  const handleStepClick = (step: JourneyStep) => {
    if ((step.id === 'ticket' && step.status === 'active') || 
        (step.id === 'ticket-bus' && step.status === 'active')) {
      handleBuyTicket();
    }
    
    // Add handler for "View Ticket in Wallet" button
    if (step.id === 'bus' && step.status === 'active' && 
        (journeyState === 'ticket_purchased' || journeyState === 'boarding_bus' || journeyState === 'on_bus')) {
      handleViewTicketInWallet();
    }
  };

  const handlePaymentSuccess = (pointsEarned: number, pointsSpent: number) => {
    setShowPaymentPanel(false);
    setJourneyState('ticket_purchased');
    
    // Update loyalty points (add earned points, subtract spent points)
    setLoyaltyPoints(prev => prev + pointsEarned - pointsSpent);
    
    // Update today's rewards
    setTodaysRewards(prev => prev + pointsEarned);
    
    // Add user response to chat about purchasing ticket
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: "I've purchased my ticket for the Aircoach Express Bus.",
      timestamp: new Date()
    };
    
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
            
            // Add user response to chat that they boarded the bus
            const userMsg = {
              id: `user-${Date.now()}`,
              sender: 'user',
              text: "I've boarded the bus now.",
              timestamp: new Date()
            };
          },
        }
      }
    ]);
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
          onClick: () => {
            handleArrivalAtOConnell();
            
            // Add user response to chat that they arrived
            const userMsg = {
              id: `user-${Date.now()}`,
              sender: 'user',
              text: "I've arrived at O'Connell Street now.",
              timestamp: new Date()
            };
          },
        }
      }
    ]);
  };

  const handleArrivalAtOConnell = () => {
    setJourneyState('arrived_oconnell');
    
    // Show vegan restaurant suggestion with updated button text
    setSuggestions([
      {
        id: 'govindas-suggestion',
        type: 'offer',
        title: 'Vegan Restaurant Nearby',
        description: 'Govinda\'s Vegan Restaurant is just a 5-minute walk away. It matches your dietary preferences! Would you like to go there?',
        action: {
          label: 'Start New Journey',
          onClick: initializeGovindasJourney,
        }
      }
    ]);
  };

  const startWalkingToRestaurant = () => {
    setJourneyState('walking_to_restaurant');
    
    // Add user response to chat that they started walking
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: "I'm starting my walk to Govinda's Restaurant.",
      timestamp: new Date()
    };
    
    // Update suggestions with an "I've arrived" button
    setSuggestions([
      {
        id: 'walking',
        type: 'info',
        title: 'Walking to Govinda\'s',
        description: 'Follow the route on the map. It\'s about a 5 minute walk.',
      },
      {
        id: 'arrival-button',
        type: 'time',
        title: 'Arrival Confirmation',
        description: 'Let me know when you reach the restaurant.',
        action: {
          label: 'I\'ve Arrived at Govinda\'s',
          onClick: handleArrivalAtGovindas,
        }
      }
    ]);
  };

  const handleArrivalAtGovindas = () => {
    setJourneyState('arrived_govindas');
    
    // Add user response to chat that they arrived
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: "I've arrived at Govinda's Restaurant.",
      timestamp: new Date()
    };
    
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
    
    // Update suggestions
    setSuggestions([
      {
        id: 'arrived-govindas',
        type: 'info',
        title: 'Welcome to Govinda\'s!',
        description: 'You\'ve arrived at Govinda\'s Vegan Restaurant. Would you like to know about their menu?',
      },
      {
        id: 'mastercard-offer',
        type: 'offer',
        title: 'Mastercard Payment',
        description: 'Show your Mastercard when paying to receive a 10% discount on your meal!',
        action: {
          label: 'I\'ve Paid with Mastercard',
          onClick: handleMastercardPayment,
        }
      }
    ]);
  };

  // New function to handle Mastercard payment at Govinda's
  const handleMastercardPayment = () => {
    // Add 30 points for paying at Govinda's with Mastercard
    setLoyaltyPoints(prev => prev + 30);
    setTodaysRewards(prev => prev + 30);
    
    // Add user response to chat that they paid
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: "I've paid for my meal with my Mastercard.",
      timestamp: new Date()
    };
    
    // Update suggestions
    setSuggestions([
      {
        id: 'payment-complete',
        type: 'offer',
        title: 'Payment Complete',
        description: 'Thank you for using your Mastercard! You\'ve earned 30 loyalty points from this transaction.',
      }
    ]);
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
                  journeyState={journeyState}
                />
                
                {/* Additional action button for walking to restaurant if needed */}
                {journeyState === 'selecting_restaurant' && (
                  <Button 
                    onClick={startWalkingToRestaurant}
                    className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg"
                  >
                    Select Route
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
            
            {/* Loyalty info - changed to Today's Rewards */}
            {todaysRewards > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4">
                <h2 className="text-sm font-medium mb-3">Today's Rewards</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Points Earned Today</p>
                    <p className="text-2xl font-semibold">{todaysRewards}</p>
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
