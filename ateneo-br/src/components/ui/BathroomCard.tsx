import { Link } from "wouter";
import { MapPin, Users, Activity, Star } from "lucide-react";
import { Bathroom } from "@workspace/api-client-react";
import { RatingStars } from "./RatingStars";
import { cn } from "@/lib/utils";

interface BathroomCardProps {
  bathroom: Bathroom;
  rank?: number;
}

export function BathroomCard({ bathroom, rank }: BathroomCardProps) {
  const genderColors = {
    male: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200",
    female: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200",
    unisex: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200",
  };

  const genderLabels = {
    male: "Male",
    female: "Female",
    unisex: "Unisex",
  };

  return (
    <Link 
      href={`/bathrooms/${bathroom.id}`}
      className="group relative flex flex-col bg-card hover:bg-muted/50 transition-colors border-2 border-border/60 hover:border-primary/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 duration-200"
      data-testid={`card-bathroom-${bathroom.id}`}
    >
      {rank !== undefined && (
        <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground font-display font-black text-xl w-10 h-10 flex items-center justify-center rounded-bl-xl border-l-2 border-b-2 border-border/60 z-10">
          #{rank}
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3 pr-8">
          <div>
            <h3 className="font-display font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {bathroom.building}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm font-medium mt-1">
              <MapPin size={14} className="mr-1 inline" />
              {bathroom.floor}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border", genderColors[bathroom.gender])}>
            {genderLabels[bathroom.gender]}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border bg-muted text-muted-foreground border-border">
            {bathroom.reviewCount} {bathroom.reviewCount === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Overall Rating
            </span>
            {bathroom.avgRating ? (
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg leading-none">{bathroom.avgRating.toFixed(1)}</span>
                <RatingStars rating={bathroom.avgRating} size="sm" />
              </div>
            ) : (
              <span className="text-sm font-medium text-muted-foreground italic">No ratings yet</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
