import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Play, Trophy, Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { Nav } from "@/components/nav";

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
  Opening: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Turn & Burn": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Lawn Walk": "bg-green-500/20 text-green-400 border-green-500/30",
  Pricing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Closing: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const phaseIcons: Record<string, React.ReactNode> = {
  Opening: <Play className="w-4 h-4" />,
  "Turn & Burn": <Target className="w-4 h-4" />,
  "Lawn Walk": <BookOpen className="w-4 h-4" />,
  Pricing: <Trophy className="w-4 h-4" />,
  Closing: <Trophy className="w-4 h-4" />,
};

function StoryCard({ story, onSelect }: { story: ComicStory; onSelect: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <Card
        className="cursor-pointer bg-card/50 border-border/50 hover:border-primary/50 transition-all overflow-hidden group"
        onClick={onSelect}
        data-testid={`story-card-${story.roleplayId}`}
      >
        <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2322c55e%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="text-4xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors">
              #{story.orderIndex}
            </div>
            <Badge className={`${phaseColors[story.phase] || "bg-muted"} border`}>
              <span className="flex items-center gap-1">
                {phaseIcons[story.phase]}
                {story.phase}
              </span>
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1">{story.title}</h3>
          <p className="text-sm text-muted-foreground italic mb-2">{story.subtitle}</p>
          <p className="text-xs text-muted-foreground">{story.description}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{story.panels?.length || 0} panels</span>
            <span className="text-primary group-hover:underline">View Story →</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ComicPanelView({ panel, panelNumber, totalPanels }: { panel: ComicPanel; panelNumber: number; totalPanels: number }) {
  const speakerColors = {
    rep: "bg-primary text-primary-foreground",
    homeowner: "bg-blue-500 text-white",
    narrator: "bg-muted text-muted-foreground italic",
  };

  const speakerLabels = {
    rep: "Sales Rep",
    homeowner: "Homeowner",
    narrator: "Narrator",
  };

  const speakerColor = speakerColors[panel.speaker as keyof typeof speakerColors] || speakerColors.narrator;
  const speakerLabel = speakerLabels[panel.speaker as keyof typeof speakerLabels] || "Narrator";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      <div className="flex-1 relative bg-gradient-to-b from-muted/30 to-muted/10 rounded-xl overflow-hidden">
        {panel.imageUrl ? (
          <img
            src={panel.imageUrl}
            alt={panel.setting}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-primary/50" />
              </div>
              <p className="text-sm text-muted-foreground max-w-md">{panel.setting}</p>
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
          {panelNumber} / {totalPanels}
        </div>
      </div>

      <div className="mt-4 p-4 bg-card rounded-xl border border-border/50">
        <div className="flex items-start gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${speakerColor}`}>
            {speakerLabel}
          </div>
          <p className={`flex-1 text-lg leading-relaxed ${panel.speaker === "narrator" ? "italic text-muted-foreground" : ""}`}>
            {panel.dialogue}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function StoryViewer({ story, onBack }: { story: ComicStory; onBack: () => void }) {
  const [currentPanel, setCurrentPanel] = useState(0);
  const panels = story.panels?.sort((a, b) => a.panelOrder - b.panelOrder) || [];

  const nextPanel = () => {
    if (currentPanel < panels.length - 1) {
      setCurrentPanel((prev) => prev + 1);
    }
  };

  const prevPanel = () => {
    if (currentPanel > 0) {
      setCurrentPanel((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2"
          data-testid="back-to-stories"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stories
        </Button>
        <div className="flex items-center gap-2">
          <Badge className={`${phaseColors[story.phase] || "bg-muted"} border`}>
            {story.phase}
          </Badge>
          <h2 className="font-semibold">{story.title}</h2>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {panels[currentPanel] && (
            <ComicPanelView
              key={panels[currentPanel].id}
              panel={panels[currentPanel]}
              panelNumber={currentPanel + 1}
              totalPanels={panels.length}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <Button
          variant="outline"
          onClick={prevPanel}
          disabled={currentPanel === 0}
          className="gap-2"
          data-testid="prev-panel"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-1">
          {panels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPanel(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentPanel ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              data-testid={`panel-dot-${idx}`}
            />
          ))}
        </div>

        <Button
          onClick={nextPanel}
          disabled={currentPanel === panels.length - 1}
          className="gap-2"
          data-testid="next-panel"
        >
          Next
          <ChevronRight className="w-4 h-4" />
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
              <StoryViewer story={selectedStory} onBack={() => setSelectedStory(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Victory Playbook</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Learn from the best. These visual stories show you exactly how top sales reps handle 
                  common objections and close deals. Study the techniques, master the responses.
                </p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="h-64 animate-pulse bg-muted/20" />
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
