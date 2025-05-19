
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void;
  onUploadImage?: () => void;
  onSuggestAction?: (action: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onSendMessage,
  onUploadImage,
  onSuggestAction
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Welcome to Mastercard Travel Assistant! Where do you want to go today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    if (onSendMessage) {
      onSendMessage(input);
    }
    
    setInput('');
    
    // Simulate response
    setTimeout(() => {
      let responseText = '';
      
      if (input.toLowerCase().includes('airport')) {
        responseText = "I can help you get to the airport! Based on your location, I recommend taking the Airport Express Bus. There's a student discount available. Would you like to see ticket options?";
        if (onSuggestAction) {
          onSuggestAction('airport');
        }
      } else if (input.toLowerCase().includes('city center') || input.toLowerCase().includes('downtown')) {
        responseText = "I'll help you navigate to the city center. You can take the Metro Line 1 directly there. Would you like me to help you purchase tickets?";
        if (onSuggestAction) {
          onSuggestAction('city-center');
        }
      } else {
        responseText = "I'll help you plan that journey. Where are you starting from?";
      }
      
      const newAssistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleUploadImage = () => {
    toast.info("Photo upload feature activated");
    if (onUploadImage) {
      onUploadImage();
    }
  };

  const renderQuickActions = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("How do I get to the airport?");
            setTimeout(handleSend, 100);
          }}
        >
          Airport
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("Take me to the city center");
            setTimeout(handleSend, 100);
          }}
        >
          City Center
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("I need help with the metro");
            setTimeout(handleSend, 100);
          }}
        >
          Metro Help
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput("Food recommendations nearby");
            setTimeout(handleSend, 100);
          }}
        >
          Food Nearby
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 1 && renderQuickActions()}
        
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4 bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleUploadImage}
            className="shrink-0"
          >
            <Camera className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleUploadImage}
            className="shrink-0"
          >
            <Image className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSend} className="bg-mastercard-red hover:bg-mastercard-red/90">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
