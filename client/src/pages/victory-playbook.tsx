import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowLeft, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { Nav } from "@/components/nav";
import notionPlaybook from "@/assets/notion-icon-playbook.png";
import notionDiscovery from "@/assets/notion-icon-discovery.png";
import notionObjection from "@/assets/notion-icon-objection.png";
import notionExecutive from "@/assets/notion-icon-executive.png";
import notionDeal from "@/assets/notion-icon-deal.png";
import notionSalesRep from "@/assets/notion-icon-salesrep.png";
import notionBuyer from "@/assets/notion-icon-buyer.png";
import notionContext from "@/assets/notion-icon-context.png";

interface ComicPanel {
  id: string;
  storyId: string;
  panelOrder: number;
  imageUrl: string | null;
  speaker: string;
  dialogue: string;
  setting: string;
  emotion: string;
}

interface ComicStory {
  id: string;
  roleplayId: string;
  title: string;
  subtitle: string;
  phase: string;
  description: string;
  orderIndex: number;
  panels: ComicPanel[];
}

const phaseColors: Record<string, string> = {
  "Discovery": "bg-blue-500/10 text-blue-700 border-blue-200",
  "Objection Handling": "bg-amber-500/10 text-amber-700 border-amber-200",
  "Executive Pitch": "bg-violet-500/10 text-violet-700 border-violet-200",
  "Full Sale": "bg-emerald-500/10 text-emerald-700 border-emerald-200",
};

const phaseNotionIcons: Record<string, string> = {
  "Discovery": notionDiscovery,
  "Objection Handling": notionObjection,
  "Executive Pitch": notionExecutive,
  "Full Sale": notionDeal,
};

function StoryCard({ story, onSelect }: { story: ComicStory; onSelect: () => void }) {
  const panels = [...(story.panels || [])].sort((a, b) => a.panelOrder - b.panelOrder);
  const repLines = panels.filter(p => p.speaker === "rep").length;
  const buyerLines = panels.filter(p => p.speaker === "buyer").length;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <Card
        className="cursor-pointer border border-border hover:border-magenta/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
        onClick={onSelect}
        data-testid={`story-card-${story.roleplayId}`}
      >
        <div className="relative h-32 bg-gradient-to-br from-primary/5 via-white to-muted/50 flex items-center justify-center overflow-hidden">
          <div className="relative z-10 flex flex-col items-center gap-2">
            <img
              src={phaseNotionIcons[story.phase] || notionPlaybook}
              alt={story.phase}
              className="w-16 h-16 group-hover:scale-110 transition-transform duration-300"
            />
            <Badge className={`${phaseColors[story.phase] || "bg-muted text-muted-foreground border-border"} border text-xs`}>
              {story.phase}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold font-display text-base text-foreground mb-1 group-hover:text-magenta transition-colors">{story.title}</h3>
          <p className="text-sm text-muted-foreground italic mb-3">{story.subtitle}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{story.description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <img src={notionSalesRep} alt="Rep" className="w-4 h-4" />
                {repLines} rep
              </span>
              <span className="flex items-center gap-1">
                <img src={notionBuyer} alt="Buyer" className="w-4 h-4" />
                {buyerLines} buyer
              </span>
            </div>
            <span className="text-magenta font-medium group-hover:underline">View Flow →</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const speakerIcons: Record<string, string> = {
  rep: notionSalesRep,
  buyer: notionBuyer,
  narrator: notionContext,
};

function FlowchartNode({ panel, index, total }: { panel: ComicPanel; index: number; total: number }) {
  const isNarrator = panel.speaker === "narrator";
  const isRep = panel.speaker === "rep";

  const nodeStyles = isNarrator
    ? "bg-muted/50 border-border"
    : isRep
    ? "bg-white dark:bg-card border-magenta/30"
    : "bg-white dark:bg-card border-blue-300/50";

  const label = isNarrator ? "Context" : isRep ? "Sales Rep" : "Buyer";
  const labelColor = isNarrator
    ? "text-muted-foreground"
    : isRep
    ? "text-magenta"
    : "text-blue-600";

  return (
    <motion.div
      className="flex flex-col items-center w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className={`w-full max-w-2xl ${isNarrator ? "mx-auto" : isRep ? "mr-auto" : "ml-auto"}`}>
        <div className={`rounded-xl border p-4 ${nodeStyles} shadow-sm`}>
          <div className="flex items-start gap-3">
            <img
              src={speakerIcons[panel.speaker] || notionContext}
              alt={label}
              className="w-9 h-9 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${labelColor}`}>
                {label}
              </div>
              <p className={`text-sm leading-relaxed ${isNarrator ? "italic text-muted-foreground" : "text-foreground"}`}>
                {panel.dialogue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {index < total - 1 && (
        <div className="flex flex-col items-center py-1">
          <div className="w-px h-4 bg-border" />
          <ArrowDown className="w-4 h-4 text-border" />
        </div>
      )}
    </motion.div>
  );
}

function FlowchartViewer({ story, onBack }: { story: ComicStory; onBack: () => void }) {
  const panels = [...(story.panels || [])].sort((a, b) => a.panelOrder - b.panelOrder);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6 gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 px-2"
          data-testid="back-to-stories"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <div className="flex items-center gap-2 min-w-0">
          <Badge className={`${phaseColors[story.phase] || "bg-muted text-muted-foreground border-border"} border shrink-0`}>
            {story.phase}
          </Badge>
        </div>
      </div>

      <div className="mb-6 text-center flex flex-col items-center">
        <img
          src={phaseNotionIcons[story.phase] || notionPlaybook}
          alt={story.phase}
          className="w-14 h-14 mb-3"
        />
        <h1 className="text-2xl font-bold font-display text-foreground mb-1">{story.title}</h1>
        <p className="text-muted-foreground italic">{story.subtitle}</p>
      </div>

      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <img src={notionContext} alt="Context" className="w-5 h-5" />
          Context
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <img src={notionSalesRep} alt="Sales Rep" className="w-5 h-5" />
          Sales Rep
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <img src={notionBuyer} alt="Buyer" className="w-5 h-5" />
          Buyer
        </div>
      </div>

      <div className="flex flex-col items-center px-2">
        {panels.map((panel, index) => (
          <FlowchartNode
            key={panel.id}
            panel={panel}
            index={index}
            total={panels.length}
          />
        ))}
      </div>

      <div className="mt-8 mb-4 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-1.5"
          data-testid="back-to-stories-bottom"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all scenarios
        </Button>
      </div>
    </div>
  );
}

export default function VictoryPlaybookPage() {
  const [, setLocation] = useLocation();
  const [selectedStory, setSelectedStory] = useState<ComicStory | null>(null);

  const { data: stories = [], isLoading } = useQuery<ComicStory[]>({
    queryKey: ["comic-stories"],
    queryFn: () => api.getPlaybookStories(),
  });

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedStory ? (
            <motion.div
              key="viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FlowchartViewer story={selectedStory} onBack={() => setSelectedStory(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-gradient-to-br from-primary/5 via-white to-yellow-50/50 border-b border-border rounded-2xl p-6 sm:p-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <img src={notionPlaybook} alt="" className="w-10 h-10" />
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight" data-testid="text-playbook-title">
                      Victory Playbook
                    </h1>
                  </div>
                </div>
                <p className="text-muted-foreground max-w-xl">
                  Visual conversation flows showing exactly how top reps handle 
                  objections, run discovery, and close deals. Study the patterns, master the responses.
                </p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="h-56 animate-pulse bg-muted/20 border-border" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        onSelect={() => setSelectedStory(story)}
                      />
                    ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
