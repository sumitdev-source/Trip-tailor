import React, {useEffect, useState} from 'react'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';
import { doc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";

function UserTripCardItem({trip}) {

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
    <Link to={'/view-trip/'+trip?.id}>

    <div className='hover:scale-105 transition-all'>
      <img src= {photoUrl?photoUrl: '/placeholder.jpg'} className='w-full object-cover rounded-xl h-[220px]' />

      <div>
        <h2 className='font-bold text-lg'> {trip?.userSelection?.destination?.description}</h2>

        <h2 className='text-sm text-gray-500'>{trip?.userSelection?.noOfDays}Days Trip with {trip?.userSelection?.budget}</h2>
      </div>
    </div>

    </Link>
  )
}

export default UserTripCardItem