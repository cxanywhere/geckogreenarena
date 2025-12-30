import { Nav } from "@/components/nav";
import { BATTLECARDS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShieldAlert, MessageSquare, Lightbulb, Copy } from "lucide-react";
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
      case 'objection': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'script': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'tip': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'objection': return "bg-red-50 border-red-200 text-red-700";
      case 'script': return "bg-blue-50 border-blue-200 text-blue-700";
      case 'tip': return "bg-yellow-50 border-yellow-200 text-yellow-700";
      default: return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Sales Battlecards</h1>
            <p className="text-muted-foreground">Quick reference scripts, objection handlers, and pro tips.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search scripts..." 
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="All" value={activePhase} onValueChange={setActivePhase} className="w-full">
          <TabsList className="bg-white border border-border p-1 rounded-xl mb-8 w-full overflow-x-auto flex justify-start md:justify-center">
            {phases.map(phase => (
              <TabsTrigger 
                key={phase} 
                value={phase}
                className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold whitespace-nowrap px-4"
              >
                {phase}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredCards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full border-border hover:shadow-lg transition-all group overflow-hidden">
                    <CardHeader className={`${getColor(card.type)} border-b px-6 py-4`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getIcon(card.type)}
                          <Badge variant="outline" className="bg-white/50 border-black/10 font-bold uppercase text-[10px] tracking-wider">
                            {card.type}
                          </Badge>
                        </div>
                        <span className="text-xs font-mono font-medium opacity-70 uppercase tracking-widest">{card.phase}</span>
                      </div>
                      <CardTitle className="text-lg font-bold mt-2 leading-tight">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">The Situation</h4>
                        <p className="text-sm text-foreground/80 font-medium leading-snug">{card.situation}</p>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg border border-border/50 relative group/script">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">The Play</h4>
                        <p className="text-base font-serif italic text-foreground leading-relaxed">"{card.script}"</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 opacity-0 group-hover/script:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(card.script)}
                        >
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Key Points</h4>
                        <ul className="space-y-1">
                          {card.keyPoints.map((point, i) => (
                            <li key={i} className="text-xs flex items-center gap-2 text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredCards.length === 0 && (
             <div className="text-center py-20 text-muted-foreground">
               <p className="text-lg font-medium">No battlecards found matching your criteria.</p>
               <Button variant="link" onClick={() => {setSearchQuery(""); setActivePhase("All")}}>Clear filters</Button>
             </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}