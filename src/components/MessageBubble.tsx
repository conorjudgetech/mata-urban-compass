
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
      <div className="flex items-start mb-2 ${!isAssistant ? 'justify-end' : 'justify-start'}">
        <div className="flex-1">
          <div className="flex flex-col">
            <div className={`flex ${isAssistant ? 'self-start' : 'self-end'}`}>
              <div className={`relative pt-4 ${isAssistant ? 'max-w-[80%]' : ''}`}>
                <div
                  className={`relative whitespace-pre-line px-4 py-2 text-sm rounded-xl
                    ${isAssistant ? 'bg-gray-50 text-black' : 'bg-gray-500 text-white'}
                  `}
                  style={{
                    // allow overflow for tail
                    overflow: 'visible',
                  }}
                >
                  {message.text}

                  
                </div>
                <span className="absolute bottom-0 right-1 translate-y-full ml-auto text-xs text-gray-400 mt-1">
                  {new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(message.timestamp)}
                </span>
              </div>
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

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
