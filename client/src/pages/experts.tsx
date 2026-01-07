import { Nav } from "@/components/nav";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Users, Loader2, MapPin, Star, Sparkles, Calendar, MessageSquare, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface Expert {
  id: string;
  slug: string;
  name: string;
  company: string;
  location: string;
  bio: string;
  avatar: string | null;
  website: string | null;
  specialties: string[];
  credentials: string[] | null;
  aiCoachRate: number;
  consultationRate: number;
  callReviewRate: number;
  featured: number;
  orderIndex: number;
}

export default function ExpertsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const { data: experts = [], isLoading } = useQuery<Expert[]>({
    queryKey: ["experts"],
    queryFn: async () => {
      const res = await fetch("/api/experts");
      if (!res.ok) throw new Error("Failed to fetch experts");
      return res.json();
    },
  });

  const allSpecialties = Array.from(new Set(experts.flatMap(e => e.specialties || []))).sort();

  const filteredExperts = experts.filter(expert => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      expert.name.toLowerCase().includes(searchLower) ||
      expert.company.toLowerCase().includes(searchLower) ||
      expert.bio.toLowerCase().includes(searchLower) ||
      expert.specialties?.some(s => s.toLowerCase().includes(searchLower));
    
    const matchesSpecialty = !selectedSpecialty || expert.specialties?.includes(selectedSpecialty);
    
    return matchesSearch && matchesSpecialty;
  });

  const featuredExperts = filteredExperts.filter(e => e.featured === 1);
  const otherExperts = filteredExperts.filter(e => e.featured !== 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading experts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Nav />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground" data-testid="page-title">Expert Marketplace</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Connect with top D2D sales coaches and trainers. Get personalized feedback through AI-powered coaching or book direct consultations with industry leaders.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
              data-testid="input-search-experts"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedSpecialty === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedSpecialty(null)}
            >
              All
            </Badge>
            {allSpecialties.slice(0, 8).map(specialty => (
              <Badge 
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? null : specialty)}
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Two Ways to Learn</h2>
              <p className="text-muted-foreground text-sm">
                <strong>AI Coach</strong> - Get instant feedback using our AI trained on each expert's methodology (${(15 / 100).toFixed(2)}/min). 
                <strong className="ml-2">Direct Consultation</strong> - Book time with the actual expert for premium coaching.
              </p>
            </div>
          </div>
        </div>

        {featuredExperts.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Star className="w-5 h-5 text-yellow-500" />
              Featured Experts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredExperts.map((expert, index) => (
                <ExpertCard key={expert.id} expert={expert} index={index} featured />
              ))}
            </div>
          </>
        )}

        {otherExperts.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-foreground">All Experts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherExperts.map((expert, index) => (
                <ExpertCard key={expert.id} expert={expert} index={index} />
              ))}
            </div>
          </>
        )}

        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No experts match your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function ExpertCard({ expert, index, featured = false }: { expert: Expert; index: number; featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card 
        className={`overflow-hidden h-full ${featured ? 'ring-2 ring-primary/30' : ''} bg-card border-border`}
        data-testid={`card-expert-${expert.slug}`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {expert.avatar ? (
                <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-primary">
                  {expert.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-foreground truncate" data-testid={`text-expert-name-${expert.slug}`}>
                  {expert.name}
                </h3>
                {featured && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
              </div>
              <p className="text-sm text-primary font-medium">{expert.company}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                {expert.location}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {expert.bio}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {expert.specialties?.slice(0, 3).map(specialty => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {expert.specialties?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{expert.specialties.length - 3}
              </Badge>
            )}
          </div>

          {expert.credentials && expert.credentials.length > 0 && (
            <div className="text-xs text-muted-foreground mb-4">
              {expert.credentials.slice(0, 2).join(' • ')}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              data-testid={`button-ai-coach-${expert.slug}`}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Coach
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="w-full"
              data-testid={`button-consultation-${expert.slug}`}
            >
              <Calendar className="w-3 h-3 mr-1" />
              Book
            </Button>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground mt-3">
            <span>AI: ${(expert.aiCoachRate / 100).toFixed(2)}/min</span>
            <span>Consult: ${expert.consultationRate}</span>
          </div>

          {expert.website && (
            <a 
              href={expert.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              <ExternalLink className="w-3 h-3" />
              Website
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
