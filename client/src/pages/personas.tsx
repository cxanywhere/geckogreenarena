import { Nav } from "@/components/nav";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type BuyerPersona } from "@/lib/api";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function PersonasPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: personas = [], isLoading } = useQuery<BuyerPersona[]>({
    queryKey: ["personas"],
    queryFn: () => api.getBuyerPersonas(),
  });

  const filteredPersonas = personas.filter(persona => {
    const searchLower = searchQuery.toLowerCase();
    return (
      persona.name.toLowerCase().includes(searchLower) ||
      (persona.subtitle?.toLowerCase().includes(searchLower) || false) ||
      persona.attributes?.some(attr => attr.toLowerCase().includes(searchLower))
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading buyer personas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
      <Nav />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold" data-testid="page-title">Buyer Personas</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Master how to connect with each buyer type. Learn their motivations, what triggers resistance, and how to win them over.
          </p>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search personas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-personas"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPersonas.map((persona, index) => (
            <Link key={persona.id} href={`/personas/${persona.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden h-full group"
                  data-testid={`card-persona-${persona.slug}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {persona.avatar ? (
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-16 h-16 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1" data-testid={`text-persona-name-${persona.slug}`}>
                      {persona.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {persona.subtitle}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {persona.attributes?.[0]?.split(",")[0] || "Buyer"}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {filteredPersonas.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No personas match your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
