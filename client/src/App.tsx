import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/navigation";
import CollaborationPanel from "@/components/collaboration-panel";
import Home from "@/pages/home";
import Create from "@/pages/create";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import ProfileSettings from "@/pages/profile-settings";
import Settings from "@/pages/settings";
import Trending from "@/pages/trending";
import MonetizationHub from "@/pages/monetization-hub";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={Create} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/trending" component={Trending} />
      <Route path="/monetization" component={MonetizationHub} />
      <Route path="/profile/:username" component={Profile} />
      <Route path="/profile/settings" component={ProfileSettings} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-plasma-dark dark:bg-plasma-dark bg-white text-white dark:text-white text-black transition-colors">
            <Navigation onCollaborationToggle={() => setIsCollaborationOpen(!isCollaborationOpen)} />
            <Router />
            <CollaborationPanel 
              isOpen={isCollaborationOpen} 
              onToggle={() => setIsCollaborationOpen(!isCollaborationOpen)} 
            />
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
