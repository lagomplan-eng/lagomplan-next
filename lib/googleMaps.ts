"use client";

let googleMapsPromise: Promise<any> | null = null;

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export function loadGoogleMaps() {
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return;

    if (!GOOGLE_MAPS_API_KEY) {
      console.error("❌ Google Maps API key is missing");
      reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"));
      return;
    }

    const existing = document.querySelector("script[data-google-maps]");
    if (existing) {
      // Script tag already in DOM (e.g. after HMR module reset).
      // importLibrary("places") resolves instantly if already loaded,
      // or waits for the places chunk to finish if still in-flight.
      const g = (window as any).google;
      if (g?.maps?.importLibrary) {
        g.maps.importLibrary("places").then(() => resolve(g)).catch(reject);
      } else {
        resolve(g);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-maps", "true");

    script.onload = () => {
      const g = (window as any).google;
      // With v=weekly the bootstrap fires onload before library chunks finish
      // loading. importLibrary("places") waits until AutocompleteSuggestion
      // and the rest of the Places API New are available on the namespace.
      g.maps.importLibrary("places")
        .then(() => {
          console.log("✅ Google Maps + Places loaded");
          resolve(g);
        })
        .catch(reject);
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
