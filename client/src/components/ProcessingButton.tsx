import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ProcessingButtonProps {
  onConvert: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

export const ProcessingButton: React.FC<ProcessingButtonProps> = ({
  onConvert,
  isProcessing,
  disabled
}) => {
  return (
    <div className="text-center">
      <Button
        onClick={onConvert}
        disabled={disabled || isProcessing}
        size="lg"
        className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:hover:scale-100"
        data-testid="button-convert"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Convert to Professional Image'
        )}
      </Button>
      <p className="text-sm text-muted-foreground mt-2">
        Processing typically takes 10-30 seconds
      </p>
    </div>
  );
};
