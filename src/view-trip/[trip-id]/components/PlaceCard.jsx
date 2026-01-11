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
