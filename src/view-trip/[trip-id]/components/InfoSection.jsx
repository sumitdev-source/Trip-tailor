import { Button } from '@/components/ui/button'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState   } from 'react'
import { IoIosSend } from "react-icons/io";


function InfoSection({trip}) {

 const [photoUrl, setPhotoUrl]=useState();

  useEffect(() => {
  if (!trip) return;

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.destination?.description,
    };

    try {
     const res = await GetPlaceDetails(data);
    console.log("FULL GOOGLE RESPONSE:", res.data);

    const photoRef =
      res.data?.places?.[0]?.photos?.[0]?.name || null;

    console.log("PHOTO REF:", photoRef);

    const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',res.data?.places?.[0]?.photos?.[0]?.name);
    setPhotoUrl(PhotoUrl);
    console.log("PHOTO URL:", PhotoUrl);


    } catch (e) {
      console.error(e);
    }
  };

  GetPlacePhoto();
}, [trip]);

  return (
    <div>
     <img src={photoUrl} className='h-[340px] w-full object-cover rounded-xl' /> 
      
      <div className='flex justify-between items-center'>
      <div className='my-5 flex flex-col gap-2'>
        <h2 className='font-bold text-2xl'>{trip?.userSelection?.destination?.description}</h2>
          <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>📅{trip?.userSelection?.noOfDays} Day</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💰{trip?.userSelection?.budget} Budget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🥂No. Of Traveler {trip?.userSelection?.traveler} </h2>
          </div>
      </div>
      <Button><IoIosSend /></Button>
      </div>

    </div>
  )
}

export default InfoSection

// ======================= COMPONENT FLOW =======================

// 1. Component receives 'trip' data as input (props)
//    → Contains destination, number of days, budget, and travelers

// 2. A state variable is initialized to store the image URL
//    → Initially empty (no image available)

// 3. When the component loads OR when 'trip' data changes,
//    a side-effect (useEffect) is triggered

// 4. First check:
//    → If 'trip' is missing or undefined, stop execution immediately
//    → Prevents unnecessary API calls or errors

// 5. Prepare request data using destination name from 'trip'
//    → This will be used to query the external API

// 6. Make an asynchronous API call to fetch place details
//    → API returns data about the location (including photos)

// 7. From the API response:
//    → Access the first place result
//    → From that, access the first photo
//    → Extract its reference (identifier)

// 8. Convert photo reference into a usable image URL
//    → Replace placeholder in base URL with actual photo reference

// 9. Store the generated image URL in state
//    → This triggers a re-render of the component

// 10. If API fails or data is missing:
//     → Catch the error and log it
//     → No crash, but image may not appear

// ======================= RENDER FLOW =======================

// 11. Component renders UI

// 12. Image section:
//     → Uses the stored image URL from state
//     → Initially empty → updates after API response

// 13. Text section:
//     → Displays destination name from 'trip'

// 14. Info tags:
//     → Show number of days
//     → Show budget
//     → Show number of travelers

// 15. Action button:
//     → Displays send icon (UI purpose, no logic here)

// ======================= COMPLETE FLOW SUMMARY =======================

// Input:
// → 'trip' data passed from parent component

// Trigger:
// → useEffect runs when 'trip' changes

// Processing:
// → Prepare request → Call API → Extract photo → Generate URL

// State Update:
// → Save URL → triggers re-render

// Output:
// → Updated UI showing image + trip details

// ======================= KEY UNDERSTANDING =======================

// This component is:
// → Data-driven (depends on 'trip')
// → Side-effect based (API call using useEffect)
// → State-controlled rendering (image updates after fetch)

// If you understand:
// → when useEffect runs
// → how API data is transformed
// → how state triggers re-render
// then you actually understand this component.