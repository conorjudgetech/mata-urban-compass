import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Languages, Utensils, Bus, Train } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import { ChatInterface } from '@/components/ChatInterface';
import { JourneyVisualizer, JourneyStep } from '@/components/JourneyVisualizer';
import { MapComponent } from '@/components/MapComponent';
import { PaymentPanel } from '@/components/PaymentPanel';
import { TicketWallet } from '@/components/TicketWallet';
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
    setDestination('Airport');
    setActiveJourney(true);
    setJourneySteps([
      {
        id: 'start',
        title: 'Start',
        icon: 'start',
        status: 'completed',
        details: {
          location: 'Barcelona Central',
          time: '13:30',
        }
      },
      {
        id: 'ticket',
        title: 'Buy Ticket',
        icon: 'ticket',
        status: 'active',
        details: {
          price: '€12.50 (Standard) / €7.50 (Student)',
          time: 'Next bus: 13:45',
          instructions: 'Student ID required for discount',
        }
      },
      {
        id: 'bus',
        title: 'Board Bus',
        icon: 'bus',
        status: 'pending',
        details: {
          location: 'Stop #204',
          time: '13:45 - 14:30',
        }
      },
      {
        id: 'arrive',
        title: 'Airport',
        icon: 'finish',
        status: 'pending',
        details: {
          location: 'Terminal 2',
          time: '14:30',
        }
      }
    ]);

    // Add contextual suggestions
    setSuggestions([
      {
        id: 'alert-1',
        type: 'alert',
        title: 'Football Event Alert',
        description: 'There\'s a major football event near your route that may cause delays. Consider alternative route.',
        action: {
          label: 'View Details',
          onClick: () => toast.info('Alternative routes would be shown here'),
        }
      },
      {
        id: 'offer-1',
        type: 'offer',
        title: 'Student Discount Available',
        description: 'We noticed you qualify for a 40% student discount on the Airport Express.',
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

  // Initialize journey steps for city center journey
  const initializeCityCenterJourney = () => {
    setDestination('City Center');
    setActiveJourney(true);
    setJourneySteps([
      {
        id: 'start',
        title: 'Start',
        icon: 'start',
        status: 'completed',
        details: {
          location: 'Your Location',
          time: '13:30',
        }
      },
      {
        id: 'ticket',
        title: 'Buy Ticket',
        icon: 'ticket',
        status: 'active',
        details: {
          price: '€2.40 (One-way)',
          time: 'Next train: 13:40',
        }
      },
      {
        id: 'train',
        title: 'Metro L3',
        icon: 'train',
        status: 'pending',
        details: {
          location: 'Diagonal Station',
          time: '13:40 - 14:00',
        }
      },
      {
        id: 'arrive',
        title: 'Catalunya',
        icon: 'finish',
        status: 'pending',
        details: {
          location: 'Plaza Catalunya',
          time: '14:00',
        }
      }
    ]);

    // Add contextual suggestions
    setSuggestions([
      {
        id: 'info-1',
        type: 'info',
        title: 'Metro Info',
        description: 'The L3 line runs every 4 minutes during peak hours.',
      },
      {
        id: 'time-1',
        type: 'time',
        title: 'Free Time Before Train',
        description: 'You have about 10 minutes before your train. There\'s a café nearby if you want a quick coffee.',
        action: {
          label: 'Show Nearby',
          onClick: () => toast.info('Nearby café options would be shown here'),
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
      if (step.id === 'bus' || step.id === 'train') {
        return { ...step, status: 'active' };
      }
      return step;
    }));
    
    // Add ticket to wallet
    const newTicket = {
      id: Date.now().toString(),
      type: destination === 'Airport' ? 'Airport Express' : 'Metro Day Pass',
      destination: destination,
      validFrom: '19 May, 13:40',
      validUntil: '19 May, 23:59',
      qrCode: 'qr-code-placeholder',
    };
    
    setTickets(prev => [...prev, newTicket]);
    
    // Show success message
    toast.success(`Your ticket to ${destination} has been added to your wallet!`);
  };

  const handleSuggestAction = (action: string) => {
    if (action === 'airport') {
      initializeAirportJourney();
    } else if (action === 'city-center') {
      initializeCityCenterJourney();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6 max-w-6xl">
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
        
        {/* App title and wallet */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mastercard Travel Assistant</h1>
          <TicketWallet tickets={tickets} />
        </div>
        
        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Chat */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
              {/* Journey visualizer */}
              {activeJourney && journeySteps.length > 0 && (
                <div className="p-4 border-b">
                  <h2 className="text-sm font-medium mb-3">Your Journey to {destination}</h2>
                  <JourneyVisualizer 
                    steps={journeySteps} 
                    onStepClick={handleStepClick}
                  />
                </div>
              )}
              
              {/* Map component */}
              <div className="border-b">
                <MapComponent />
              </div>
              
              {/* Chat interface */}
              <div className="h-[400px]">
                <ChatInterface 
                  onSendMessage={() => {}}
                  onUploadImage={() => setShowPhotoTranslate(true)}
                  onSuggestAction={handleSuggestAction}
                />
              </div>
            </div>
          </div>
          
          {/* Right column - Contextual info */}
          <div className="space-y-6">
            {/* Contextual suggestions */}
            {suggestions.length > 0 && (
              <div>
                <h2 className="text-sm font-medium mb-3">Smart Suggestions</h2>
                <ContextualSuggestions 
                  suggestions={suggestions}
                  onSuggestionSelect={() => {}}
                />
              </div>
            )}
            
            {/* Tools and quick actions */}
            <div>
              <h2 className="text-sm font-medium mb-3">Helpful Tools</h2>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setShowPhotoTranslate(true)}
                >
                  <Languages className="h-5 w-5 text-mastercard-red" />
                  <span>Translate Photo</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center gap-2"
                >
                  <Utensils className="h-5 w-5 text-mastercard-red" />
                  <span>Food Nearby</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => initializeAirportJourney()}
                >
                  <Bus className="h-5 w-5 text-mastercard-red" />
                  <span>Airport Bus</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => initializeCityCenterJourney()}
                >
                  <Train className="h-5 w-5 text-mastercard-red" />
                  <span>City Metro</span>
                </Button>
              </div>
            </div>
            
            {/* Loyalty info */}
            {tickets.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4">
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
