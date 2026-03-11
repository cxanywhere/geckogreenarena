import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/nav";
import { Presentation, Clock, BarChart3, ChevronRight, Target, Users } from "lucide-react";

interface PitchDeck {
  id: string;
  slug: string;
  clientName: string;
  clientLogo: string;
  industry: string;
  buyerName: string;
  buyerRole: string;
  buyerAvatar: string;
  buyerContext: string;
  description: string;
  difficulty: string;
  slideCount: number;
  estimatedMinutes: number;
  coverImage: string;
}

export default function PitchPracticePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: decks = [], isLoading } = useQuery<PitchDeck[]>({
    queryKey: ["/api/pitch-decks"],
    queryFn: async () => {
      const res = await fetch("/api/pitch-decks");
      if (!res.ok) throw new Error("Failed to fetch pitch decks");
      return res.json();
    },
  });

  const difficultyColor = (d: string) => {
    if (d === "Advanced") return "text-red-600 bg-red-50 border-red-200";
    if (d === "Intermediate") return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <Nav />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-[#37352f] flex items-center justify-center">
              <Presentation className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]" data-testid="text-page-title">Pitch Practice</h1>
              <p className="text-sm text-[#787774]">Practice presenting client proposals and sharpen your pitch delivery</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e8e8e5] rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#004182] flex items-center justify-center shrink-0">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-1">How It Works</h2>
              <div className="space-y-2 text-sm text-[#787774]">
                <p>Select a client proposal deck below to start practicing. You'll present each slide as if you're in a real client meeting.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div className="flex items-center gap-2 p-3 bg-[#f7f7f5] rounded-lg">
                    <span className="text-lg">1</span>
                    <span className="text-xs">Choose a proposal deck</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-[#f7f7f5] rounded-lg">
                    <span className="text-lg">2</span>
                    <span className="text-xs">Present each slide with your pitch</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-[#f7f7f5] rounded-lg">
                    <span className="text-lg">3</span>
                    <span className="text-xs">Get AI evaluation & scoring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-6 w-6 border-2 border-[#37352f] border-t-transparent rounded-full" />
          </div>
        ) : decks.length === 0 ? (
          <div className="text-center py-20">
            <Presentation className="h-12 w-12 mx-auto text-[#c4c4c0] mb-4" />
            <p className="text-[#787774]">No pitch decks available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {decks.map((deck) => (
              <div
                key={deck.id}
                onClick={() => setLocation(`/pitch-session/${deck.slug}`)}
                className="group bg-white border border-[#e8e8e5] rounded-xl p-6 hover:border-[#37352f]/20 hover:shadow-sm transition-all cursor-pointer"
                data-testid={`card-pitch-deck-${deck.slug}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${difficultyColor(deck.difficulty)}`}>
                        {deck.difficulty}
                      </span>
                      <span className="text-xs text-[#787774]">{deck.industry}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#37352f]">
                      {deck.clientName} — LinkedIn Ads Proposal
                    </h3>
                    <p className="text-sm text-[#787774] line-clamp-2 mb-3">{deck.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-[#787774]">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        <span>{deck.buyerName}, {deck.buyerRole}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Presentation className="h-3.5 w-3.5" />
                        <span>{deck.slideCount} slides</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>~{deck.estimatedMinutes} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center h-full pt-4">
                    <ChevronRight className="h-5 w-5 text-[#c4c4c0] group-hover:text-[#37352f] transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
