import { Star, Droplets, Wind, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingStars({ rating, max = 5, size = "md", className }: RatingStarsProps) {
  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const currentSize = iconSizes[size];

  return (
    <div className={cn("flex items-center gap-0.5", className)} data-testid={`rating-stars-${rating}`}>
      {Array.from({ length: max }).map((_, i) => {
        const isFilled = i < Math.floor(rating);
        const isHalf = i === Math.floor(rating) && rating % 1 >= 0.5;
        
        return (
          <div key={i} className="relative">
            <Star
              size={currentSize}
              className={cn("text-muted-foreground/30", {
                "text-yellow-400 fill-yellow-400": isFilled,
              })}
            />
            {isHalf && (
              <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                <Star size={currentSize} className="text-yellow-400 fill-yellow-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function MetricPill({ 
  icon: Icon, 
  label, 
  value, 
  percentage = false,
  highIsGood = true
}: { 
  icon: any, 
  label: string, 
  value: number | null, 
  percentage?: boolean,
  highIsGood?: boolean
}) {
  if (value === null) return null;
  
  const displayValue = percentage ? `${Math.round(value)}%` : value.toFixed(1);
  
  // Basic color coding
  let colorClass = "bg-muted text-foreground";
  if (percentage) {
    if (value >= 80) colorClass = highIsGood ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    else if (value <= 30) colorClass = highIsGood ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    else colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  } else {
    if (value >= 4.0) colorClass = highIsGood ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    else if (value <= 2.5) colorClass = highIsGood ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    else colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  }

  return (
    <div className="flex flex-col gap-1 items-center" data-testid={`metric-${label}`}>
      <div className={cn("flex items-center justify-center w-8 h-8 rounded-full", colorClass)}>
        <Icon size={16} />
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{displayValue}</div>
      </div>
    </div>
  );
}
