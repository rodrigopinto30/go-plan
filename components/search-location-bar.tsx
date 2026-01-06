"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { query } from "@/convex/_generated/server";
import { City, State } from "country-state-city";
import { Calendar, Loader2, MapPin, Search } from "lucide-react";
import { Input } from "./ui/input";
import debounce from "lodash/debounce";
import { getCategoryIcon } from "@/lib/data";
import { format } from "date-fns";
import { Badge } from "./ui/badge";

const SearchLocationBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResult, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser
  );

  const { mutate: updateLocation } = useConvexMutation(
    api.users.completeOnboarding
  );

  const { data: searchResults, isLoading: searchLoading } = useConvexQuery(
    api.search.searchEvents,
    searchQuery.trim().length >= 2 ? { query: searchQuery, limit: 5 } : "skip"
  );

  const indianStates = State.getStatesOfCountry("IN");

  const cities = useMemo(() => {
    if (!selectedState) return [];
    const state = indianStates.find((s) => s.name === selectedState);

    if (!state) return [];
    return City.getCitiesOfState("IN", String(state));
  }, [selectedState, indianStates]);

  const debouncedSetQuery = useRef(
    debounce((value: any) => setSearchQuery(value), 300)
  ).current;

  const handleSearchInput = (e: any) => {
    const value = e.target.value;
    console.log(searchResults);
    debouncedSetQuery(value);
    setShowSearchResults(value.length >= 2);
  };

  const handleEventClick = (slug: string) => {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(`/events/${slug}`);
  };

  useEffect(() => {
    if (currentUser?.location) {
      setSelectedState(currentUser.location.state || "");
      setSelectedCity(currentUser.location.city || "");
    }
    console.log(searchResults);
  }, [currentUser, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div className="flex items-center">
      <div className="relative flex w-full" ref={searchRef}>
        <div className="flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            onFocus={() => {
              if (searchQuery.length >= 2) setShowSearchResults(true);
            }}
            onChange={handleSearchInput}
            className="pl-10 w-full h-9 rounded-none rounded-l-md"
          />
        </div>

        {showSearchResult && (
          <div className="absolute top-full mt-2 w-96 bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
            {searchLoading ? (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="py-2">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                  SEARCH RESULTS
                </p>
                {searchResults.map((event: any) => (
                  <button
                    key={event._id}
                    className="w-full px-4 py-3 hover:bg-muted/50 text-left transation-colors"
                    onClick={() => handleEventClick(event.slug)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-0.5">
                        {getCategoryIcon(event.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1 line-clamp-1">
                          {event.title}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(event.startDate, "MMM dd")}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.city}
                          </span>
                        </div>
                      </div>

                      {event.ticketType === "free" && (
                        <Badge variant="secondary" className="text-xs">
                          Free
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchLocationBar;
