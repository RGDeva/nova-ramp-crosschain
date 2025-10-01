import { Link, useLocation } from "react-router-dom";
import { Wallet, ShoppingBag, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import novaLogo from "@/assets/nova-logo.svg";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/onramp", label: "Buy", icon: Wallet },
    { path: "/offramp", label: "Sell", icon: Wallet },
    { path: "/orders", label: "My Orders", icon: ShoppingBag },
    { path: "/verify", label: "Verify", icon: Shield },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-nova">
              <img src={novaLogo} alt="Nova Ramp" className="h-8 w-8" />
              <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
                Nova Ramp
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Button
                  key={path}
                  variant={isActive(path) ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="transition-all duration-nova"
                >
                  <Link to={path} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                </Button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <nav className="flex">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              variant={isActive(path) ? "default" : "ghost"}
              size="sm"
              asChild
              className="flex-1 h-16 rounded-none flex-col gap-1"
            >
              <Link to={path}>
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="md:hidden h-16" />
    </div>
  );
};

export default Layout;