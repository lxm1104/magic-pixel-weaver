
import { useState, useCallback, useRef } from 'react';
import { Sparkles, Info, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import ImageUploader from '@/components/ImageUploader';
import AnimatedButton from '@/components/AnimatedButton';
import LoadingAnimation from '@/components/LoadingAnimation';
import ImageCard from '@/components/ImageCard';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}

const EXAMPLE_PROMPTS = [
  "A mystical forest at dawn with glowing mushrooms",
  "A futuristic cityscape with floating gardens"
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
  const promptInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleImagesSelected = useCallback((files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                Generate Image
              </h2>
            </div>
            
            {generatedImages.length > 0 ? (
              <div className="w-full overflow-x-auto pb-4">
                <Carousel className="w-full" opts={{ align: "start" }}>
                  <CarouselContent className="w-full">
                    {generatedImages.map(image => (
                      <CarouselItem key={image.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                        <ImageCard
                          src={image.url}
                          alt={image.prompt}
                          className="aspect-square w-full"
                          onClick={() => setSelectedImage(image.id)}
                          selected={selectedImage === image.id}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              </div>
            ) : (
              <div className={cn(
                "glass-card rounded-xl text-center space-y-3",
                isMobile ? "p-5" : "p-5 w-1/2 mx-auto space-y-2"
              )}>
                <div className={cn(
                  "mx-auto bg-white/50 rounded-full flex items-center justify-center",
                  isMobile ? "w-12 h-12" : "w-8 h-8"
                )}>
                  <Sparkles className={cn(
                    "text-artistic-deepBrown/70",
                    isMobile ? "w-6 h-6" : "w-4 h-4"
                  )} />
                </div>
                <h3 className={cn(
                  "font-medium text-artistic-deepBrown",
                  isMobile ? "text-base" : "text-sm"
                )}>
                  {isMobile ? "Create AI art" : "Create your first AI masterpiece"}
                </h3>
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
              hasImages={selectedFiles.length > 0}
            />

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {selectedFiles.map((_, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Reference Image {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <div className="flex gap-2">
                <Input
                  ref={promptInputRef}
                  value={prompt}
                  onChange={handlePromptChange}
                  onKeyDown={handlePromptKeyDown}
                  placeholder={isMobile ? "Describe your image..." : "Describe the image you want to create..."}
                  className={cn(
                    "flex-1 border border-input bg-white/70 backdrop-blur-sm",
                    isMobile ? "h-10" : "h-12"
                  )}
                />
                <AnimatedButton
                  onClick={handleGenerate}
                  loading={isGenerating}
                  disabled={!prompt.trim()}
                  className="shrink-0"
                >
                  {isMobile ? "Generate" : "Generate Image"}
                </AnimatedButton>
              </div>
              
              {(!isMobile || prompt.length === 0) && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground pt-1">Try:</span>
                  {EXAMPLE_PROMPTS.slice(0, 2).map((example, index) => (
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
