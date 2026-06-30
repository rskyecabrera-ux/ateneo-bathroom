import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useListBathrooms } from "@workspace/api-client-react";
import { BathroomCard } from "@/components/ui/BathroomCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusStates";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, DropletOff } from "lucide-react";
import { ListBathroomsGender } from "@workspace/api-client-react";

export default function Browse() {
  const [search, setSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<ListBathroomsGender | "all">("all");

  const queryParams = useMemo(() => {
    const params: any = {};
    if (buildingFilter !== "all") params.building = buildingFilter;
    if (genderFilter !== "all") params.gender = genderFilter;
    return params;
  }, [buildingFilter, genderFilter]);

  const { data: bathrooms, isLoading, error } = useListBathrooms(queryParams);

  // Derive available buildings from all bathrooms for the filter dropdown
  // We make a separate un-filtered call or just let the API return all and do client-side filtering if it's small enough.
  // Given the API has a building param, let's use the API for primary filtering, but we need the list of buildings.
  // We'll just extract from whatever data we have for now, or use a hardcoded list of popular ones.
  const popularBuildings = [
    "Arete", "Bellarmine Hall", "Berchmans Hall", "CTC",
    "Faura Hall", "Gonzaga Hall", "Kostka Hall", "Leong Hall",
    "MVP", "Schmitt Hall", "SEC-A", "SEC-B", "SEC-C", "SOM",
  ];

  const filteredBathrooms = useMemo(() => {
    if (!bathrooms) return [];
    if (!search) return bathrooms;
    
    const lowerSearch = search.toLowerCase();
    return bathrooms.filter(b => 
      b.building.toLowerCase().includes(lowerSearch) || 
      b.floor.toLowerCase().includes(lowerSearch)
    );
  }, [bathrooms, search]);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-black">Browse Bathrooms</h1>
        <p className="text-muted-foreground text-lg">Find exactly what you're looking for.</p>
      </div>

      <div className="bg-card border-2 border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:flex-1 space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="search"
              placeholder="Search by building or floor..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>
        
        <div className="w-full md:w-48 space-y-2">
          <Label>Building</Label>
          <Select value={buildingFilter} onValueChange={setBuildingFilter}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Buildings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buildings</SelectItem>
              {popularBuildings.map(b => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-48 space-y-2">
          <Label>Gender</Label>
          <Select value={genderFilter} onValueChange={(v) => setGenderFilter(v as any)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          className="w-full md:w-auto h-10 border-2"
          onClick={() => {
            setSearch("");
            setBuildingFilter("all");
            setGenderFilter("all");
          }}
        >
          Reset
        </Button>
      </div>

      {isLoading ? (
        <LoadingState message="Searching the campus..." />
      ) : error ? (
        <ErrorState />
      ) : filteredBathrooms.length === 0 ? (
        <EmptyState 
          icon={DropletOff}
          title="No bathrooms found"
          description="We couldn't find any bathrooms matching your filters. Maybe add one?"
          action={
            <Button asChild className="mt-4 font-bold">
              <Link href="/submit">Add a Bathroom</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBathrooms.map((bathroom) => (
            <BathroomCard key={bathroom.id} bathroom={bathroom} />
          ))}
        </div>
      )}
    </div>
  );
}
