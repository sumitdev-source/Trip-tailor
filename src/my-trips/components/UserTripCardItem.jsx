// Import React and hooks (useEffect for lifecycle, useState for state)
import React, {useEffect, useState} from 'react'

// Import API functions to get place details and photo URL template
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

// Import Link for navigation (client-side routing)
import { Link } from 'react-router-dom';

// Firestore imports (NOT USED here → unnecessary import, should be removed)
import { doc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";

// Functional component receiving 'trip' as prop
function UserTripCardItem({trip}) {

   // State to store image URL
   const [photoUrl, setPhotoUrl] = useState();

   // Runs when component mounts OR when 'trip' changes
   useEffect(() => {

     // Safety check → if trip is undefined, stop execution
     if (!trip) return;

     // Async function to fetch place photo
     const GetPlacePhoto = async () => {

       // Prepare request payload
       const data = {
         // Extract destination description from trip object
         textQuery: trip?.userSelection?.destination?.description,
       };
   
       try {
        // Call API to get place details
        const res = await GetPlaceDetails(data);

        // Log full API response for debugging
        console.log("FULL GOOGLE RESPONSE:", res.data);
   
        // Extract photo reference (used by Google API internally)
        const photoRef =
          res.data?.places?.[0]?.photos?.[0]?.name || null;
   
        console.log("PHOTO REF:", photoRef);
   
        // Replace placeholder {NAME} in URL with actual photo reference
        const PhotoUrl = PHOTO_REF_URL.replace(
          '{NAME}',
          res.data?.places?.[0]?.photos?.[0]?.name
        );

        // Save URL in state → triggers re-render
        setPhotoUrl(PhotoUrl);

        console.log("PHOTO URL:", PhotoUrl);
   
       } catch (e) {
         // Error handling
         console.error(e);
       }
     };
   
     // Call function
     GetPlacePhoto();

   }, [trip]); // Dependency → runs whenever 'trip' changes

  return (

    // Clicking this card navigates to trip detail page
    <Link to={'/view-trip/' + trip?.id}>

      {/* Card container with hover animation */}
      <div className='hover:scale-105 transition-all'>

        {/* Show fetched image OR fallback placeholder */}
        <img 
          src={photoUrl ? photoUrl : '/placeholder.jpg'} 
          className='w-full object-cover rounded-xl h-[220px]' 
        />

        <div>

          {/* Show destination name */}
          <h2 className='font-bold text-lg'>
            {trip?.userSelection?.destination?.description}
          </h2>

          {/* Show trip details (days + budget) */}
          <h2 className='text-sm text-gray-500'>
            {trip?.userSelection?.noOfDays} Days Trip with {trip?.userSelection?.budget}
          </h2>

        </div>
      </div>

    </Link>
  )
}

// Export component
export default UserTripCardItem;