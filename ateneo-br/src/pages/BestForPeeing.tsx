import { useGetTopBathrooms } from "@workspace/api-client-react";
import { BathroomCard } from "@/components/ui/BathroomCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusStates";
import { Link } from "wouter";
import { ArrowLeft, Droplets } from "lucide-react";

export default function BestForPeeing() {
  const { data: bathrooms, isLoading, error } = useGetTopBathrooms(
    { limit: 10, by: "peeing" },
    { query: { queryKey: ["top-bathrooms-peeing"] } }
  );

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-4xl mx-auto w-full">
      <div>
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Home
        </Link>
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 p-3 rounded-xl">
            <Droplets size={28} />
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-black">Best for Peeing</h1>
            <p className="text-muted-foreground text-lg mt-1">Top-ranked bathrooms for a quick, comfortable pee.</p>
          </div>
        </div>
        <div className="h-1.5 w-24 bg-blue-400 rounded-full mt-2" />
      </div>

      {isLoading && <LoadingState message="Ranking the best spots..." />}
      {error && <ErrorState title="Could not load rankings" message="Try again in a moment." />}
      {!isLoading && !error && (!bathrooms || bathrooms.length === 0) && (
        <EmptyState
          icon={Droplets}
          title="No peeing ratings yet"
          description="Be the first to rate a bathroom for peeing. Go to any bathroom and submit a review!"
          action={<Link href="/bathrooms" className="text-primary font-bold hover:underline">Browse bathrooms</Link>}
        />
      )}

      {bathrooms && bathrooms.length > 0 && (
        <div className="flex flex-col gap-4">
          {bathrooms.map((bathroom, index) => (
            <Link key={bathroom.id} href={`/bathrooms/${bathroom.id}`} className="block group">
              <div className="bg-card border-2 border-border rounded-xl p-5 flex items-center gap-5 hover:border-blue-400 transition-colors shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center font-display font-black text-xl">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-black text-xl">{bathroom.building}</span>
                    <span className="text-muted-foreground font-medium">{bathroom.floor}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      bathroom.gender === "male" ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                      : bathroom.gender === "female" ? "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400"
                      : "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400"
                    }`}>{bathroom.gender}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{bathroom.reviewCount} {bathroom.reviewCount === 1 ? "review" : "reviews"}</span>
                    {bathroom.avgRating && <span>Overall {bathroom.avgRating.toFixed(1)}</span>}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Peeing Rating</div>
                  <div className="font-display font-black text-3xl text-blue-500">
                    {bathroom.avgPeeingRating?.toFixed(1) ?? "—"}
                    <span className="text-base text-muted-foreground font-normal">/5</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center pt-4">
        <Link href="/bathrooms" className="text-primary font-bold hover:underline text-sm">
          Browse all bathrooms to leave a rating
        </Link>
      </div>
    </div>
  );
}
