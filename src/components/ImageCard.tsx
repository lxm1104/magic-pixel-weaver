
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageCardProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

const ImageCard = ({ src, alt, className, onClick, selected }: ImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300 shadow-md h-auto cursor-pointer group",
        "before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/5 before:to-black/30 before:opacity-0 before:transition-opacity before:duration-300",
        "after:absolute after:inset-0 after:border after:border-white/10 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-300",
        selected ? "ring-2 ring-primary/50 scale-[0.98]" : "hover:scale-[1.02]",
        isHovered ? "before:opacity-100 after:opacity-100 shadow-xl" : "shadow-md",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-soft shimmer rounded-xl" />
      )}
      <img 
        src={src} 
        alt={alt} 
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          isHovered ? "brightness-105 contrast-105" : "brightness-100"
        )}
        onLoad={() => setIsLoaded(true)}
      />
      {selected && (
        <div className={cn(
          "absolute top-2 right-2 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg",
          isMobile ? "w-5 h-5" : "w-6 h-6"
        )}>
          <svg className={cn(isMobile ? "w-3 h-3" : "w-3.5 h-3.5")} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      {!isMobile && (
        <div className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 transform translate-y-full transition-transform duration-300",
          isHovered ? "translate-y-0" : "",
        )}>
          <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
            {alt}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
