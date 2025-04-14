import { useState, useCallback, useRef } from 'react';
import { Sparkles, Info, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import ImageUploader from '@/components/ImageUploader';
import AnimatedButton from '@/components/AnimatedButton';
import LoadingAnimation from '@/components/LoadingAnimation';
import ImageCard from '@/components/ImageCard';
import { cn } from '@/lib/utils';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}

const EXAMPLE_PROMPTS = [
  "A mystical forest at dawn with glowing mushrooms",
  "A futuristic cityscape with floating gardens",
  "An underwater castle with bioluminescent coral",
  "A cosmic traveler exploring crystalline planets"
];

const DEMO_IMAGES: GeneratedImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    prompt: 'A cosmic scene with nebulae and distant galaxies',
    createdAt: new Date()
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    prompt: 'Abstract paint mixed colors with golden shimmer',
    createdAt: new Date()
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    prompt: 'Minimalist architecture with sweeping lines',
    createdAt: new Date()
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    prompt: 'Majestic mountain peaks at dawn with mist',
    createdAt: new Date()
  }
];

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const handleImagesSelected = useCallback((files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handlePromptKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate();
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  };

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newImage = {
        id: Date.now().toString(),
        url: DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)].url,
        prompt: prompt,
        createdAt: new Date()
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      setIsGenerating(false);
      
      toast.success("Your image has been created!");
    }, 3500);
  }, [prompt]);

  const handleLoadingComplete = () => {
    console.log("Loading animation complete");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-artistic-cream to-artistic-mistyBlue">
      <header className={cn(
        "py-4 px-4 backdrop-blur-sm bg-white/30 sticky top-0 z-30 border-b border-white/40",
        isMobile ? "py-3" : "py-6 sm:px-6 lg:px-8"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className={cn(isMobile ? "w-5 h-5" : "w-6 h-6", "text-artistic-deepBrown")} />
            <h1 className={cn(isMobile ? "text-lg" : "text-xl", "font-medium text-artistic-deepBrown")}>Magic Pixel</h1>
          </div>
        </div>
      </header>

      <main className={cn(
        "flex-1 py-4 px-4",
        isMobile ? "" : "py-8 sm:px-6 lg:px-8"
      )}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Generated Image Display */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className={cn(
                "font-semibold text-artistic-deepBrown",
                isMobile ? "text-xl" : "text-2xl"
              )}>
                {isMobile ? "AI Creations" : "Your AI Creations"}
              </h2>
            </div>
            
            {generatedImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                {generatedImages.map(image => (
                  <ImageCard
                    key={image.id}
                    src={image.url}
                    alt={image.prompt}
                    className="aspect-square"
                    onClick={() => setSelectedImage(image.id)}
                    selected={selectedImage === image.id}
                  />
                ))}
              </div>
            ) : (
              <div className={cn(
                "glass-card rounded-xl text-center space-y-3",
                isMobile ? "p-5" : "p-10 space-y-4"
              )}>
                <div className={cn(
                  "mx-auto bg-white/50 rounded-full flex items-center justify-center",
                  isMobile ? "w-12 h-12" : "w-16 h-16"
                )}>
                  <Sparkles className={cn(
                    "text-artistic-deepBrown/70",
                    isMobile ? "w-6 h-6" : "w-8 h-8"
                  )} />
                </div>
                <h3 className={cn(
                  "font-medium text-artistic-deepBrown",
                  isMobile ? "text-base" : "text-lg"
                )}>
                  {isMobile ? "Create AI art" : "Create your first AI masterpiece"}
                </h3>
                {!isMobile && (
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Enter a prompt below, optionally add reference images, and let AI bring your vision to life
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Reference Images Section */}
          <section className="glass-card rounded-xl p-4 space-y-3 sm:p-6 sm:space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={cn(
                  "font-medium text-artistic-deepBrown",
                  isMobile ? "text-base" : "text-lg"
                )}>Reference Images</h3>
                {!isMobile && (
                  <p className="text-sm text-muted-foreground">Upload images to guide the AI's creative process</p>
                )}
              </div>
              <div className="glass-card p-1.5 rounded-full">
                <Info className={cn(isMobile ? "w-3.5 h-3.5" : "w-4 h-4", "text-muted-foreground")} />
              </div>
            </div>
            
            <ImageUploader 
              onImagesSelected={handleImagesSelected}
              maxImages={isMobile ? 2 : 4}
            />
          </section>

          {/* Prompt Input Section */}
          <section className="glass-card rounded-xl p-4 space-y-3 sm:p-6 sm:space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={cn(
                  "font-medium text-artistic-deepBrown",
                  isMobile ? "text-base" : "text-lg"
                )}>Prompt</h3>
                {!isMobile && (
                  <p className="text-sm text-muted-foreground">Describe your creative vision in detail</p>
                )}
              </div>
              <div className="glass-card p-1.5 rounded-full">
                <Lightbulb className={cn(isMobile ? "w-3.5 h-3.5" : "w-4 h-4", "text-muted-foreground")} />
              </div>
            </div>
            
            <div className="space-y-3">
              <textarea
                ref={promptInputRef}
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={handlePromptKeyDown}
                placeholder={isMobile ? "Describe your image..." : "Describe the image you want to create..."}
                className={cn(
                  "w-full rounded-lg border border-input bg-white/70 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                  isMobile ? "min-h-[80px]" : "min-h-[120px] px-4 py-3"
                )}
              />
              
              {(!isMobile || prompt.length === 0) && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground pt-1">Try:</span>
                  {EXAMPLE_PROMPTS.slice(0, isMobile ? 2 : 4).map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="text-xs px-3 py-1 rounded-full bg-white/50 hover:bg-white/70 text-muted-foreground transition-colors"
                    >
                      {isMobile ? example.substring(0, 30) + (example.length > 30 ? '...' : '') : example}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                <AnimatedButton
                  onClick={handleGenerate}
                  loading={isGenerating}
                  disabled={!prompt.trim()}
                >
                  {isMobile ? "Generate" : "Generate Image"}
                </AnimatedButton>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className={cn(
        "backdrop-blur-sm bg-white/30 border-t border-white/40",
        isMobile ? "py-4 px-4" : "py-6 px-4 sm:px-6 lg:px-8"
      )}>
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>{isMobile ? "Magic Pixel — AI Image Creator" : "Magic Pixel Weaver — Create beautiful AI-generated imagery"}</p>
        </div>
      </footer>

      {/* Loading Animation */}
      <LoadingAnimation 
        loading={isGenerating} 
        onComplete={handleLoadingComplete} 
      />
    </div>
  );
};

export default Index;
