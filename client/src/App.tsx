import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/home";
import LoginPage from "@/pages/login";
import ChatPage from "@/pages/chat";
import ChapterPage from "@/pages/chapter";
import ResultsPage from "@/pages/results";
import LeaderboardPage from "@/pages/leaderboard";
import ResourcesPage from "@/pages/resources";
import BattlecardsPage from "@/pages/battlecards";
import ReportCardPage from "@/pages/report-card";
import ManagerDashboard from "@/pages/manager-dashboard";
import RepDetailsPage from "@/pages/rep-details";
import AdminDashboard from "@/pages/admin-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/manager-dashboard" component={ManagerDashboard} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/manager/rep/:id" component={RepDetailsPage} />
      <Route path="/chat/:id" component={ChatPage} />
      <Route path="/chapter/:id" component={ChapterPage} />
      <Route path="/results/:id" component={ResultsPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/battlecards" component={BattlecardsPage} />
      <Route path="/report-card" component={ReportCardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
