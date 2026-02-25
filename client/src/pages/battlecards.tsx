import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShieldAlert, MessageSquare, Lightbulb, Copy, Zap, Loader2, Maximize2, X, Eye, Lock, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { useState, useEffect, useCallback, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import useEmblaCarousel from "embla-carousel-react";

interface Battlecard {
  id: string;
  phase: string;
  title: string;
  situation: string;
  script: string;
  keyPoints: string[];
  type: string;
  image: string | null;
}

export default function BattlecardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhase, setActivePhase] = useState("All");
  const [selectedCard, setSelectedCard] = useState<Battlecard | null>(null);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { toast } = useToast();

  const openCarousel = (index: number = 0) => {
    setCarouselIndex(index);
    setCarouselOpen(true);
  };

  const toggleReveal = (cardId: string, e: MouseEvent) => {
    e.stopPropagation();
    setRevealedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const toggleRevealSimple = (cardId: string) => {
    setRevealedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const { data: battlecards = [], isLoading } = useQuery<Battlecard[]>({
    queryKey: ["battlecards"],
    queryFn: async () => {
      const response = await fetch("/api/battlecards");
      if (!response.ok) throw new Error("Failed to fetch battlecards");
      return response.json();
    },
  });

  const phases = ["All", "Discovery", "Demo", "Objection Handling", "Pricing", "Closing", "Follow-up"];

  const filteredCards = battlecards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          card.situation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.script.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = activePhase === "All" || card.phase === activePhase;
    return matchesSearch && matchesPhase;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Script ready to paste.",
      duration: 2000,
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'objection': return <ShieldAlert className="w-4 h-4" />;
      case 'script': return <MessageSquare className="w-4 h-4" />;
      case 'tip': return <Lightbulb className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getBadgeVariant = (type: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (type) {
      case 'objection': return "destructive";
      case 'script': return "default";
      case 'tip': return "secondary";
      default: return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading battlecards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
      <Nav />
      
      {/* Hero Section with Cover Info */}
      <div className="bg-gradient-to-br from-primary/5 via-white to-yellow-50/50 border-b border-border dark:from-primary/10 dark:via-background dark:to-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left: Title and Description */}
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-mono text-sm font-bold text-yellow-600 uppercase tracking-widest">Sales Enablement</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight" data-testid="text-battlecards-title">
                Battlecards
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed mb-6">
                Your pocket playbook for handling every sales situation with confidence. {battlecards.length} field-tested cards ready to go.
              </p>

              {/* Fullscreen Carousel Button */}
              <Button 
                onClick={() => openCarousel(0)} 
                className="mb-6 bg-magenta hover:bg-magenta/90"
                data-testid="button-open-carousel"
              >
                <Layers className="w-4 h-4 mr-2" />
                View Fullscreen Carousel
              </Button>
              
              {/* What Are Battlecards */}
              <div className="bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-magenta" />
                  What Are Battlecards?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Battlecards are quick-reference guides with proven scripts and strategies for every sales situation. 
                  Each card gives you exactly what to say and do when you encounter common objections, tough customers, or tricky scenarios at the door.
                </p>
              </div>
            </div>

            {/* Right: How They Help */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                How Battlecards Help You Win
              </h3>
              
              <div className="grid gap-3">
                <div className="bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm flex gap-4 items-start hover:border-magenta/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Word-for-Word Scripts</h4>
                    <p className="text-sm text-muted-foreground">Exact phrases that work. No guessing what to say when you're put on the spot.</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm flex gap-4 items-start hover:border-magenta/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Objection Handlers</h4>
                    <p className="text-sm text-muted-foreground">Turn "no" into "tell me more" with responses to every common pushback.</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm flex gap-4 items-start hover:border-magenta/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Instant Confidence</h4>
                    <p className="text-sm text-muted-foreground">Review before your shift or between doors. Walk up ready for anything.</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm flex gap-4 items-start hover:border-magenta/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Pro Tips from Top Reps</h4>
                    <p className="text-sm text-muted-foreground">Techniques and mindset shifts from reps who consistently hit quota.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-card p-4 rounded-2xl border border-border shadow-sm">
           <Tabs defaultValue="All" value={activePhase} onValueChange={setActivePhase} className="w-full md:w-auto">
            <div className="overflow-x-auto -mx-1 px-1 pb-1">
              <TabsList className="bg-muted/50 p-1 inline-flex w-auto min-w-full sm:min-w-0">
                {phases.map(phase => (
                  <TabsTrigger 
                    key={phase} 
                    value={phase}
                    className="rounded-lg font-bold text-xs px-2.5 sm:px-3 py-1.5 whitespace-nowrap"
                    data-testid={`tab-phase-${phase.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {phase}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
           </Tabs>

           <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search scripts (e.g., 'price', 'busy')..." 
              className="pl-10 bg-muted/30 border-transparent focus:bg-white dark:focus:bg-card transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-battlecards"
            />
          </div>
        </div>

        {/* Cards Grid - Visual Battlecard Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card 
                  className="h-full border border-border hover:border-magenta/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col cursor-pointer"
                  onClick={() => setSelectedCard(card)}
                  data-testid={`card-battlecard-${card.id}`}
                >
                  {/* Card with cover/reveal behavior */}
                  {revealedCards.has(card.id) ? (
                    /* Revealed Card Content */
                    card.image ? (
                      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                        <img 
                          src={card.image} 
                          alt={card.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Badge variant={getBadgeVariant(card.type)} className="shadow-lg uppercase tracking-wider text-[10px] font-bold mb-2">
                            <span className="flex items-center gap-1">
                              {getIcon(card.type)}
                              {card.type}
                            </span>
                          </Badge>
                          <p className="text-white text-sm font-medium line-clamp-2">{card.title}</p>
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="bg-white/90 hover:bg-white shadow-lg"
                            onClick={(e) => toggleReveal(card.id, e)}
                            data-testid={`button-hide-${card.id}`}
                          >
                            <Lock className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="bg-white/90 hover:bg-white shadow-lg"
                            onClick={(e) => { e.stopPropagation(); setSelectedCard(card); }}
                          >
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                    ) : (
                    /* Revealed Card Content */
                    <>
                      <CardHeader className="px-6 py-4 border-b bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getBadgeVariant(card.type)} className="uppercase tracking-wider text-[10px] font-bold">
                            <span className="flex items-center gap-1">
                              {getIcon(card.type)}
                              {card.type}
                            </span>
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest ml-auto">{card.phase}</span>
                        </div>
                        <CardTitle className="text-xl font-bold font-display leading-tight group-hover:text-magenta transition-colors">
                          {card.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-6 space-y-5 flex-1 flex flex-col">
                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> The Situation
                          </h4>
                          <p className="text-sm font-medium text-foreground/80 leading-snug bg-muted/30 p-3 rounded-lg border border-border/50">
                            {card.situation}
                          </p>
                        </div>
                        
                        <div className="bg-magenta/5 p-4 rounded-xl border border-magenta/10 relative group/script flex-1">
                          <h4 className="text-xs font-bold text-magenta uppercase tracking-wider mb-2 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> The Play
                          </h4>
                          <p className="text-base font-medium text-foreground italic leading-relaxed">
                            "{card.script}"
                          </p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 opacity-0 group-hover/script:opacity-100 transition-all bg-white shadow-sm hover:bg-magenta hover:text-white"
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(card.script); }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" /> Pro Tips
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {card.keyPoints.slice(0, 3).map((point, i) => (
                              <span key={i} className="text-xs font-medium px-2.5 py-1 bg-white border border-border rounded-full text-muted-foreground shadow-sm">
                                {point}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-auto"
                          onClick={(e) => toggleReveal(card.id, e)}
                          data-testid={`button-hide-${card.id}`}
                        >
                          <Lock className="w-3 h-3 mr-2" />
                          Hide Card
                        </Button>
                      </CardContent>
                    </>
                    )
                  ) : (
                    /* Card Cover - Not Yet Revealed */
                    <div className="aspect-[3/4] bg-gradient-to-br from-magenta/10 via-magenta/5 to-yellow-50/50 dark:from-magenta/20 dark:via-background dark:to-background flex flex-col items-center justify-center p-6 text-center relative">
                      {/* Card Number */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-magenta/10 text-magenta text-sm font-bold px-3 py-1.5 rounded-full border border-magenta/20">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Lock Icon */}
                      <div className="w-16 h-16 rounded-full bg-magenta/10 flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-magenta/60" />
                      </div>

                      {/* Card Title */}
                      <h3 className="text-lg font-bold font-display text-foreground mb-2 leading-tight">
                        {card.title}
                      </h3>

                      {/* Phase Badge */}
                      <Badge variant="outline" className="mb-4 text-xs font-mono uppercase tracking-wider">
                        {card.phase}
                      </Badge>

                      {/* Type Badge */}
                      <Badge variant={getBadgeVariant(card.type)} className="mb-6 uppercase tracking-wider text-[10px] font-bold">
                        <span className="flex items-center gap-1">
                          {getIcon(card.type)}
                          {card.type}
                        </span>
                      </Badge>

                      {/* Reveal Button */}
                      <Button 
                        className="bg-magenta hover:bg-magenta/90 text-white font-bold shadow-lg"
                        onClick={(e) => toggleReveal(card.id, e)}
                        data-testid={`button-reveal-${card.id}`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Reveal Card
                      </Button>

                      {/* Hint Text */}
                      <p className="text-xs text-muted-foreground mt-4">
                        Click to see the script and tips
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredCards.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground">No battlecards found</p>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters.</p>
              <Button variant="outline" onClick={() => {setSearchQuery(""); setActivePhase("All")}} data-testid="button-clear-filters">Clear filters</Button>
            </div>
        )}
      </div>

      {/* Full-screen Battlecard Modal */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] sm:w-auto overflow-auto p-0 bg-background">
          <VisuallyHidden>
            <DialogTitle>{selectedCard?.title || "Battlecard Details"}</DialogTitle>
            <DialogDescription>View detailed battlecard information</DialogDescription>
          </VisuallyHidden>
          {selectedCard && (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white shadow-lg"
                onClick={() => setSelectedCard(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              
              {selectedCard.image ? (
                <div className="relative">
                  <img 
                    src={selectedCard.image} 
                    alt={selectedCard.title} 
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <div className="p-5 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <Badge variant={getBadgeVariant(selectedCard.type)} className="uppercase tracking-wider text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        {getIcon(selectedCard.type)}
                        {selectedCard.type}
                      </span>
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono uppercase tracking-widest">{selectedCard.phase}</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4 sm:mb-6">{selectedCard.title}</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4" /> When to Use
                      </h4>
                      <p className="text-base sm:text-lg text-foreground/80 bg-muted/30 p-3 sm:p-4 rounded-xl border border-border/50">
                        {selectedCard.situation}
                      </p>
                    </div>
                    
                    <div className="bg-primary/5 p-4 sm:p-6 rounded-xl border border-primary/10 relative group/script">
                      <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" /> The Script
                      </h4>
                      <p className="text-base sm:text-xl font-medium text-foreground italic leading-relaxed">
                        "{selectedCard.script}"
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="absolute top-4 right-4 opacity-0 group-hover/script:opacity-100 transition-all"
                        onClick={() => copyToClipboard(selectedCard.script)}
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy
                      </Button>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
                        <Lightbulb className="w-4 h-4" /> Key Points
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCard.keyPoints.map((point, i) => (
                          <span key={i} className="text-sm font-medium px-4 py-2 bg-white dark:bg-card border border-border rounded-full text-foreground shadow-sm">
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Carousel Dialog */}
      {carouselOpen && (
        <CarouselDialog
          cards={filteredCards}
          startIndex={carouselIndex}
          revealedCards={revealedCards}
          onToggleReveal={toggleRevealSimple}
          onCopy={copyToClipboard}
          onClose={() => setCarouselOpen(false)}
          getIcon={getIcon}
          getBadgeVariant={getBadgeVariant}
        />
      )}
    </div>
  );
}

function CarouselDialog({
  cards,
  startIndex,
  revealedCards,
  onToggleReveal,
  onCopy,
  onClose,
  getIcon,
  getBadgeVariant,
}: {
  cards: Battlecard[];
  startIndex: number;
  revealedCards: Set<string>;
  onToggleReveal: (id: string) => void;
  onCopy: (text: string) => void;
  onClose: () => void;
  getIcon: (type: string) => React.ReactNode;
  getBadgeVariant: (type: string) => "destructive" | "default" | "secondary" | "outline";
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex });
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext, onClose]);

  const currentCard = cards[currentIndex];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] w-[95vw] overflow-hidden p-0 bg-background">
        <VisuallyHidden>
          <DialogTitle>Battlecard Carousel</DialogTitle>
          <DialogDescription>Navigate through battlecards using arrows</DialogDescription>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-muted-foreground">
              Card {currentIndex + 1} of {cards.length}
            </span>
            {currentCard && (
              <Badge variant={getBadgeVariant(currentCard.type)} className="uppercase tracking-wider text-[10px] font-bold">
                <span className="flex items-center gap-1">
                  {getIcon(currentCard.type)}
                  {currentCard.type}
                </span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Use arrow keys to navigate</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative flex-1 overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {cards.map((card, index) => (
              <div key={card.id} className="flex-[0_0_100%] min-w-0 h-full overflow-y-auto">
                <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
                  {/* Card Cover or Content */}
                  {revealedCards.has(card.id) ? (
                    /* Revealed Content */
                    <div className="space-y-4 sm:space-y-6">
                      {card.image ? (
                        <img src={card.image} alt={card.title} className="w-full h-auto rounded-xl shadow-lg" />
                      ) : (
                        <>
                          <div>
                            <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{card.phase}</span>
                            <h2 className="text-2xl sm:text-3xl font-bold font-display mt-2">{card.title}</h2>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                              <ShieldAlert className="w-4 h-4" /> When to Use
                            </h4>
                            <p className="text-base sm:text-lg text-foreground/80 bg-muted/30 p-3 sm:p-4 rounded-xl border border-border/50">
                              {card.situation}
                            </p>
                          </div>

                          <div className="bg-primary/5 p-4 sm:p-6 rounded-xl border border-primary/10 relative group">
                            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" /> The Script
                            </h4>
                            <p className="text-base sm:text-xl font-medium text-foreground italic leading-relaxed">
                              "{card.script}"
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-4 right-4"
                              onClick={() => onCopy(card.script)}
                            >
                              <Copy className="w-3 h-3 mr-2" />
                              Copy
                            </Button>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
                              <Lightbulb className="w-4 h-4" /> Key Points
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {card.keyPoints.map((point, i) => (
                                <span key={i} className="text-sm font-medium px-4 py-2 bg-white dark:bg-card border border-border rounded-full text-foreground shadow-sm">
                                  {point}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <Button variant="outline" onClick={() => onToggleReveal(card.id)} className="w-full">
                        <Lock className="w-4 h-4 mr-2" />
                        Hide Card
                      </Button>
                    </div>
                  ) : (
                    /* Card Cover */
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <Lock className="w-10 h-10 text-primary/60" />
                      </div>

                      <span className="text-sm font-mono text-muted-foreground mb-2">Card #{index + 1}</span>
                      <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-4">{card.title}</h2>

                      <Badge variant="outline" className="mb-4 text-xs font-mono uppercase tracking-wider">
                        {card.phase}
                      </Badge>

                      <Badge variant={getBadgeVariant(card.type)} className="mb-8 uppercase tracking-wider text-xs font-bold">
                        <span className="flex items-center gap-1">
                          {getIcon(card.type)}
                          {card.type}
                        </span>
                      </Badge>

                      <Button className="bg-primary hover:bg-primary/90" onClick={() => onToggleReveal(card.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Reveal Card
                      </Button>

                      <p className="text-sm text-muted-foreground mt-4">Click to see the script and tips</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-t bg-muted/30">
          <Button variant="outline" onClick={scrollPrev} className="gap-1 sm:gap-2 px-2 sm:px-4">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <div className="flex gap-1">
            {cards.slice(0, 10).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? "bg-primary" : "bg-muted-foreground/30"}`}
              />
            ))}
            {cards.length > 10 && <span className="text-xs text-muted-foreground ml-1">+{cards.length - 10}</span>}
          </div>
          <Button variant="outline" onClick={scrollNext} className="gap-1 sm:gap-2 px-2 sm:px-4">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
