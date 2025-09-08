import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Key, ExternalLink } from 'lucide-react';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { useToast } from '@/hooks/use-toast';

export const ApiKeySetup: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setApiKey } = useApiKey();
  const { toast } = useToast();

  const handleSave = () => {
    const trimmedKey = inputValue.trim();
    
    if (!trimmedKey) {
      toast({
        title: "Error",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      });
      return;
    }

    if (trimmedKey.length < 10) {
      toast({
        title: "Error", 
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setApiKey(trimmedKey);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  return (
    <div className="mb-8 fade-in">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Key className="text-primary" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">Setup Gemini API Key</h2>
              <p className="text-muted-foreground mb-4">
                Enter your Gemini API key to start converting headshots to professional portraits. 
                Your key is stored securely for this session only.
              </p>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Gemini API key..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    data-testid="input-api-key"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-toggle-api-key-visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center"
                    data-testid="link-get-api-key"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Get your API key
                  </a>
                  <Button
                    onClick={handleSave}
                    disabled={!inputValue.trim()}
                    data-testid="button-save-api-key"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
