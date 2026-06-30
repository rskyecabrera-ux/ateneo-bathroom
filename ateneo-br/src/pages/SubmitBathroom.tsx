import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, Link } from "wouter";
import { useCreateBathroom } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListBathroomsQueryKey } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, PlusCircle, Building } from "lucide-react";
import { BathroomInputGender } from "@workspace/api-client-react";

const bathroomSchema = z.object({
  building: z.string().min(2, "Building name must be at least 2 characters").max(50),
  floor: z.string().min(1, "Floor is required").max(20),
  gender: z.enum(["male", "female", "unisex"] as const),
  description: z.string().max(200).optional(),
});

type BathroomFormValues = z.infer<typeof bathroomSchema>;

export default function SubmitBathroom() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createBathroom = useCreateBathroom();

  const form = useForm<BathroomFormValues>({
    resolver: zodResolver(bathroomSchema),
    defaultValues: {
      building: "",
      floor: "",
      gender: "unisex",
      description: "",
    },
  });

  const onSubmit = (data: BathroomFormValues) => {
    createBathroom.mutate(
      { data },
      {
        onSuccess: (newBathroom) => {
          toast({
            title: "Bathroom added!",
            description: "Thanks for expanding the map.",
          });
          queryClient.invalidateQueries({ queryKey: getListBathroomsQueryKey() });
          setLocation(`/bathrooms/${newBathroom.id}`);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add the bathroom. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const popularBuildings = [
    "SEC", "MVP", "Rizal Library", "CTC", "Somchai", "JSEC", "Xavier", "Matteo Ricci",
    "Fidelisan", "Bellarmine", "Gonzaga", "Kostka", "Arete", "PLDT CTC", "New Rizal Library"
  ];

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-2xl mx-auto w-full">
      <div className="flex flex-col gap-2 items-center text-center mt-4">
        <div className="bg-primary/10 text-primary p-4 rounded-full mb-2">
          <PlusCircle size={32} />
        </div>
        <h1 className="font-display text-4xl font-black">Add a Bathroom</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Discovered an unlisted restroom? Put it on the map so others can find it (or avoid it).
        </p>
      </div>

      <div className="bg-card border-2 border-border shadow-sm rounded-2xl p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="building"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold flex items-center gap-1"><Building size={14}/> Building</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. SEC, MVP, Rizal Library" className="bg-background" {...field} />
                    </FormControl>
                    <FormDescription>Common abbreviations are fine.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold flex items-center gap-1"><MapPin size={14}/> Floor</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ground Floor, 2F, Basement" className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unisex">Unisex / All-Gender</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Brief Description / Location Hint (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. Near the back exit, beside the vending machines" 
                      className="resize-none bg-background" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
              <Button type="submit" disabled={createBathroom.isPending} className="w-full sm:flex-1 h-12 font-bold text-lg">
                {createBathroom.isPending ? "Adding..." : "Add to Map"}
              </Button>
              <Button type="button" variant="outline" className="w-full sm:w-auto h-12" onClick={() => setLocation("/")}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4 text-blue-800 dark:text-blue-300 text-sm">
        <strong>Pro tip:</strong> Before adding a new bathroom, try searching the <Link href="/bathrooms" className="underline font-bold">Browse</Link> page to make sure it hasn't been added already.
      </div>
    </div>
  );
}
