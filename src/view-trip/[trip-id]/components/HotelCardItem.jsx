// Import React core + hooks
import React, { useEffect, useState } from 'react';

// Import Link component to navigate (opens Google Maps here)
import { Link } from 'react-router-dom';

// Import API function + URL template
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

// Functional component receiving "hotel" as prop
function HotelCardItem({ hotel }) {

  // State to store image URL (initially undefined)
  const [photoUrl, setPhotoUrl] = useState();

  // Runs when component mounts OR when "hotel" changes
  useEffect(() => {

    // If hotel data is missing → stop execution
    if (!hotel) return;

    // Async function to fetch photo from Google Places API
    const GetPlacePhoto = async () => {

      // Prepare request payload
      const data = {
        textQuery: hotel?.hotelName, // search using hotel name
      };

      try {
        // Call API to get place details
        const res = await GetPlaceDetails(data);

        // Log full response (for debugging)
        console.log("FULL GOOGLE RESPONSE:", res.data);

        // Extract photo reference safely using optional chaining
        const photoRef =
          res.data?.places?.[0]?.photos?.[0]?.name || null;

        console.log("PHOTO REF:", photoRef);

        // Replace placeholder {NAME} in URL with actual photo reference
        const PhotoUrl = PHOTO_REF_URL.replace(
          '{NAME}',
          res.data?.places?.[0]?.photos?.[0]?.name
        );

        // Store the final image URL in state
        setPhotoUrl(PhotoUrl);

        console.log("PHOTO URL:", PhotoUrl);

      } catch (e) {
        // Handle API errors
        console.error(e);
      }
    };

    // Call the function
    GetPlacePhoto();

  }, [hotel]); // Dependency → runs whenever hotel changes


  // JSX (UI rendering)
  return (

    // Clickable card → opens Google Maps search in new tab
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${hotel?.hotelName} ${hotel?.address}` // combine name + address
      )}`}
      target="_blank"
    >

      {/* Card container with hover effect */}
      <div className="hover:scale-105 transition-all cursor-pointer">

        {/* Hotel image */}
        <img src={photoUrl} className="rounded-lg" />

        {/* Hotel info */}
        <div className="my-2 flex flex-col gap-2">

          {/* Hotel name */}
          <h2 className="font-medium">{hotel?.hotelName}</h2>

          {/* Address */}
          <h2 className="text-xs text-gray-500">📍{hotel?.address}</h2>

          {/* Price */}
          <h2 className="text-sm">💰{hotel?.price}</h2>

          {/* Rating */}
          <h2 className="text-sm">⭐{hotel?.rating}</h2>

        </div>
      </div>
    </Link>
  );
}

// Export component so it can be used elsewhere
export default HotelCardItem;


/*
1. Component receives hotel data (name, address, price, rating).

2. When component loads OR hotel changes:
   → useEffect triggers.

3. It calls Google Places API using hotel name.

4. From API response:
   → Picks first place result
   → Extracts first photo reference

5. Builds image URL using PHOTO_REF_URL template.

6. Stores image URL in state (photoUrl).

7. React re-renders:
   → Image now shows on UI.

8. UI shows:
   → Image
   → Name
   → Address
   → Price
   → Rating

9. Clicking card:
   → Opens Google Maps search with hotel name + address.

--------------------------------------------------

⚠️ Important flaws (you should NOT ignore):

- You are NOT checking if photo exists properly → may break.
- You declared photoRef but didn’t actually use it (bad practice).
- No fallback image → blank UI if API fails.
- API runs every time hotel changes → could be inefficient.

--------------------------------------------------

💡 In simple words:
This component = "Fetch hotel image from Google → show card → click opens map"
*/