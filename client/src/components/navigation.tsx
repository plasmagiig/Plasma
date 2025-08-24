import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Plus, BarChart3, User, Users } from "lucide-react";

interface NavigationProps {
  onCollaborationToggle?: () => void;
}

export default function Navigation({ onCollaborationToggle }: NavigationProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Stream", icon: Home, color: "plasma-blue" },
    { path: "/create", label: "Create", icon: Plus, color: "plasma-purple" },
    { path: "/dashboard", label: "Earn", icon: BarChart3, color: "plasma-pink" },
  ];

  const NavContent = () => (
    <>
      {/* Orbital Menu */}
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location === item.path;
          const sizeClass = isActive ? "w-16 h-16" : "w-12 h-12";
          const borderClass = isActive ? `border-2 border-${item.color}/50` : `border border-${item.color}/30`;
          
          return (
            <div key={item.path} className="relative">
              <div className={`${sizeClass} rounded-full ${borderClass} ${isActive ? 'animate-orbit' : ''} flex items-center justify-center`}>
                <Link href={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${isActive ? 'w-8 h-8' : 'w-6 h-6'} bg-${item.color} hover:bg-${item.color}/80 rounded-full flex items-center justify-center hover:scale-110 transition-transform p-0`}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <IconComponent className={`${isActive ? 'h-4 w-4' : 'h-3 w-3'} text-white`} />
                  </Button>
                </Link>
              </div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">{item.label}</span>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-morphism">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3" data-testid="logo">
              <div className="w-10 h-10 plasma-gradient rounded-full flex items-center justify-center animate-plasma-pulse">
                <span className="text-white text-lg font-bold">⚛️</span>
              </div>
              <span className="text-2xl font-orbitron font-bold animate-glow">PLASMA</span>
            </div>
          </Link>
          
          <NavContent />
          
          {/* Profile, Collaboration and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Collaboration Button */}
            <Button
              variant="ghost" 
              size="sm"
              onClick={onCollaborationToggle}
              className="hidden md:flex items-center space-x-2 bg-plasma-purple/10 hover:bg-plasma-purple/20 border border-plasma-purple/30"
              data-testid="button-collaboration"
            >
              <Users className="h-4 w-4 text-plasma-purple" />
              <span className="text-plasma-purple">Collaborate</span>
            </Button>
            
            <Link href="/profile/alexchen">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-plasma-blue" data-testid="nav-profile">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop" 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </Link>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5 text-plasma-blue" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-morphism border-l border-plasma-blue/20">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location === item.path;
                    
                    return (
                      <Link key={item.path} href={item.path}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start gap-3 ${isActive ? `bg-${item.color} hover:bg-${item.color}/80` : `text-${item.color} hover:bg-${item.color}/10`}`}
                          onClick={() => setIsOpen(false)}
                          data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                        >
                          <IconComponent className="h-5 w-5" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
