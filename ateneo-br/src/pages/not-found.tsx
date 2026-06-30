import { Map, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center min-h-[60vh]">
      <div className="bg-destructive/10 text-destructive p-6 rounded-full mb-6">
        <AlertCircle size={48} />
      </div>
      <h1 className="font-display text-5xl font-black mb-4">404: Bathroom Not Found</h1>
      <p className="text-xl text-muted-foreground max-w-md mb-10">
        Looks like you took a wrong turn at MVP. The bathroom you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="font-bold">
          <Link href="/">
            <ArrowLeft className="mr-2" size={20} />
            Back to Campus
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-bold border-2">
          <Link href="/bathrooms">
            <Map className="mr-2" size={20} />
            Browse Bathrooms
          </Link>
        </Button>
      </div>
    </div>
  );
}
