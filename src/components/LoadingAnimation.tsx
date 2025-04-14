
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  loading: boolean;
  onComplete?: () => void;
  className?: string;
}

const LoadingAnimation = ({ loading, onComplete, className }: LoadingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(1);
  
  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setPhase(1);
      return;
    }
    
    const duration = 3000; // 3 seconds total
    const interval = 30; // Update every 30ms
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let timer: number | null = null;
    let currentProgress = 0;
    
    const updateProgress = () => {
      currentProgress += increment;
      
      if (currentProgress >= 33 && phase === 1) {
        setPhase(2);
      } else if (currentProgress >= 66 && phase === 2) {
        setPhase(3);
      }
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        if (timer) clearInterval(timer);
        
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
      
      setProgress(currentProgress);
    };
    
    timer = window.setInterval(updateProgress, interval);
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, onComplete]);
  
  if (!loading && progress === 0) return null;
  
  return (
    <div className={cn(
      "fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in",
      className
    )}>
      <div className="w-full max-w-lg px-6 py-10">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto relative">
              <Sparkles className="w-full h-full text-white animate-pulse-soft" />
              {Array.from({ length: 5 }).map((_, i) => (
                <span 
                  key={i}
                  className={cn(
                    "absolute w-2 h-2 rounded-full bg-white",
                    "animate-pulse-soft"
                  )}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: phase > 1 ? 1 : 0.5,
                    transform: `scale(${phase > 1 ? 1.5 : 1})`,
                    transition: 'all 0.5s ease'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-white">
              {phase === 1 && "Gathering inspiration..."}
              {phase === 2 && "Creating artistic vision..."}
              {phase === 3 && "Finalizing your masterpiece..."}
            </h3>
            
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-white/80 text-sm">
              {Math.round(progress)}% complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
