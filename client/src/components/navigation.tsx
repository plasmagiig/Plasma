import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Home, Plus, BarChart3, User, Users, TrendingUp, Bell, DollarSign, Settings, LogOut, Grid3X3, Wrench, Search } from "lucide-react";
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

  // Bottom navigation items with attractive options
  const bottomNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/giig", label: "Giig", icon: Grid3X3 },
    { path: "/create", label: "", icon: Plus, isCenter: true },
    { path: "/discover", label: "Discover", icon: TrendingUp },
    { path: "/tools", label: "Studio", icon: Wrench },
  ];


  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/">
              <div className="flex items-center space-x-2" data-testid="nav-logo">
                <div className="w-8 h-8 bg-gradient-to-r from-plasma-blue to-plasma-purple rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-orbitron font-bold text-xl bg-gradient-to-r from-plasma-blue to-plasma-purple bg-clip-text text-transparent">
                  PLASMA
                </span>
              </div>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotificationsOpen(true)}
                className="relative"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5 text-yellow-500" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-plasma-pink text-white text-xs">
                  3
                </Badge>
              </Button>

              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                data-testid="button-search"
              >
                <span className="text-lg">🔍</span>
              </Button>

              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative" data-testid="button-profile-menu">
                    <UserAvatar user={{ name: "User", avatar: null }} size="sm" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link href="/profile/settings">
                    <DropdownMenuItem data-testid="menu-profile-settings">
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard">
                    <DropdownMenuItem data-testid="menu-dashboard">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/monetization">
                    <DropdownMenuItem data-testid="menu-earnings">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Earnings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link href="/settings">
                    <DropdownMenuItem data-testid="menu-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" data-testid="menu-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Bar */}
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
