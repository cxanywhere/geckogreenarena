import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, LogOut, User, ChevronDown, Swords, BookOpen, Trophy, GraduationCap, BarChart3, Users, ScrollText, Target, Sparkles, Library, MessageSquare } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "next-themes";

import geckoLogo from "@assets/image_1766975682051.png";
import arenaLogoDark from "@/assets/arena-logo-dark.png";
import arenaLogoLight from "@/assets/arena-logo-light.png";

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  items: { href: string; label: string; icon: React.ReactNode; description: string }[];
}

export function Nav() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { resolvedTheme } = useTheme();
  
  const arenaLogo = resolvedTheme === "dark" ? arenaLogoDark : arenaLogoLight;

  const handleSignOut = () => {
    logout();
    setLocation("/login");
  };

  const confirmSignOut = () => {
    setShowSignOutDialog(false);
    setIsOpen(false);
    handleSignOut();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navGroups: NavGroup[] = [
    {
      label: "Training",
      icon: <Swords className="h-4 w-4" />,
      items: [
        { href: "/dashboard", label: "Arena", icon: <Swords className="h-4 w-4" />, description: "Your training hub" },
        { href: "/quizzes", label: "Quizzes", icon: <GraduationCap className="h-4 w-4" />, description: "Review & complete quizzes" },
        { href: "/my-stats", label: "My Stats", icon: <BarChart3 className="h-4 w-4" />, description: "Track your progress" },
        { href: "/leaderboard", label: "Leaderboard", icon: <Trophy className="h-4 w-4" />, description: "See top performers" },
      ],
    },
    {
      label: "Resources",
      icon: <BookOpen className="h-4 w-4" />,
      items: [
        { href: "/playbook", label: "Playbook", icon: <ScrollText className="h-4 w-4" />, description: "Winning sales plays" },
        { href: "/battlecards", label: "Battlecards", icon: <Target className="h-4 w-4" />, description: "Quick objection scripts" },
        { href: "/personas", label: "Personas", icon: <Users className="h-4 w-4" />, description: "Buyer personality types" },
        { href: "/resources", label: "Library", icon: <Library className="h-4 w-4" />, description: "Videos & learning materials" },
      ],
    },
    {
      label: "Support",
      icon: <MessageSquare className="h-4 w-4" />,
      items: [
        { href: "/coach", label: "AI Coach", icon: <Sparkles className="h-4 w-4" />, description: "Get personalized coaching" },
        { href: "/experts", label: "Experts", icon: <Users className="h-4 w-4" />, description: "Connect with D2D pros" },
      ],
    },
  ];

  const allLinks = navGroups.flatMap((g) => g.items);

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => location === item.href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
            <div className="relative h-8 w-8">
              <img src={arenaLogoDark} alt="Arena AI" className="h-8 w-8 object-contain absolute inset-0 hidden dark:block drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <img src={arenaLogoLight} alt="Arena AI" className="h-8 w-8 object-contain absolute inset-0 block dark:hidden" />
            </div>
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
        <div className="hidden lg:flex items-center gap-1">
          {navGroups.map((group) => (
            <DropdownMenu
              key={group.label}
              open={openDropdown === group.label}
              onOpenChange={(open) => setOpenDropdown(open ? group.label : null)}
            >
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isGroupActive(group)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  data-testid={`nav-group-${group.label.toLowerCase()}`}
                >
                  {group.icon}
                  {group.label}
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    openDropdown === group.label && "rotate-180"
                  )} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                {group.items.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    onClick={() => { setLocation(item.href); setOpenDropdown(null); }}
                    className={cn(
                      "cursor-pointer flex items-start gap-3 py-2.5",
                      location === item.href && "bg-primary/5"
                    )}
                    data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className={cn(
                      "mt-0.5",
                      location === item.href ? "text-primary" : "text-muted-foreground"
                    )}>
                      {item.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className={cn(
                        "font-medium",
                        location === item.href && "text-primary"
                      )}>
                        {item.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

          <div className="flex items-center gap-3 pl-4 ml-2 border-l border-primary/10">
            <ModeToggle />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer" data-testid="button-user-menu">
                    <div className="hidden xl:flex flex-col items-end" onClick={(e) => { e.stopPropagation(); setLocation("/profile"); }}>
                      <span className="text-sm font-bold leading-none hover:text-primary transition-colors">{user.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); setLocation("/profile"); }}>
                      {user.warriorAvatar ? (
                        <img 
                          src={user.warriorAvatar} 
                          alt={user.name} 
                          className="h-9 w-9 rounded-full object-cover border-2 border-primary shadow-md shadow-primary/20 hover:ring-2 hover:ring-primary/50 transition-all"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md shadow-primary/20 hover:ring-2 hover:ring-primary/50 transition-all">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/profile")} className="cursor-pointer" data-testid="button-profile">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSignOutDialog(true)} className="text-red-600 cursor-pointer" data-testid="button-signout">
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
            <div onClick={() => setLocation("/profile")} className="cursor-pointer">
              {user.warriorAvatar ? (
                <img 
                  src={user.warriorAvatar} 
                  alt={user.name} 
                  className="h-9 w-9 rounded-full object-cover border-2 border-primary shadow-md shadow-primary/20 hover:ring-2 hover:ring-primary/50 transition-all"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md shadow-primary/20 hover:ring-2 hover:ring-primary/50 transition-all">
                  {getInitials(user.name)}
                </div>
              )}
            </div>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border-l-white/20">
              <div className="flex flex-col gap-2 mt-10">
                {user && (
                  <div className="flex items-center gap-3 pb-4 mb-2 border-b border-primary/10 cursor-pointer" onClick={() => { setIsOpen(false); setLocation("/profile"); }}>
                    {user.warriorAvatar ? (
                      <img 
                        src={user.warriorAvatar} 
                        alt={user.name} 
                        className="h-10 w-10 rounded-full object-cover border-2 border-primary shadow-md shadow-primary/20"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/20">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold hover:text-primary transition-colors">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                )}
                {navGroups.map((group) => (
                  <div key={group.label} className="mb-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {group.icon}
                      {group.label}
                    </div>
                    <div className="flex flex-col">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            location === item.href
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          <span className={location === item.href ? "text-primary" : "text-muted-foreground"}>
                            {item.icon}
                          </span>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                {user && (
                  <button
                    onClick={() => setShowSignOutDialog(true)}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 mt-2 mx-2 pt-4 border-t border-primary/10"
                    data-testid="button-signout-mobile"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-signout-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSignOut} className="bg-red-600 hover:bg-red-700" data-testid="button-signout-confirm">
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
