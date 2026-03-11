import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, LogOut, User, ChevronDown, LayoutDashboard, BookOpen, Trophy, GraduationCap, BarChart3, Users, ScrollText, Target, Sparkles, Library, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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

import arenaHelmetDark from "@/assets/arena-helmet-dark.png";

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
      icon: <LayoutDashboard className="h-4 w-4" />,
      items: [
        { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, description: "Your training hub" },
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
        { href: "/experts", label: "Experts", icon: <Users className="h-4 w-4" />, description: "Connect with industry experts" },
      ],
    },
  ];

  const allLinks = navGroups.flatMap((g) => g.items);

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => location === item.href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3 lg:gap-5 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            <img src={arenaHelmetDark} alt="Arena AI" className="h-8 w-auto object-contain" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-sm font-bold tracking-wide text-foreground">Arena AI</span>
              <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">by GigaRev</span>
            </div>
          </Link>
          <div className="h-5 w-px bg-border shrink-0" />
          <span className="text-sm font-semibold text-foreground truncate">LinkedIn Marketing Solutions</span>
        </div>

        <div className="hidden lg:flex items-center gap-0.5">
          {navGroups.map((group) => (
            <DropdownMenu
              key={group.label}
              open={openDropdown === group.label}
              onOpenChange={(open) => setOpenDropdown(open ? group.label : null)}
            >
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    isGroupActive(group)
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                  data-testid={`nav-group-${group.label.toLowerCase()}`}
                >
                  {group.label}
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    openDropdown === group.label && "rotate-180"
                  )} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-white border-border shadow-lg">
                {group.items.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    onClick={() => { setLocation(item.href); setOpenDropdown(null); }}
                    className={cn(
                      "cursor-pointer flex items-start gap-3 py-2.5",
                      location === item.href && "bg-secondary"
                    )}
                    data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className={cn(
                      "mt-0.5",
                      location === item.href ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {item.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className={cn(
                        "font-medium text-sm",
                        location === item.href && "text-foreground"
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

          <div className="flex items-center gap-2 pl-3 ml-2 border-l border-border">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer" data-testid="button-user-menu">
                    <div className="hidden xl:flex flex-col items-end" onClick={(e) => { e.stopPropagation(); setLocation("/profile"); }}>
                      <span className="text-sm font-semibold leading-none text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); setLocation("/profile"); }}>
                      {user.warriorAvatar ? (
                        <img 
                          src={user.warriorAvatar} 
                          alt={user.name} 
                          className="h-8 w-8 rounded-full object-cover border-2 border-border"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border-border shadow-lg">
                  <div className="px-2 py-1.5 text-sm font-medium text-foreground">{user.email}</div>
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

        <div className="lg:hidden flex items-center gap-2">
          {user && (
            <div onClick={() => setLocation("/profile")} className="cursor-pointer">
              {user.warriorAvatar ? (
                <img 
                  src={user.warriorAvatar} 
                  alt={user.name} 
                  className="h-8 w-8 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs">
                  {getInitials(user.name)}
                </div>
              )}
            </div>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-l border-border">
              <div className="flex flex-col gap-1 mt-10">
                {user && (
                  <div className="flex items-center gap-3 pb-4 mb-3 border-b border-border cursor-pointer" onClick={() => { setIsOpen(false); setLocation("/profile"); }}>
                    {user.warriorAvatar ? (
                      <img 
                        src={user.warriorAvatar} 
                        alt={user.name} 
                        className="h-10 w-10 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                )}
                {navGroups.map((group) => (
                  <div key={group.label} className="mb-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                            location === item.href
                              ? "text-foreground bg-secondary"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                          )}
                        >
                          <span className={location === item.href ? "text-foreground" : "text-muted-foreground"}>
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
                    className="flex items-center gap-2 text-sm font-medium text-red-500 mt-2 mx-2 pt-4 border-t border-border min-h-[44px]"
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
        <AlertDialogContent className="bg-white border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-signout-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSignOut} className="bg-red-600 hover:bg-red-700 text-white" data-testid="button-signout-confirm">
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
