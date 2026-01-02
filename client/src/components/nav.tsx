import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

import geckoLogo from "@assets/image_1766975682051.png";
import arenaLogo from "@assets/generated_images/superhero_style_logo_for_arena_ai.png";

export function Nav() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    setLocation("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const links = [
    { href: "/dashboard", label: "Arena" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/battlecards", label: "Battlecards" },
    { href: "/resources", label: "Library" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
            <img src={arenaLogo} alt="Arena AI" className="h-8 w-8 object-contain" />
            <div className="flex flex-col leading-none">
              <span>arena ai</span>
              <span className="text-[10px] text-foreground/80 font-normal uppercase tracking-wide">by gigarev</span>
            </div>
          </Link>
          
          <div className="hidden xl:flex items-center gap-2 pl-6 border-l border-primary/10">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Client:</span>
            <img src={geckoLogo} alt="GeckoGreen" className="h-8 w-auto object-contain" />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === link.href
                  ? "text-primary font-bold"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pl-6 border-l border-primary/10">
            <ModeToggle />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer" data-testid="button-user-menu">
                    <div className="hidden xl:flex flex-col items-end">
                      <span className="text-sm font-bold leading-none">{user.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md shadow-primary/20">
                      {getInitials(user.name)}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer" data-testid="button-signout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden flex items-center gap-3">
          <ModeToggle />
          {user && (
            <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md shadow-primary/20">
              {getInitials(user.name)}
            </div>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border-l-white/20">
              <div className="flex flex-col gap-6 mt-10">
                {user && (
                  <div className="flex items-center gap-3 pb-4 border-b border-primary/10">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/20">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                )}
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors",
                      location === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 text-lg font-medium text-red-600 mt-4 pt-4 border-t border-primary/10"
                    data-testid="button-signout-mobile"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
