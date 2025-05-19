
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  hasWarning?: boolean;
  source?: string;
}

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, className }) => {
  const isAssistant = message.sender === 'assistant';
  
  return (
    <div
      className={cn(
        'chat-message',
        isAssistant ? 'assistant' : 'user',
        className
      )}
    >
      <div className="flex items-start gap-2">
        {isAssistant && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-mastercard-red to-mastercard-yellow">
            <span className="text-xs font-bold text-white">MA</span>
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="text-sm">
              {message.text}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {message.hasWarning && (
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  <AlertTriangle size={12} />
                  <span>AI-generated info - verify independently</span>
                </div>
              )}
              {message.source && (
                <a href="#" className="text-xs text-blue-600 underline">Source: {message.source}</a>
              )}
              <span className="ml-auto text-xs text-gray-400">
                {new Intl.DateTimeFormat('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(message.timestamp)}
              </span>
            </div>
          </div>
        </div>
        {!isAssistant && (
          <div className="h-8 w-8 shrink-0 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-bold text-white">ME</span>
          </div>
        )}
      </div>
    </div>
  );
};
