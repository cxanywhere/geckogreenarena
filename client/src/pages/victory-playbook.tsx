import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Play, Trophy, Target, ArrowLeft, MessageSquare, User, Mic, ArrowDown } from "lucide-react";
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
  "Discovery": "bg-blue-500/15 text-blue-600 border-blue-300",
  "Objection Handling": "bg-amber-500/15 text-amber-700 border-amber-300",
  "Executive Pitch": "bg-violet-500/15 text-violet-600 border-violet-300",
  "Full Sale": "bg-emerald-500/15 text-emerald-700 border-emerald-300",
  "Opening": "bg-blue-500/15 text-blue-600 border-blue-300",
  "Turn & Burn": "bg-orange-500/15 text-orange-600 border-orange-300",
  "Demo": "bg-green-500/15 text-green-600 border-green-300",
  "Pricing": "bg-purple-500/15 text-purple-600 border-purple-300",
  "Closing": "bg-emerald-500/15 text-emerald-700 border-emerald-300",
};

const phaseIcons: Record<string, React.ReactNode> = {
  "Discovery": <Play className="w-3.5 h-3.5" />,
  "Objection Handling": <Target className="w-3.5 h-3.5" />,
  "Executive Pitch": <Trophy className="w-3.5 h-3.5" />,
  "Full Sale": <BookOpen className="w-3.5 h-3.5" />,
  "Opening": <Play className="w-3.5 h-3.5" />,
  "Demo": <BookOpen className="w-3.5 h-3.5" />,
  "Pricing": <Trophy className="w-3.5 h-3.5" />,
  "Closing": <Trophy className="w-3.5 h-3.5" />,
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
        className="cursor-pointer bg-white border-[#e8e8e5] hover:border-[#787774] transition-all overflow-hidden group"
        onClick={onSelect}
        data-testid={`story-card-${story.roleplayId}`}
      >
        <div className="relative h-28 bg-gradient-to-br from-[#f7f7f5] to-white flex items-center justify-center overflow-hidden">
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="text-3xl font-bold text-[#787774]/40 group-hover:text-[#37352f]/60 transition-colors">
              #{story.orderIndex}
            </div>
            <Badge className={`${phaseColors[story.phase] || "bg-[#f7f7f5] text-[#787774] border-[#e8e8e5]"} border text-xs`}>
              <span className="flex items-center gap-1">
                {phaseIcons[story.phase]}
                {story.phase}
              </span>
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base text-[#1a1a1a] mb-1">{story.title}</h3>
          <p className="text-sm text-[#787774] italic mb-3">{story.subtitle}</p>
          <p className="text-xs text-[#787774] line-clamp-2 mb-3">{story.description}</p>
          <div className="flex items-center justify-between text-xs text-[#787774]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Mic className="w-3 h-3 text-emerald-600" />
                {repLines} rep
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-blue-500" />
                {buyerLines} buyer
              </span>
            </div>
            <span className="text-[#37352f] font-medium group-hover:underline">View Flow →</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FlowchartNode({ panel, index, total }: { panel: ComicPanel; index: number; total: number }) {
  const isNarrator = panel.speaker === "narrator";
  const isRep = panel.speaker === "rep";
  const isBuyer = panel.speaker === "buyer";

  const nodeStyles = isNarrator
    ? "bg-[#f7f7f5] border-[#e8e8e5] text-[#787774]"
    : isRep
    ? "bg-emerald-50 border-emerald-200"
    : "bg-blue-50 border-blue-200";

  const iconBg = isNarrator
    ? "bg-[#e8e8e5] text-[#787774]"
    : isRep
    ? "bg-emerald-100 text-emerald-700"
    : "bg-blue-100 text-blue-700";

  const label = isNarrator ? "Context" : isRep ? "Sales Rep" : "Buyer";
  const labelColor = isNarrator
    ? "text-[#787774]"
    : isRep
    ? "text-emerald-700"
    : "text-blue-700";

  const alignment = isNarrator ? "mx-auto" : isRep ? "mr-auto" : "ml-auto";

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <div className={`w-full max-w-2xl ${alignment}`}>
        <div className={`rounded-xl border-2 p-4 ${nodeStyles} relative`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
              {isNarrator ? (
                <BookOpen className="w-4 h-4" />
              ) : isRep ? (
                <Mic className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${labelColor}`}>
                {label}
              </div>
              <p className={`text-sm leading-relaxed ${isNarrator ? "italic text-[#787774]" : "text-[#37352f]"}`}>
                {panel.dialogue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {index < total - 1 && (
        <div className="flex flex-col items-center py-1">
          <div className="w-0.5 h-4 bg-[#e8e8e5]" />
          <ArrowDown className="w-4 h-4 text-[#e8e8e5]" />
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
          className="gap-1.5 px-2 text-[#787774] hover:text-[#37352f]"
          data-testid="back-to-stories"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <div className="flex items-center gap-2 min-w-0">
          <Badge className={`${phaseColors[story.phase] || "bg-[#f7f7f5] text-[#787774] border-[#e8e8e5]"} border shrink-0`}>
            {story.phase}
          </Badge>
          <h2 className="font-semibold text-[#1a1a1a] text-sm sm:text-base truncate">{story.title}</h2>
        </div>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-1">{story.title}</h1>
        <p className="text-[#787774] italic">{story.subtitle}</p>
      </div>

      <div className="flex items-center justify-center gap-6 mb-6 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#e8e8e5]" />
          <span className="text-[#787774]">Context</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-200" />
          <span className="text-[#787774]">Sales Rep</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-200" />
          <span className="text-[#787774]">Buyer</span>
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
          className="gap-1.5 text-[#787774] border-[#e8e8e5]"
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
    <div className="min-h-screen bg-[#f7f7f5]">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-8">
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
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Victory Playbook</h1>
                <p className="text-[#787774] max-w-xl mx-auto">
                  Visual conversation flows showing exactly how top reps handle 
                  objections, run discovery, and close deals. Study the patterns, master the responses.
                </p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="h-56 animate-pulse bg-white/50 border-[#e8e8e5]" />
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
