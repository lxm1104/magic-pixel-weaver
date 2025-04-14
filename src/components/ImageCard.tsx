
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageCardProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

const ImageCard = ({ src, alt, className, onClick, selected }: ImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300 shadow-md h-auto cursor-pointer transform hover:-translate-y-1 hover:shadow-lg",
        selected ? "ring-4 ring-primary/50" : "",
        className
      )}
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-soft shimmer rounded-xl" />
      )}
      <img 
        src={src} 
        alt={alt} 
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
      />
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs">
          ✓
        </div>
      )}
    </div>
  );
};

export default ImageCard;
