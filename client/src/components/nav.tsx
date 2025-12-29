import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Bot, Zap, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Nav() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Arena" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <a className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 fill-primary" />
            <span>GigaRev<span className="text-foreground/80 font-normal">ArenaAI</span></span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </a>
            </Link>
          ))}
          <Button size="sm" className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 font-display">
            Connect
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 backdrop-blur-xl border-l-white/20">
              <div className="flex flex-col gap-6 mt-10">
                {links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors",
                        location === link.href
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
