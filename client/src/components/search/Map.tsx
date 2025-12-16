"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/properties-api";
import { Property } from "@/types/prismaTypes";
import { Loader } from "@aws-amplify/ui-react";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const Map = () => {
  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);
  useEffect(() => {
    if (isLoading || isError || !properties) {
      return;
    }
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/gasser19/cmj8f6spq000g01sa7dqybfsc",
      center: filters.coordinates || [-74.5, 40],
      zoom: 9,
    });

    for (const property of properties) {
      const marker = createPropertyMarker(property, map);
      const markerElement = marker.getElement();
      const path = markerElement.querySelector("path[fill='#3FB1CE']");
      if (path) path.setAttribute("fill", "#000000");
    }
    const resizeMap = () => setTimeout(() => map.resize(), 700);
    const timeOutId = resizeMap();
    return () => {
      map.remove();
      clearTimeout(timeOutId);
    };
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader className="w-10! h-10!" />
      </div>
    );
  }

  if (isError) {
    return <div>Failed to fetch properties</div>;
  }
  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
      )
    )
    .addTo(map);
  return marker;
};
export default Map;
