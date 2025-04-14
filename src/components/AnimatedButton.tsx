
import { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const AnimatedButton = ({ 
  onClick, 
  loading = false, 
  className, 
  disabled = false,
  children 
}: AnimatedButtonProps) => {
  const [sparkles, setSparkles] = useState<{ id: number; left: string; top: string; size: number; color: string }[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (isHovered && !disabled && !loading) {
      const interval = setInterval(() => {
        const button = buttonRef.current;
        if (button) {
          const width = button.offsetWidth;
          const height = button.offsetHeight;
          
          // Random position within the button
          const left = `${Math.random() * 100}%`;
          const top = `${Math.random() * 100}%`;
          const size = Math.random() * 0.5 + 0.5; // Size between 0.5 and 1
          
          // Different sparkle colors
          const colors = ['#FFFFFF', '#FDE1D3', '#D3E4FD', '#F2FCE2', '#E5DEFF'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          const newSparkle = {
            id: Date.now() + Math.random(),
            left,
            top,
            size,
            color
          };
          
          setSparkles(prev => [...prev, newSparkle]);
          
          // Remove sparkle after animation is complete
          setTimeout(() => {
            setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
          }, 800);
        }
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isHovered, disabled, loading]);

  const addSparkle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Calculate position relative to button
    const left = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    const top = `${((e.clientY - rect.top) / rect.height) * 100}%`;
    
    // Different sparkle colors
    const colors = ['#FFFFFF', '#FDE1D3', '#D3E4FD', '#F2FCE2', '#E5DEFF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const newSparkle = {
      id: Date.now(),
      left,
      top,
      size: 1,
      color
    };
    
    setSparkles(prev => [...prev, newSparkle]);
    
    // Remove sparkle after animation is complete
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 800);
    
    onClick();
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-full py-3 px-6 flex items-center justify-center gap-2 transition-all duration-300",
        "bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-md border border-white/30",
        "text-primary font-medium shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)]",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]",
        loading ? "animate-pulse-soft" : "",
        isHovered ? "border-white/40 bg-gradient-to-r from-white/40 to-white/30" : "",
        className
      )}
      onClick={addSparkle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      ) : (
        <Sparkles className="w-5 h-5 text-primary" />
      )}
      <span className="relative z-10 text-sm font-medium">{children}</span>
      
      {/* Blur effect under the button */}
      <div className="absolute inset-0 -z-10 blur-xl opacity-30 bg-gradient-to-r from-white to-primary/20 rounded-full transform scale-90"></div>
      
      {/* Inner highlight effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300 rounded-full",
        "bg-gradient-to-br from-white/10 via-transparent to-transparent",
        isHovered ? "opacity-100" : "opacity-0"
      )}></div>
      
      {/* Sparkle effects */}
      {sparkles.map(sparkle => (
        <span
          key={sparkle.id}
          className="absolute w-6 h-6 rounded-full animate-sparkle pointer-events-none"
          style={{ 
            left: sparkle.left, 
            top: sparkle.top, 
            backgroundColor: sparkle.color,
            transform: `scale(${sparkle.size})`,
            opacity: 0.8
          }}
        />
      ))}
    </button>
  );
};

export default AnimatedButton;
