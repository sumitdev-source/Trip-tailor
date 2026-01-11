import React from "react";
import PlaceCard from '@/view-trip/[trip-id]/components/PlaceCard';   // ← NEW: PlaceCard import

function PlaceToVisit({ trip }) {
  
  // trip null ho toh kuch render na karo (error se bachega)
  if (!trip?.tripData?.daywise) {
    return null;
  }

  return (
    <div>
      <h2 className="font-bold text-lg">Places to Visit</h2>

      <div className="mt-4 space-y-6">
        {trip?.tripData?.daywise?.map((day, index) => (
          <div key={index} className="border rounded-xl p-4 space-y-4">

            {/* Day Title */}
            <h3 className="font-bold text-md">
              Day {day?.day} {day?.title && `- ${day.title}`}
            </h3>

            {/* Day Summary */}
            {day?.summary && (
              <p className="text-sm text-gray-600">{day.summary}</p>
            )}

            {/* Activities List */}
            <div className="space-y-4">
              {day?.activities?.map((activity, aIndex) => (
                <PlaceCard key={aIndex} place={activity} />
              ))}
            </div>

            {/* Travel time & budget */}
            <div className="text-xs text-gray-500">
              {day?.travelTimeBetween && (
                <p>Travel Time: {day.travelTimeBetween}</p>
              )}
              {day?.budgetEstimate && (
                <p>Budget: {day.budgetEstimate}</p>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaceToVisit;
