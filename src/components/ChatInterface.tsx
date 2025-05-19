
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
      text: 'Hello Conor! I\'m your Mastercard Travel Assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
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
      translated: isTranslating
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    if (onSendMessage) {
      onSendMessage(input);
    }
    
    setInput('');
    setIsTranslating(false);
    
    // Simulate response
    setTimeout(() => {
      let responseText = '';
      
      if (input.toLowerCase().includes("o'connell") || input.toLowerCase().includes('city center')) {
        responseText = "I can help you get to O'Connell Street from Dublin Airport! I recommend taking the Aircoach Express Bus. There's a student discount available for you. Would you like to see the journey details?";
        if (onSuggestAction) {
          onSuggestAction('airport');
        }
      } else if (input.toLowerCase().includes('govinda') || input.toLowerCase().includes('restaurant') || input.toLowerCase().includes('food')) {
        responseText = "I've found Govinda's Vegan Restaurant nearby, which matches your dietary preferences. It's just a short 5-minute walk from O'Connell Street. Would you like directions?";
        if (onSuggestAction) {
          onSuggestAction('govindas');
        }
      } else {
        responseText = "I'll help you plan that journey. Based on your location at Dublin Airport, I can suggest routes to popular destinations. Where would you like to go?";
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

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice transcription completion
      setInput("How do I get to O'Connell Street from the airport?");
      toast.success("Voice input transcribed!");
    } else {
      setIsRecording(true);
      toast.info("Voice recording started...");
      // Simulate recording for 2 seconds
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          setInput("How do I get to O'Connell Street from the airport?");
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
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4 bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <Button
            variant={isRecording ? "default" : "outline"}
            size="icon"
            onClick={handleVoiceInput}
            className={`shrink-0 ${isRecording ? 'bg-mastercard-red animate-pulse' : ''}`}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleImageUpload}
            className="shrink-0"
          >
            <Camera className="h-5 w-5" />
          </Button>
          <Button
            variant={isTranslating ? "default" : "outline"}
            size="icon"
            onClick={handleTranslate}
            className={`shrink-0 ${isTranslating ? 'bg-blue-500' : ''}`}
          >
            <Languages className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder={isTranslating ? "Type to translate..." : "Ask me something..."}
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
