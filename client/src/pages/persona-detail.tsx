import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Target, Heart, AlertTriangle, CheckCircle, Loader2, Lightbulb, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, type BuyerPersona } from "@/lib/api";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";

export default function PersonaDetailPage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const { data: persona, isLoading } = useQuery<BuyerPersona>({
    queryKey: ["persona", params.slug],
    queryFn: () => api.getBuyerPersona(params.slug!),
    enabled: !!params.slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading persona...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Users className="w-12 h-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">Persona not found</p>
            <Button onClick={() => setLocation("/personas")} variant="outline">
              Back to Personas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
      <Nav />
      
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <Button
          variant="ghost"
          onClick={() => setLocation("/personas")}
          className="mb-6"
          data-testid="button-back-to-personas"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Personas
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden sticky top-4">
              <div className="aspect-square bg-muted overflow-hidden">
                {persona.avatar ? (
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    className="w-full h-full object-cover"
                    data-testid="img-persona-avatar"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-20 h-20 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-2" data-testid="text-persona-name">
                  {persona.name}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {persona.subtitle}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {persona.attributes?.map((attr, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {attr}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  What They Care About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {persona.whatTheyCareAbout?.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Heart className="w-4 h-4 text-pink-500 mt-1 shrink-0" />
                      <span className="text-muted-foreground" data-testid={`text-care-${index}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  What Triggers Resistance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {persona.whatTriggersResistance?.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                      <span className="text-muted-foreground" data-testid={`text-trigger-${index}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  How to Win
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {persona.howToWin?.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                      <span className="text-muted-foreground" data-testid={`text-win-${index}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Best Plays
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {persona.bestPlays?.map((play, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground" data-testid={`text-play-${index}`}>{play}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
