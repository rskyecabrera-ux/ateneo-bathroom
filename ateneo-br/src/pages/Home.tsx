import { useGetStats, useGetTopBathrooms } from "@workspace/api-client-react";
import { BathroomCard } from "@/components/ui/BathroomCard";
import { LoadingState, ErrorState } from "@/components/ui/StatusStates";
import { Link } from "wouter";
import { ArrowRight, BarChart3, MessageSquare, Map, Flame, Award, Activity, Star, Droplets, Wind, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: stats, isLoading: isStatsLoading, error: statsError } = useGetStats();
  const { data: topBathrooms, isLoading: isTopLoading, error: topError } = useGetTopBathrooms({ limit: 3 });

  if (isStatsLoading || isTopLoading) return <LoadingState message="Fetching the latest scoops..." />;
  if (statsError || topError) return <ErrorState />;

  const activityCategories = [
    {
      label: "Peeing",
      href: "/best/peeing",
      value: stats?.avgPeeingRating,
      icon: Droplets,
      color: "blue",
      bg: "bg-blue-100 dark:bg-blue-900/40",
      text: "text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-400",
      bar: "bg-blue-400",
      desc: "Best spots for a quick, comfortable pee",
    },
    {
      label: "Pooping",
      href: "/best/pooping",
      value: stats?.avgPoopingRating,
      icon: Wind,
      color: "amber",
      bg: "bg-amber-100 dark:bg-amber-900/40",
      text: "text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-400",
      bar: "bg-amber-400",
      desc: "Top throne rooms for the important moments",
    },
    {
      label: "Making Out",
      href: "/best/making-out",
      value: stats?.avgMakingOutRating,
      icon: Heart,
      color: "pink",
      bg: "bg-pink-100 dark:bg-pink-900/40",
      text: "text-pink-600 dark:text-pink-400",
      border: "hover:border-pink-400",
      bar: "bg-pink-400",
      desc: "Most highly-rated spots for romance. No judgment.",
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-10">
      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground font-bold text-sm mb-6 border border-secondary/30">
          <Flame size={16} className="text-secondary-foreground" />
          The definitive guide to Ateneo bathrooms
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight text-foreground max-w-3xl mb-6">
          Find the <span className="text-primary relative inline-block">best <span className="absolute -bottom-2 left-0 w-full h-3 bg-secondary -z-10 rounded-sm skew-x-12"></span></span> places to go on campus.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10 font-medium">
          Because life's too short for bad toilet paper and broken locks. Rate, review, and discover the hidden gems of Ateneo.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/bathrooms"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
          >
            <Map size={20} />
            Browse Bathrooms
          </Link>
          <Link
            href="/submit"
            className="w-full sm:w-auto px-8 py-4 bg-card text-foreground border-2 border-border rounded-full font-bold text-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            Add a New One
          </Link>
        </div>
      </section>

      {/* Quick Stats Grid */}
      {stats && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border-2 border-border p-6 rounded-2xl flex items-center gap-5 shadow-sm transform transition-transform hover:-translate-y-1">
            <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 p-4 rounded-xl">
              <Map className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Bathrooms</div>
              <div className="font-display text-4xl font-black">{stats.totalBathrooms}</div>
            </div>
          </div>
          <div className="bg-card border-2 border-border p-6 rounded-2xl flex items-center gap-5 shadow-sm transform transition-transform hover:-translate-y-1">
            <div className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 p-4 rounded-xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Reviews</div>
              <div className="font-display text-4xl font-black">{stats.totalReviews}</div>
            </div>
          </div>
          <div className="bg-card border-2 border-border p-6 rounded-2xl flex items-center gap-5 shadow-sm transform transition-transform hover:-translate-y-1">
            <div className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 p-4 rounded-xl">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Campus Avg</div>
              <div className="font-display text-4xl font-black">{stats.avgRatingOverall?.toFixed(1) || "N/A"}</div>
            </div>
          </div>
        </section>
      )}

      {/* Activity Rankings */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-black">Best For...</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activityCategories.map((cat) => (
            <Link key={cat.href} href={cat.href} className="block group">
              <div className={cn(
                "bg-card border-2 border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition-all duration-200 group-hover:-translate-y-1",
                cat.border
              )}>
                <div className="flex items-start justify-between">
                  <div className={cn("p-3 rounded-xl", cat.bg)}>
                    <cat.icon className={cn("w-6 h-6", cat.text)} />
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
                </div>
                <div>
                  <div className="font-display font-black text-xl mb-1">{cat.label}</div>
                  <div className="text-sm text-muted-foreground">{cat.desc}</div>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Campus Avg</div>
                  <div className="font-display font-black text-2xl">
                    {cat.value != null ? (
                      <span className={cat.text}>{cat.value.toFixed(1)}<span className="text-sm text-muted-foreground font-normal">/5</span></span>
                    ) : (
                      <span className="text-muted-foreground text-base font-normal italic">No ratings yet</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Top Bathrooms */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-secondary text-secondary-foreground p-2 rounded-lg">
                <Award size={24} />
              </div>
              <h2 className="font-display text-3xl font-black">Hall of Fame</h2>
            </div>
            <Link href="/bathrooms" className="text-primary font-bold hover:underline flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topBathrooms?.length ? (
              topBathrooms.map((bathroom, index) => (
                <BathroomCard key={bathroom.id} bathroom={bathroom} rank={index + 1} />
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                No bathrooms rated yet. Be the first!
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Activity size={24} />
            </div>
            <h2 className="font-display text-3xl font-black">Recent Activity</h2>
          </div>

          <div className="bg-card border-2 border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
            {stats?.recentReviews?.length ? (
              <div className="divide-y divide-border/40">
                {stats.recentReviews.map((review) => (
                  <Link
                    key={review.id}
                    href={`/bathrooms/${review.bathroomId}`}
                    className="p-5 block hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-sm">
                        {review.reviewerName || "Anonymous"}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="text-sm font-medium mb-1">
                      <span className="text-primary">{review.building}</span> • {review.floor}
                    </div>
                    <div className="flex items-center gap-1 mb-3 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < review.rating ? "fill-current" : "text-muted-foreground/30"}
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground line-clamp-2 italic">
                        "{review.comment}"
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                It's quiet... too quiet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
