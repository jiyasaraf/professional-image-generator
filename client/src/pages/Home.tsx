import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ImageUpload } from '@/components/ImageUpload';
import { ProcessingButton } from '@/components/ProcessingButton';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Notification } from '@/components/Notifications';
import { apiRequest } from '@/lib/queryClient';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [notification, setNotification] = useState<{
    type: 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  const transformMutation = useMutation({
    mutationFn: async () => {
      if (!uploadedImage) throw new Error('No image uploaded');

      const formData = new FormData();
      formData.append('image', uploadedImage);

      const response = await apiRequest('POST', '/api/transform-image', formData);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setProcessedImage(data.processedImageData);
        showNotification('success', 'Success', 'Your professional portrait is ready!');
      } else {
        showNotification('error', 'Processing Failed', data.error || 'Failed to process image');
      }
    },
    onError: (error: any) => {
      console.error('Transform error:', error);
      showNotification('error', 'Error', error.message || 'Failed to process image. Please try again.');
    },
  });

  const showNotification = (type: 'error' | 'success', title: string, message: string) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), type === 'error' ? 5000 : 3000);
  };

  const handleImageSelect = (file: File) => {
    setUploadedImage(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setProcessedImage(''); // Clear previous result
  };

  const handleRemoveImage = () => {
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    setUploadedImage(null);
    setOriginalImageUrl('');
    setProcessedImage('');
  };

  const handleConvert = () => {
    if (!uploadedImage) {
      showNotification('error', 'Error', 'Please upload an image first');
      return;
    }
    transformMutation.mutate();
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'professional-portrait.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessAnother = () => {
    handleRemoveImage();
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">📷</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Professional Headshot Converter</h1>
                <p className="text-xs text-muted-foreground">Powered by Gemini 2.5 Flash Image</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">
                Replit AI
              </span>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <ImageUpload
              onImageSelect={handleImageSelect}
              uploadedImage={uploadedImage}
              onRemoveImage={handleRemoveImage}
            />

            <ProcessingButton
              onConvert={handleConvert}
              isProcessing={transformMutation.isPending}
              disabled={!uploadedImage}
            />

            {processedImage && originalImageUrl && (
              <ResultsDisplay
                originalImage={originalImageUrl}
                processedImage={processedImage}
                onDownload={handleDownload}
                onProcessAnother={handleProcessAnother}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4 md:mb-0">
              <span>Powered by</span>
              <span className="font-medium text-primary">Gemini 2.5 Flash Image</span>
              <span>•</span>
              <span>Built for Replit</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Notifications */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
