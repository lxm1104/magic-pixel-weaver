
import { useState, useCallback } from 'react';
import { Upload, XCircle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  maxImages?: number;
  className?: string;
  hasImages?: boolean;
}

const ImageUploader = ({ onImagesSelected, maxImages = 4, className, hasImages = false }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (previewImages.length + imageFiles.length > maxImages) {
      toast.error(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewImages(prev => [...prev, ...newImages]);
    onImagesSelected(imageFiles);
  }, [maxImages, onImagesSelected, previewImages.length]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  }, [processFiles]);

  const removeImage = useCallback((index: number) => {
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  }, []);

  if (hasImages) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed p-8 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[160px]",
          isDragging ? "border-primary/70 bg-primary/5" : "border-muted-foreground/30",
          previewImages.length >= maxImages ? "opacity-50 pointer-events-none" : "cursor-pointer",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="w-10 h-10 text-muted-foreground/70" />
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">Drag and drop your images here</p>
          <p className="text-xs text-muted-foreground">or click to browse from your device</p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            {previewImages.length} of {maxImages} images
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={previewImages.length >= maxImages}
        />
      </div>

      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {previewImages.map((image, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden aspect-square">
              <img
                src={image.preview}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XCircle className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
          {Array.from({ length: Math.min(maxImages - previewImages.length, 4) }).map((_, index) => (
            <div 
              key={`placeholder-${index}`} 
              className="border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center aspect-square"
            >
              <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
