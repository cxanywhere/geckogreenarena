import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/home";
import LoginPage from "@/pages/login";
import OnboardingPage from "@/pages/onboarding";
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
import SlidesPreviewPage from "@/pages/slides-preview";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/onboarding">
        <ProtectedRoute allowedRoles={["rep", "manager", "admin", "director"]}>
          <OnboardingPage />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute allowedRoles={["rep"]}>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/manager-dashboard">
        <ProtectedRoute allowedRoles={["manager"]}>
          <ManagerDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard">
        <ProtectedRoute allowedRoles={["admin", "director"]}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/manager/rep/:id">
        <ProtectedRoute allowedRoles={["manager"]}>
          <RepDetailsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/rep/:id">
        <ProtectedRoute allowedRoles={["admin", "director"]}>
          <RepDetailsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/chat/:id">
        <ProtectedRoute allowedRoles={["rep"]}>
          <ChatPage />
        </ProtectedRoute>
      </Route>
      <Route path="/chapter/:id">
        <ProtectedRoute allowedRoles={["rep"]}>
          <ChapterPage />
        </ProtectedRoute>
      </Route>
      <Route path="/results/:id">
        <ProtectedRoute allowedRoles={["rep"]}>
          <ResultsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/leaderboard">
        <ProtectedRoute allowedRoles={["rep"]}>
          <LeaderboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/resources">
        <ProtectedRoute allowedRoles={["rep"]}>
          <ResourcesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/battlecards">
        <ProtectedRoute allowedRoles={["rep"]}>
          <BattlecardsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/report-card">
        <ProtectedRoute allowedRoles={["rep"]}>
          <ReportCardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/slides-preview" component={SlidesPreviewPage} />
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
