
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image, Mic, Send, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  translated?: boolean;
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void;
  onUploadImage?: () => void;
  onSuggestAction?: (action: string) => void;
  journeyState?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onSendMessage,
  onUploadImage,
  onSuggestAction,
  journeyState = 'none'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello Conor! Welcome to Dublin! I see you\'ve just landed from Barcelona. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add a message based on journey state changes
  useEffect(() => {
    const addSystemMessage = (text: string) => {
      setIsTyping(true);
      
      // Simulate typing delay
      setTimeout(() => {
        const newMessage: Message = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newMessage]);
        setIsTyping(false);
      }, 1000);
    };
    
    switch(journeyState) {
      case 'selecting_route':
        addSystemMessage("I can help you get to O'Connell Street from Dublin Airport! I've found two options for you: Aircoach Express Bus (€7.00, with student discount €5.00) or Dublin Bus 16 (€3.30, exact change only). The bus route will be less affected by the football event happening today. Which would you prefer?");
        break;
      case 'route_selected':
        addSystemMessage("Great choice! The Aircoach Express is more reliable today due to the football event, plus you'll earn Mastercard loyalty points. Would you like to purchase a ticket for this journey now?");
        break;
      case 'ticket_purchased':
        addSystemMessage("Your ticket has been purchased and added to your wallet! Have you boarded the bus yet?");
        break;
      case 'boarding_bus':
        addSystemMessage("Great! You're now aboard the Aircoach Express Bus to O'Connell Street. The journey should take about 43 minutes. I'll keep you updated.");
        break;
      case 'on_bus':
        addSystemMessage("You're making good progress on your journey! Let me know when you've arrived at O'Connell Street.");
        break;
      case 'arrived_oconnell':
        addSystemMessage("Welcome to O'Connell Street! I've noticed there's a Govinda's Vegan Restaurant nearby that matches your dietary preferences. Would you like to go there?");
        break;
      case 'selecting_restaurant':
        addSystemMessage("Govinda's is a popular vegan restaurant just a 5-minute walk from here. Would you like me to show you the route?");
        break;
      case 'walking_to_restaurant':
        addSystemMessage("I've mapped out the shortest route to Govinda's Restaurant. It's just a short walk down Abbey Street. Let me know when you've arrived!");
        break;
      case 'arrived_govindas':
        addSystemMessage("You've arrived at Govinda's Restaurant! They have great vegan options like the daily thali plate and bean burgers. Remember to pay with your Mastercard to earn 30 additional rewards points.");
        break;
    }
  }, [journeyState]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date(),
      translated: isTranslating
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    if (onSendMessage) {
      onSendMessage(input);
    }
    
    setInput('');
    setIsTranslating(false);
    
    // Simulate typing indicator for response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice transcription completion
      
      // Set different example inputs based on journey state
      let exampleInput = "How do I get to O'Connell Street from the airport?";
      
      if (journeyState === 'ticket_purchased') {
        exampleInput = "Yes, I've boarded the bus now";
      } else if (journeyState === 'on_bus') {
        exampleInput = "Yes, I've arrived at O'Connell Street";
      } else if (journeyState === 'arrived_oconnell') {
        exampleInput = "Yes, I'd like directions to Govinda's";
      } else if (journeyState === 'walking_to_restaurant') {
        exampleInput = "I've arrived at Govinda's now";
      }
      
      setInput(exampleInput);
      toast.success("Voice input transcribed!");
    } else {
      setIsRecording(true);
      toast.info("Voice recording started...");
      // Simulate recording for 2 seconds
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          
          // Set different example inputs based on journey state
          let exampleInput = "How do I get to O'Connell Street from the airport?";
          
          if (journeyState === 'ticket_purchased') {
            exampleInput = "Yes, I've boarded the bus now";
          } else if (journeyState === 'on_bus') {
            exampleInput = "Yes, I've arrived at O'Connell Street";
          } else if (journeyState === 'arrived_oconnell') {
            exampleInput = "Yes, I'd like directions to Govinda's";
          } else if (journeyState === 'walking_to_restaurant') {
            exampleInput = "I've arrived at Govinda's now";
          }
          
          setInput(exampleInput);
          toast.success("Voice input transcribed!");
        }
      }, 2000);
    }
  };

  const handleImageUpload = () => {
    toast.info("Camera activated");
    if (onUploadImage) {
      onUploadImage();
    }
  };

  const handleTranslate = () => {
    setIsTranslating(!isTranslating);
    if (!isTranslating) {
      // If turning translation on
      if (input) {
        // Simulate translation of current input
        const originalText = input;
        setInput(`Translated: ${originalText}`);
        toast.success("Text translated!");
      } else {
        toast.info("Translation mode activated. Your next message will be translated.");
      }
    } else {
      // If turning translation off
      toast.info("Translation mode deactivated");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4 bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <Button
            variant={isRecording ? "default" : "outline"}
            size="icon"
            onClick={handleVoiceInput}
            className={`shrink-0 rounded-full ${isRecording ? 'bg-mastercard-red animate-pulse' : ''}`}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleImageUpload}
            className="shrink-0 rounded-full"
          >
            <Camera className="h-5 w-5" />
          </Button>
          <Button
            variant={isTranslating ? "default" : "outline"}
            size="icon"
            onClick={handleTranslate}
            className={`shrink-0 rounded-full ${isTranslating ? 'bg-blue-500' : ''}`}
          >
            <Languages className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder={isTranslating ? "Type to translate..." : "Ask me something..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 rounded-full border-gray-300"
            />
            <Button 
              onClick={handleSend} 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full"
            >
              <Send className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
