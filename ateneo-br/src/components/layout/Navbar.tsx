import { Link, useLocation } from "wouter";
import { Droplet, MapPin, PlusCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: MapPin },
    { href: "/bathrooms", label: "Browse", icon: Search },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:rotate-12 transition-transform duration-200">
            <Droplet size={20} className="fill-current" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Ateneo<span className="text-primary">BR</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1 mr-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                    isActive 
                      ? "bg-secondary text-secondary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          <Link 
            href="/submit" 
            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Add Bathroom</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </div>
      
      {/* Mobile nav bottom bar could go here, but let's just keep it simple with top nav */}
    </nav>
  );
}
