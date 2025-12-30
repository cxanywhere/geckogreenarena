import { Nav } from "@/components/nav";
import { BATTLECARDS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShieldAlert, MessageSquare, Lightbulb, Copy, Zap } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function BattlecardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhase, setActivePhase] = useState("All");
  const { toast } = useToast();

  const phases = ["All", "Opening", "Pitch", "Objection Handling", "Closing", "Follow-up"];

  const filteredCards = BATTLECARDS.filter(card => {
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

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'objection': return "destructive";
      case 'script': return "default";
      case 'tip': return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
      <Nav />
      
      {/* Hero Section */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-12">
           <div className="max-w-2xl">
             <div className="flex items-center gap-2 mb-4">
               <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
               <span className="font-mono text-sm font-bold text-yellow-600 uppercase tracking-widest">Sales Enablement</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
               Battlecards
             </h1>
             <p className="text-xl text-muted-foreground leading-relaxed">
               Master every interaction with field-tested scripts, objection handlers, and psychological triggers.
             </p>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-border shadow-sm">
           <Tabs defaultValue="All" value={activePhase} onValueChange={setActivePhase} className="w-full md:w-auto overflow-x-auto">
            <TabsList className="bg-muted/50 p-1">
              {phases.map(phase => (
                <TabsTrigger 
                  key={phase} 
                  value={phase}
                  className="rounded-lg font-bold text-xs px-3 py-1.5"
                >
                  {phase}
                </TabsTrigger>
              ))}
            </TabsList>
           </Tabs>

           <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search scripts (e.g., 'price', 'busy')..." 
              className="pl-10 bg-muted/30 border-transparent focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border border-border hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col">
                  {/* Image Section */}
                  {card.image && (
                    <div className="h-40 bg-muted relative overflow-hidden">
                       <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                       <div className="absolute bottom-3 left-4 flex items-center gap-2">
                          <Badge variant={getBadgeVariant(card.type)} className="shadow-lg uppercase tracking-wider text-[10px] font-bold">
                             <span className="flex items-center gap-1">
                                {getIcon(card.type)}
                                {card.type}
                             </span>
                          </Badge>
                       </div>
                    </div>
                  )}

                  <CardHeader className={`px-6 py-4 ${!card.image ? 'border-b bg-muted/30' : ''}`}>
                     {!card.image && (
                        <div className="flex items-center gap-2 mb-2">
                           <Badge variant={getBadgeVariant(card.type)} className="uppercase tracking-wider text-[10px] font-bold">
                              <span className="flex items-center gap-1">
                                {getIcon(card.type)}
                                {card.type}
                              </span>
                           </Badge>
                           <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest ml-auto">{card.phase}</span>
                        </div>
                     )}
                    <CardTitle className="text-xl font-bold font-display leading-tight group-hover:text-primary transition-colors">
                      {card.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6 space-y-5 flex-1 flex flex-col">
                    {/* Situation */}
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> The Situation
                      </h4>
                      <p className="text-sm font-medium text-foreground/80 leading-snug bg-muted/30 p-3 rounded-lg border border-border/50">
                        {card.situation}
                      </p>
                    </div>
                    
                    {/* The Play */}
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 relative group/script flex-1">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
                         <MessageSquare className="w-3 h-3" /> The Play
                      </h4>
                      <p className="text-base font-medium text-foreground italic leading-relaxed">
                        "{card.script}"
                      </p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 opacity-0 group-hover/script:opacity-100 transition-all bg-white shadow-sm hover:bg-primary hover:text-white"
                        onClick={() => copyToClipboard(card.script)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Key Points */}
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" /> Pro Tips
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {card.keyPoints.map((point, i) => (
                          <span key={i} className="text-xs font-medium px-2.5 py-1 bg-white border border-border rounded-full text-muted-foreground shadow-sm">
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
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
              <Button variant="outline" onClick={() => {setSearchQuery(""); setActivePhase("All")}}>Clear filters</Button>
            </div>
        )}
      </div>
    </div>
  );
}