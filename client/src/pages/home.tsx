import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { CharacterCard } from "@/components/character-card";
import { CHARACTERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Cpu, Globe, Zap } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_bottle_green_glass_tech_shapes.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Nav />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <img src={heroBg} alt="Abstract Background" className="w-full h-full object-cover mask-image-gradient" />
        </div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-primary/20 text-primary text-xs font-mono font-bold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                SYSTEM ONLINE V2.0
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight mb-6 text-foreground">
                Enter the <span className="text-primary transparent-text-stroke">GeckoGreen</span> Arena.
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                Experience the next evolution of AI roleplay. Engage with hyper-realistic personas in a bottle-green digital ecosystem.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                  Start Roleplay <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-primary/20 hover:bg-secondary/50 hover:text-primary hover:border-primary/50">
                  View Leaderboard
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/40 bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Bot, label: "Active Models", value: "24" },
              { icon: Cpu, label: "Processing Power", value: "840 TFLOPS" },
              { icon: Globe, label: "Users Online", value: "12,402" },
              { icon: Zap, label: "Avg Response", value: "< 0.4s" },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="mb-4 p-3 bg-white rounded-xl shadow-sm border border-border">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-display font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Characters Grid */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Select Your Opponent</h2>
              <p className="text-muted-foreground max-w-md">Choose from our roster of advanced AI personas, each with unique personality matrices and combat styles.</p>
            </div>
            <Button variant="link" className="text-primary hidden md:flex">View All Characters</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CHARACTERS.map((char, i) => (
              <CharacterCard key={char.id} character={char} index={i} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-primary/5 border-t border-primary/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="font-display font-bold text-2xl text-primary mb-4">GeckoGreen</div>
          <p className="text-muted-foreground text-sm mb-8">© 2025 GeckoGreen Industries. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
