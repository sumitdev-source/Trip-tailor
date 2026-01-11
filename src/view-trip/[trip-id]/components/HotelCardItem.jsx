import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (!hotel) return;

    const GetPlacePhoto = async () => {
      const data = {
        textQuery: hotel?.hotelName,
      };

      try {
        const res = await GetPlaceDetails(data);
        console.log("FULL GOOGLE RESPONSE:", res.data);

        const photoRef =
          res.data?.places?.[0]?.photos?.[0]?.name || null;

        console.log("PHOTO REF:", photoRef);

        const PhotoUrl = PHOTO_REF_URL.replace(
          '{NAME}',
          res.data?.places?.[0]?.photos?.[0]?.name
        );
        setPhotoUrl(PhotoUrl);
        console.log("PHOTO URL:", PhotoUrl);

      } catch (e) {
        console.error(e);
      }
    };

    GetPlacePhoto();
  }, [hotel]);

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${hotel?.hotelName} ${hotel?.address}`
      )}`}
      target="_blank"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img src={photoUrl} className="rounded-lg" />

        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium">{hotel?.hotelName}</h2>
          <h2 className="text-xs text-gray-500">📍{hotel?.address}</h2>
          <h2 className="text-sm">💰{hotel?.price}</h2>
          <h2 className="text-sm">⭐{hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
