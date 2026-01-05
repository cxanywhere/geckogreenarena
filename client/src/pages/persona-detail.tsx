import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Target, MessageSquare, AlertTriangle, CheckCircle, Loader2, Quote } from "lucide-react";
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
                {persona.imageUrl ? (
                  <img
                    src={persona.imageUrl}
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
                <h1 className="text-2xl font-bold mb-3" data-testid="text-persona-name">
                  {persona.name}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {persona.summary}
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                  <div className="flex items-start gap-2">
                    <Quote className="w-4 h-4 mt-1 text-primary shrink-0" />
                    <p className="text-sm italic" data-testid="text-core-belief">
                      "{persona.coreBelief}"
                    </p>
                  </div>
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
                  <Target className="w-5 h-5 text-primary" />
                  Approach Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground" data-testid="text-approach-strategy">
                  {persona.approachStrategy}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Key Phrases to Listen For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {persona.keyPhrases?.map((phrase, index) => (
                    <Badge key={index} variant="secondary" className="text-sm" data-testid={`badge-phrase-${index}`}>
                      "{phrase}"
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {persona.bestPractices?.map((practice, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                      <span className="text-muted-foreground" data-testid={`text-practice-${index}`}>{practice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {persona.mistakes?.map((mistake, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                      <span className="text-muted-foreground" data-testid={`text-mistake-${index}`}>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Objection Handling Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {persona.objectionHandling?.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground" data-testid={`text-objection-${index}`}>{tip}</span>
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
