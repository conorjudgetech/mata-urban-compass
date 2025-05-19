
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

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showPhotoTranslate, setShowPhotoTranslate] = useState(false);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [destination, setDestination] = useState('');
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [activeJourney, setActiveJourney] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Simulate first-time visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('mata_visited');
    if (hasVisited) {
      setShowOnboarding(false);
    } else {
      localStorage.setItem('mata_visited', 'true');
    }
  }, []);

  // Initialize journey steps for airport journey
  const initializeAirportJourney = () => {
    setDestination("O'Connell Street");
    setActiveJourney(true);
    setJourneySteps([
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
    ]);

    // Add contextual suggestions
    setSuggestions([
      {
        id: 'alert-1',
        type: 'alert',
        title: 'Football Event Alert',
        description: "There's a major football celebration near your route that may cause delays. Consider our suggested alternative.",
        action: {
          label: 'View Alternate Route',
          onClick: () => toast.info('Alternative routes would be shown here'),
        }
      },
      {
        id: 'offer-1',
        type: 'offer',
        title: 'Student Discount Available',
        description: 'Your student status qualifies you for a 30% discount on the Aircoach Express.',
        action: {
          label: 'Apply Discount',
          onClick: () => {
            toast.success('Student discount applied!');
            handleBuyTicket();
          },
        }
      }
    ]);
  };

  // Initialize journey steps for city center journey (second leg to Govinda's)
  const initializeGovindasJourney = () => {
    setDestination("Govinda's Restaurant");
    setActiveJourney(true);
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
        action: {
          label: 'See Menu',
          onClick: () => toast.info('Restaurant menu would be shown here'),
        }
      }
    ]);
  };

  const handleBuyTicket = () => {
    setShowPaymentPanel(true);
  };

  const handleStepClick = (step: JourneyStep) => {
    if (step.id === 'ticket' && step.status === 'active') {
      handleBuyTicket();
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentPanel(false);
    
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
    };
    
    setTickets(prev => [...prev, newTicket]);
    
    // Show success message
    toast.success(`Your ticket to ${destination} has been added to your wallet!`);
  };

  const handleSendMessage = (message: string) => {
    // Check for keywords in the message to trigger appropriate journeys
    if (message.toLowerCase().includes("o'connell") || 
        message.toLowerCase().includes("airport") || 
        message.toLowerCase().includes("city center") || 
        message.toLowerCase().includes("downtown")) {
      // Clear any existing journey before initializing a new one
      setJourneySteps([]);
      setSuggestions([]);
      
      // Add a small delay for visual effect
      setTimeout(() => {
        initializeAirportJourney();
      }, 800);
    } else if (message.toLowerCase().includes("govinda") || 
               message.toLowerCase().includes("restaurant") || 
               message.toLowerCase().includes("food") || 
               message.toLowerCase().includes("eat")) {
      // Clear any existing journey before initializing a new one
      setJourneySteps([]);
      setSuggestions([]);
      
      // Add a small delay for visual effect
      setTimeout(() => {
        initializeGovindasJourney();
      }, 800);
    }
  };

  const handleSuggestAction = (action: string) => {
    if (action === 'airport') {
      initializeAirportJourney();
    } else if (action === 'govindas') {
      initializeGovindasJourney();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      
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
        />
        
        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Chat */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
              {/* Map component */}
              <div className="border-b">
                <MapComponent />
              </div>
              
              {/* Chat interface */}
              <div className="h-[400px]">
                <ChatInterface 
                  onSendMessage={handleSendMessage}
                  onUploadImage={() => setShowPhotoTranslate(true)}
                  onSuggestAction={handleSuggestAction}
                />
              </div>
            </div>
          </div>
          
          {/* Right column - Journey & Suggestions */}
          <div className="space-y-6">
            {/* Journey visualizer */}
            {activeJourney && journeySteps.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden p-4">
                <h2 className="text-sm font-medium mb-3">Your Journey to {destination}</h2>
                <JourneyVisualizer 
                  steps={journeySteps} 
                  onStepClick={handleStepClick}
                />
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
                    <p className="text-xs text-gray-500 mb-1">Points Earned Today</p>
                    <p className="text-2xl font-semibold">50</p>
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
