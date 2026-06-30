import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-secondary selection:text-secondary-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 gap-8">
        {children}
      </main>
      <footer className="border-t border-border/40 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm font-medium">
            Made by students, for students. Not affiliated with Ateneo de Manila University.
          </p>
        </div>
      </footer>
    </div>
  );
}
