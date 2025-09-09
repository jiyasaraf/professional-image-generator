import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudUpload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  uploadedImage: File | null;
  onRemoveImage: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect, 
  uploadedImage, 
  onRemoveImage 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (uploadedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(uploadedImage);
    } else {
      setImagePreview(null);
    }
  }, [uploadedImage]);

  const validateFile = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg)$/i)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG or JPG file",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Upload Your Headshot</h2>
        <p className="text-muted-foreground mb-6">
          Upload a clear headshot photo (JPEG or JPG format) to transform it into a professional portrait.
        </p>

        <div
          className={`upload-area border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragOver 
              ? 'border-primary bg-primary/5 scale-102' 
              : 'border-border bg-muted/30 hover:bg-muted/40'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          data-testid="upload-area"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="file-input"
          />

          {!uploadedImage ? (
            <div data-testid="upload-placeholder">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudUpload className="text-primary" size={32} />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Drag & drop your headshot here
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse files
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPEG and JPG files up to 10MB
              </p>
            </div>
          ) : (
            <div className="max-w-xs mx-auto" data-testid="upload-preview">
              <img 
                src={imagePreview!} 
                alt="Uploaded headshot" 
                className="w-full h-auto rounded-lg shadow-md border border-border"
                data-testid="preview-image"
              />
              <div className="mt-3 flex items-center justify-between">
                <span 
                  className="text-sm text-muted-foreground truncate" 
                  data-testid="file-name"
                >
                  {uploadedImage.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage();
                  }}
                  className="text-destructive hover:text-destructive/80 h-auto p-1"
                  data-testid="button-remove-image"
                >
                  <Trash2 size={16} className="mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
