
import { useState } from 'react';
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
  const [sparkles, setSparkles] = useState<{ id: number; left: string; top: string }[]>([]);

  const addSparkle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Calculate position relative to button
    const left = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    const top = `${((e.clientY - rect.top) / rect.height) * 100}%`;
    
    const newSparkle = {
      id: Date.now(),
      left,
      top
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
      className={cn(
        "glass-button relative overflow-hidden rounded-full py-3 px-6 flex items-center justify-center gap-2 transition-all duration-300",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl",
        loading ? "animate-pulse-soft" : "",
        className
      )}
      onClick={addSparkle}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Sparkles className="w-5 h-5" />
      )}
      <span className="relative z-10">{children}</span>
      
      {/* Sparkle effects */}
      {sparkles.map(sparkle => (
        <span
          key={sparkle.id}
          className="absolute w-6 h-6 bg-white/60 rounded-full animate-sparkle"
          style={{ left: sparkle.left, top: sparkle.top }}
        />
      ))}
    </button>
  );
};

export default AnimatedButton;
