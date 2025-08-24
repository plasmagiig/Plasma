import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Home, Plus, BarChart3, User, Users, TrendingUp, Bell, DollarSign, Settings, LogOut, Grid3X3, Wrench } from "lucide-react";
import UserAvatar from "@/components/user-avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import SmartNotifications from "@/components/smart-notifications";

interface NavigationProps {
  onCollaborationToggle?: () => void;
}

export default function Navigation({ onCollaborationToggle }: NavigationProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Bottom navigation items as shown in the image
  const bottomNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/giig", label: "Giig", icon: Grid3X3 },
    { path: "/create", label: "", icon: Plus, isCenter: true },
    { path: "/tools", label: "New tools", icon: Wrench },
    { path: "/tools", label: "New tools", icon: Wrench },
  ];


  return (
    <>
      {/* Bottom Navigation Bar Only */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-around py-2 px-4">
          {bottomNavItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = location === item.path;
            const isCenter = item.isCenter;
            
            return (
              <Link key={`${item.path}-${index}`} href={item.path}>
                <div className="flex flex-col items-center py-2" data-testid={`bottom-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {isCenter ? (
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-1">
                      <IconComponent className="h-6 w-6 text-white dark:text-black" />
                    </div>
                  ) : (
                    <IconComponent className={`h-6 w-6 mb-1 ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                  )}
                  {!isCenter && (
                    <span className={`text-xs ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Add bottom padding to main content to account for fixed bottom nav */}
      <div className="pb-20">
        {/* Smart Notifications Modal */}
        <SmartNotifications 
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
      </div>
    </>
  );
}
