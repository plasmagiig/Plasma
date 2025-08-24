import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import CollaborationPanel from "@/components/collaboration-panel";
import Home from "@/pages/home";
import Create from "@/pages/create";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={Create} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile/:username" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-plasma-dark text-white">
          <Navigation onCollaborationToggle={() => setIsCollaborationOpen(!isCollaborationOpen)} />
          <Router />
          <CollaborationPanel 
            isOpen={isCollaborationOpen} 
            onToggle={() => setIsCollaborationOpen(!isCollaborationOpen)} 
          />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
