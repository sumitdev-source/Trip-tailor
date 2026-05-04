import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";

function PlaceCard({ place }) {
  const [photoUrl, setPhotoUrl] = useState();
  const imgSrc = photoUrl || "/placeholder.jpg";

  useEffect(() => {
    if (!place) return;

    const GetPlacePhoto = async () => {
      const data = {
        textQuery: place?.placeName,
      };

      try {
        const res = await GetPlaceDetails(data);
        console.log("FULL GOOGLE RESPONSE:", res.data);

        const photoRef =
          res.data?.places?.[0]?.photos?.[0]?.name || null;

        console.log("PHOTO REF:", photoRef);

        const PhotoUrl = PHOTO_REF_URL.replace(
          "{NAME}",
          res.data?.places?.[0]?.photos?.[0]?.name
        );
        setPhotoUrl(PhotoUrl);
        console.log("PHOTO URL:", PhotoUrl);
      } catch (e) {
        console.error(e);
      }
    };

    GetPlacePhoto();
  }, [place]);

  return (
    <div className="border rounded-xl p-3 mt-2 flex items-start gap-4">
      <Link
        to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${place?.placeName || ""} ${place?.placeDetails || ""}`
        )}`}
        target="_blank"
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: "#eee",
            cursor: "pointer",
          }}
        >
          <img
            src={imgSrc}
            alt={place?.placeName || "place image"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.jpg";
            }}
          />
        </div>
      </Link>

      <div className="flex flex-col gap-1 flex-1">
        <h4 className="font-semibold text-md">{place?.placeName}</h4>

        {place?.placeDetails && (
          <p className="text-sm text-gray-600">{place.placeDetails}</p>
        )}

        {place?.bestTimeToVisit && (
          <p className="text-xs text-gray-500">
            Best Time: {place.bestTimeToVisit}
          </p>
        )}

        {place?.ticketPricing && (
          <p className="text-xs text-gray-500">
            Ticket: {place.ticketPricing}
          </p>
        )}

        {place?.rating && (
          <p className="text-xs text-gray-500">
            Rating: {place.rating}
          </p>
        )}
      </div>
    </div>
  );
}

export default PlaceCard;

// This component is responsible for displaying a single place card UI
// It receives a 'place' object as input (props) which contains all place-related data


// STEP 1: Component Initialization
// When the component renders, it initializes a state variable to store the image URL
// Initially, this state is empty because no API call has been made yet


// STEP 2: Fallback Handling
// Before image is fetched, a default placeholder image is used
// This ensures UI does not break or show empty space


// STEP 3: Trigger Side Effect (useEffect)
// A side effect runs whenever the 'place' data changes
// This ensures that whenever a new place is passed, a new image is fetched


// STEP 4: Safety Check
// If 'place' is not available, the function exits early
// This prevents unnecessary API calls and avoids runtime errors


// STEP 5: Prepare API Request
// A request payload is created using place name
// This name is used to search for place details in external API (Google Places)


// STEP 6: API Call Execution
// An asynchronous request is made to fetch place details
// This includes metadata like photos, location info, etc.


// STEP 7: Handle API Response
// Once response is received:
// - Data is deeply nested, so optional chaining is used
// - First place result is accessed
// - From that, first photo reference is extracted


// STEP 8: Generate Image URL
// A predefined URL template is used
// The extracted photo reference is inserted into the template
// This creates a usable image URL


// STEP 9: Update State
// Generated image URL is stored in component state
// Updating state triggers re-render of component


// STEP 10: Re-render with Image
// Now the UI updates and displays the fetched image instead of placeholder


// STEP 11: Error Handling
// If API fails, error is caught and logged
// UI still remains stable because fallback image is used


// STEP 12: Image Load Failure Handling
// If image URL is invalid or fails to load:
// - An error handler replaces it with placeholder image
// - Prevents broken image UI


// STEP 13: Click Interaction
// The image is wrapped in a clickable link
// When user clicks:
// - It opens Google Maps in a new tab
// - Search query is dynamically created using place name + details


// STEP 14: Display Content
// Along with image, textual information is shown:
// - Place name (always shown)
// - Additional details (shown only if available)
// - Best time to visit (optional)
// - Ticket pricing (optional)
// - Rating (optional)


// STEP 15: Conditional Rendering
// Each optional field is displayed only if data exists
// This keeps UI clean and avoids showing empty values


// FINAL SUMMARY (Interview Ready)
// This component dynamically fetches and displays place images using an external API.
// It uses a side effect to trigger API calls based on prop changes,
// safely extracts nested data, updates state to re-render UI,
// and ensures robustness using fallback handling and error management.
// It also enhances user experience by providing navigation to Google Maps
// and conditionally rendering additional place information.