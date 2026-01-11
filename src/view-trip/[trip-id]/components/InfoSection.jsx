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