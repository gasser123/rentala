"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/state/redux";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setFilters } from "@/state";
const HeroSection = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const handleLocationSearch = async () => {
    try {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmedQuery)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&fuzzyMatch=true`,
      );
      const data = await response.json();
      if (data.features && data.features.length) {
        const [lng, lat] = data.features[0].center;
        dispatch(
          setFilters({
            location: trimmedQuery,
            coordinates: [lng, lat],
          }),
        );
        const params = new URLSearchParams({
          location: trimmedQuery,
          lng: lng.toString(),
          lat: lat.toString(),
        });
        router.push(`/search?${params.toString()}`);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };
  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Rentala Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/60">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center width-full"
        >
          <div className="max-w-4xl mx-auto px-16 sm:px-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Explore Our Finest Apartments and Houses
            </h1>
            <p className="text-xl text-white mb-8 font-serif">
              Explore a curated selection of premium apartments and houses
              tailored to your lifestyle. Find your perfect home with us today!
            </p>
            <div className="flex justify-center">
              <Input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
                placeholder="search by city, neighbourhood or address"
                className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12 "
              />
              <Button
                className="bg-red-800 text-white rounded-none rounded-r-xl border-none hover:bg-red-600 h-12 cursor-pointer"
                onClick={handleLocationSearch}
              >
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
