
import React from 'react';
import { 
  AlertTriangle, 
  Timer, 
  Info, 
  Utensils,
  CircleAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Suggestion {
  id: string;
  type: 'alert' | 'info' | 'offer' | 'time';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ContextualSuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionSelect?: (suggestion: Suggestion) => void;
}

export const ContextualSuggestions: React.FC<ContextualSuggestionsProps> = ({
  suggestions,
  onSuggestionSelect,
}) => {
  if (suggestions.length === 0) return null;

  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'offer':
        return <Utensils className="h-5 w-5 text-green-600" />;
      case 'time':
        return <Timer className="h-5 w-5 text-gray-600" />;
      default:
        return <CircleAlert className="h-5 w-5" />;
    }
  };

  const getBgColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'alert':
        return 'bg-amber-50';
      case 'info':
        return 'bg-blue-50';
      case 'offer':
        return 'bg-green-50';
      case 'time':
        return 'bg-gray-50';
      default:
        return 'bg-gray-50';
    }
  };

  const handleClick = (suggestion: Suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion) => (
        <Card 
          key={suggestion.id} 
          className={cn(
            "cursor-pointer transition-all hover:shadow-md rounded-xl",
            getBgColor(suggestion.type)
          )}
          onClick={() => handleClick(suggestion)}
        >
          <CardContent className="p-3">
            <div className="flex gap-3">
              <div className="shrink-0 mt-0.5">
                {getIcon(suggestion.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{suggestion.title}</h4>
                <p className="text-xs text-gray-600 mt-1">
                  {suggestion.description}
                </p>
                {suggestion.action && (
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="mt-2 rounded-xl" 
                    onClick={(e) => {
                      e.stopPropagation();
                      suggestion.action?.onClick();
                    }}
                  >
                    {suggestion.action.label}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
