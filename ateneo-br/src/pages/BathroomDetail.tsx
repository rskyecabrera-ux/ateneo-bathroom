import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { 
  useGetBathroom, 
  useGetBathroomReviews, 
  useCreateReview,
  getGetBathroomQueryKey,
  getGetBathroomReviewsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";

import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusStates";
import { RatingStars, MetricPill } from "@/components/ui/RatingStars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Droplet, Wind, Sparkles, User, MapPin, CheckCircle2, XCircle, ArrowLeft, Star, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5),
  smell: z.number().min(1).max(5),
  hasPaper: z.boolean().default(false),
  hasSoap: z.boolean().default(false),
  peeingRating: z.number().min(1).max(5).optional(),
  poopingRating: z.number().min(1).max(5).optional(),
  makingOutRating: z.number().min(1).max(5).optional(),
  comment: z.string().max(500).optional(),
  reviewerName: z.string().max(50).optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function BathroomDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { 
    data: bathroom, 
    isLoading: isBathroomLoading, 
    error: bathroomError 
  } = useGetBathroom(id, { query: { enabled: !!id, queryKey: getGetBathroomQueryKey(id) } });

  const {
    data: reviews,
    isLoading: isReviewsLoading,
  } = useGetBathroomReviews(id, { query: { enabled: !!id, queryKey: getGetBathroomReviewsQueryKey(id) } });

  const createReview = useCreateReview();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 3,
      cleanliness: 3,
      smell: 3,
      hasPaper: false,
      hasSoap: false,
      peeingRating: undefined,
      poopingRating: undefined,
      makingOutRating: undefined,
      comment: "",
      reviewerName: "",
    },
  });

  if (isBathroomLoading) return <LoadingState message="Loading bathroom details..." />;
  if (bathroomError || !bathroom) return <ErrorState title="Bathroom Not Found" message="We couldn't find this bathroom. It might have been removed." action={<Button onClick={() => setLocation("/bathrooms")}>Back to Browse</Button>} />;

  const genderColors = {
    male: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200",
    female: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200",
    unisex: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200",
  };

  const onSubmit = (data: ReviewFormValues) => {
    createReview.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast({
            title: "Review submitted!",
            description: "Thanks for contributing to AteneoBR.",
          });
          queryClient.invalidateQueries({ queryKey: getGetBathroomQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getGetBathroomReviewsQueryKey(id) });
          setShowReviewForm(false);
          form.reset();
        },
        onError: () => {
          toast({
            title: "Failed to submit review",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
      }
    );
  };

  // Helper for optional star rating inputs (can be left unset)
  const renderOptionalStarInput = (field: any, label: string) => (
    <FormItem className="space-y-1">
      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</FormLabel>
      <FormControl>
        <div className="flex gap-1 items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => field.onChange(field.value === star ? undefined : star)}
              className={cn(
                "p-1 rounded-sm transition-colors",
                field.value != null && star <= field.value ? "text-yellow-500" : "text-muted-foreground/30 hover:text-yellow-500/50"
              )}
            >
              <Star size={22} className={field.value != null && star <= field.value ? "fill-current" : ""} />
            </button>
          ))}
          {field.value != null && (
            <button type="button" onClick={() => field.onChange(undefined)} className="ml-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
              clear
            </button>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  // Helper to render star rating inputs
  const renderStarInput = (field: any, label: string) => (
    <FormItem className="space-y-1">
      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</FormLabel>
      <FormControl>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => field.onChange(star)}
              className={cn(
                "p-1 rounded-sm transition-colors",
                star <= field.value ? "text-yellow-500" : "text-muted-foreground/30 hover:text-yellow-500/50"
              )}
            >
              <Star size={24} className={star <= field.value ? "fill-current" : ""} />
            </button>
          ))}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-4xl mx-auto w-full">
      {/* Header / Breadcrumb */}
      <div>
        <Link href="/bathrooms" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to all bathrooms
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border", genderColors[bathroom.gender])}>
                {bathroom.gender}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border bg-muted text-muted-foreground border-border">
                {bathroom.reviewCount} {bathroom.reviewCount === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black">{bathroom.building}</h1>
            <div className="flex items-center text-muted-foreground font-medium mt-2 text-lg">
              <MapPin size={18} className="mr-1.5 inline text-primary" />
              {bathroom.floor}
            </div>
          </div>
          
          <div className="bg-card border-2 border-border rounded-xl p-4 flex items-center gap-4 shadow-sm min-w-[200px]">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Overall</span>
              {bathroom.avgRating ? (
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-3xl leading-none">{bathroom.avgRating.toFixed(1)}</span>
                  <div className="text-yellow-500">
                    <RatingStars rating={bathroom.avgRating} size="md" />
                  </div>
                </div>
              ) : (
                <span className="text-lg font-medium text-muted-foreground italic">No ratings</span>
              )}
            </div>
          </div>
        </div>
        
        {bathroom.description && (
          <p className="mt-6 text-lg bg-muted/50 p-4 rounded-xl border border-border/50 italic text-muted-foreground border-l-4 border-l-primary">
            "{bathroom.description}"
          </p>
        )}
      </div>

      {/* Stats Grid */}
      {bathroom.reviewCount > 0 && (
        <section className="bg-card border-2 border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold mb-6">Detailed Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <MetricPill icon={Sparkles} label="Cleanliness" value={bathroom.avgCleanliness} />
            <MetricPill icon={Wind} label="Smell" value={bathroom.avgSmell} />
            <MetricPill icon={FileText} label="Has Paper" value={bathroom.hasPaperPercent} percentage />
            <MetricPill icon={Droplet} label="Has Soap" value={bathroom.hasSoapPercent} percentage />
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-black">Reviews</h2>
          {!showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)} className="font-bold">
              Write a Review
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-card border-2 border-primary/50 shadow-md rounded-2xl p-6 relative overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <h3 className="font-display text-xl font-bold mb-6">Rate this bathroom</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={form.control} name="rating" render={({ field }) => renderStarInput(field, "Overall Rating")} />
                  <FormField control={form.control} name="cleanliness" render={({ field }) => renderStarInput(field, "Cleanliness")} />
                  <FormField control={form.control} name="smell" render={({ field }) => renderStarInput(field, "Smell")} />
                </div>

                <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Optional Ratings</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="peeingRating" render={({ field }) => renderOptionalStarInput(field, "For Peeing")} />
                    <FormField control={form.control} name="poopingRating" render={({ field }) => renderOptionalStarInput(field, "For Pooping")} />
                    <FormField control={form.control} name="makingOutRating" render={({ field }) => renderOptionalStarInput(field, "For Making Out")} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 p-4 bg-muted/30 rounded-xl border border-border">
                  <FormField
                    control={form.control}
                    name="hasPaper"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg gap-4 flex-1">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-bold">Toilet Paper</FormLabel>
                          <FormDescription>Was there toilet paper available?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="hidden sm:block w-px bg-border"></div>
                  <FormField
                    control={form.control}
                    name="hasSoap"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg gap-4 flex-1">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-bold">Hand Soap</FormLabel>
                          <FormDescription>Was there soap in the dispensers?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="font-bold">Comment (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any specific thoughts? Broken lock? Smells like victory?" 
                            className="resize-none h-24 bg-background" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reviewerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Your Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Anonymous Atenean" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createReview.isPending} className="min-w-[120px]">
                    {createReview.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Reviews List */}
        {isReviewsLoading ? (
          <div className="flex justify-center p-8"><span className="text-muted-foreground">Loading reviews...</span></div>
        ) : !reviews || reviews.length === 0 ? (
          <EmptyState 
            icon={User} 
            title="No reviews yet" 
            description="Be the first to share your thoughts on this bathroom." 
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card border border-border p-5 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{review.reviewerName || "Anonymous Atenean"}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-500">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="text-xs font-bold text-foreground ml-1">{review.rating}/5</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs font-medium">
                      <Sparkles size={12} className="text-muted-foreground" /> {review.cleanliness}/5
                    </div>
                    <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs font-medium">
                      <Wind size={12} className="text-muted-foreground" /> {review.smell}/5
                    </div>
                    <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border", review.hasPaper ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400")}>
                      {review.hasPaper ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Paper
                    </div>
                    <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border", review.hasSoap ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400")}>
                      {review.hasSoap ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Soap
                    </div>
                    {review.peeingRating != null && (
                      <div className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 px-2 py-1 rounded-md text-xs font-medium">
                        Peeing {review.peeingRating}/5
                      </div>
                    )}
                    {review.poopingRating != null && (
                      <div className="flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 px-2 py-1 rounded-md text-xs font-medium">
                        Pooping {review.poopingRating}/5
                      </div>
                    )}
                    {review.makingOutRating != null && (
                      <div className="flex items-center gap-1 bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400 border border-pink-200 px-2 py-1 rounded-md text-xs font-medium">
                        Making Out {review.makingOutRating}/5
                      </div>
                    )}
                  </div>
                </div>
                
                {review.comment && (
                  <div className="mt-3 text-foreground pt-3 border-t border-border/40">
                    <p className="whitespace-pre-wrap">{review.comment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
