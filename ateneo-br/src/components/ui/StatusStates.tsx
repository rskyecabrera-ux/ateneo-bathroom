import { AlertCircle, Loader2 } from "lucide-react";
import { ReactNode } from "react";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 w-full h-full min-h-[40vh] text-muted-foreground animate-in fade-in duration-500">
      <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
      <p className="font-display font-bold text-lg">{message}</p>
    </div>
  );
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "We couldn't load the data. Please try again.", 
  action
}: { 
  title?: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 w-full h-full min-h-[40vh] text-center bg-destructive/5 rounded-xl border border-destructive/20">
      <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-4">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h3 className="font-display font-bold text-xl text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {action}
    </div>
  );
}

export function EmptyState({ 
  icon: Icon,
  title,
  description,
  action
}: { 
  icon: any;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 w-full h-full min-h-[40vh] text-center border-2 border-dashed border-border rounded-xl bg-card/50">
      <div className="bg-muted text-muted-foreground p-4 rounded-full mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="font-display font-bold text-xl text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
}
