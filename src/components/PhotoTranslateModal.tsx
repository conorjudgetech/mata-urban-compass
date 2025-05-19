
import React, { useState } from 'react';
import { Camera, X, Upload, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PhotoTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoTranslateModal: React.FC<PhotoTranslateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<'capture' | 'preview' | 'result'>('capture');
  const [isTranslating, setIsTranslating] = useState(false);
  
  const handleCapture = () => {
    // In a real app, this would activate the device camera
    // For the prototype, we'll simulate it
    setStep('preview');
    toast.info("Photo captured! (simulated)");
  };
  
  const handleUpload = () => {
    // In a real app, this would open a file picker
    // For the prototype, we'll simulate it
    setStep('preview');
    toast.info("Photo uploaded! (simulated)");
  };
  
  const handleTranslate = () => {
    setIsTranslating(true);
    
    // Simulate translation processing
    setTimeout(() => {
      setIsTranslating(false);
      setStep('result');
    }, 1500);
  };
  
  const handleClose = () => {
    setStep('capture');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Image Translation</DialogTitle>
          <DialogDescription>
            {step === 'capture' && "Take a photo of text to translate (signs, menus, tickets)"}
            {step === 'preview' && "Review your photo before translating"}
            {step === 'result' && "Translation complete"}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'capture' && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <Button 
                className="w-full flex items-center gap-2 bg-mastercard-red hover:bg-mastercard-red/90"
                onClick={handleCapture}
              >
                <Camera className="h-5 w-5" />
                <span>Take Photo</span>
              </Button>
              
              <span className="text-sm text-gray-500">or</span>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={handleUpload}
              >
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </Button>
            </div>
            
            <div className="text-xs text-center text-gray-500 mt-4">
              Point your camera at text you want to translate
            </div>
          </div>
        )}
        
        {step === 'preview' && (
          <div className="space-y-4 py-4">
            <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center p-6">
                <span className="text-gray-400">Photo preview would appear here</span>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep('capture')}
                className="flex-1"
              >
                Retake
              </Button>
              <Button
                className="flex-1 bg-mastercard-red hover:bg-mastercard-red/90"
                onClick={handleTranslate}
                disabled={isTranslating}
              >
                {isTranslating ? 'Translating...' : 'Translate'}
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {step === 'result' && (
          <div className="space-y-4 py-4">
            <div className="relative">
              <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center p-6">
                  <span className="text-gray-400">Photo would appear here</span>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-md shadow-sm border w-full mx-6">
                  <Languages className="h-5 w-5 mx-auto mb-2 text-mastercard-red" />
                  <h3 className="font-medium mb-2">Translated Text</h3>
                  <p className="text-sm">
                    "Airport Express: €12.50 one-way. Departs every 20 minutes."
                  </p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center justify-center">
                    <span>Translated from Spanish</span>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep('capture')}
                className="flex-1"
              >
                Translate Another
              </Button>
              <Button
                className="flex-1 bg-mastercard-red hover:bg-mastercard-red/90"
                onClick={handleClose}
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
