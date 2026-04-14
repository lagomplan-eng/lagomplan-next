"use client";

let googleMapsPromise: Promise<any> | null = null;

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export function loadGoogleMaps() {
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return;

    const existing = document.querySelector("script[data-google-maps]");
    if (existing) {
      resolve((window as any).google);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.error("❌ Google Maps API key is missing");
      reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-maps", "true");

    script.onload = () => {
      console.log("✅ Google Maps loaded");
      resolve((window as any).google);
    };

    script.onerror = () => {
      console.error("❌ Failed to load Google Maps");
      googleMapsPromise = null; // allow retry on next call
      reject(new Error("Google Maps script failed to load"));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
