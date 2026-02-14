import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Shield, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@assets/generated_images/abstract_bottle_green_glass_tech_shapes.png";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-magenta"></div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "director":
      case "admin":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "manager":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-magenta/10 text-magenta border-magenta/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-magenta/5 via-transparent to-background" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 text-muted-foreground hover:text-foreground"
                onClick={() => window.history.back()}
                data-testid="button-close-profile"
              >
                <X className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-profile-title">My Profile</h1>
              <p className="text-muted-foreground">Your account information</p>
            </div>

            <Card className="border-magenta/10 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {user.warriorAvatar ? (
                    <img 
                      src={user.warriorAvatar} 
                      alt={user.name}
                      className="h-32 w-32 rounded-full object-cover border-4 border-magenta shadow-lg shadow-magenta/20"
                      data-testid="img-profile-avatar"
                    />
                  ) : (
                    <div 
                      className="h-32 w-32 rounded-full bg-magenta text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-magenta/20"
                      data-testid="img-profile-initials"
                    >
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-2xl mb-2" data-testid="text-profile-name">{user.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`capitalize ${getRoleBadgeColor(user.role)}`}
                      data-testid="badge-profile-role"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-magenta/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-magenta" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium" data-testid="text-profile-email">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-magenta/10 flex items-center justify-center">
                      <CalendarDays className="h-5 w-5 text-magenta" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="font-medium" data-testid="text-profile-joined">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {user.profilePhoto && user.profilePhoto !== user.warriorAvatar && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Original Photo</h3>
                    <img 
                      src={user.profilePhoto} 
                      alt="Original profile"
                      className="h-24 w-24 rounded-lg object-cover border border-border"
                      data-testid="img-profile-original"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
