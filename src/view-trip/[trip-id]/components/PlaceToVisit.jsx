// Import React library (needed to create components)
import React from "react";

// Import a reusable component that displays a single place/activity card
// '@/' is usually an alias for the src folder (configured in your project)
import PlaceCard from '@/view-trip/[trip-id]/components/PlaceCard';


// Functional component that receives 'trip' data as props
function PlaceToVisit({ trip }) {
  
  // Defensive programming:
  // If trip OR nested data (tripData.daywise) is missing,
  // return null to prevent runtime errors (like "cannot read property of undefined")
  if (!trip?.tripData?.daywise) {
    return null;
  }

  // JSX rendering starts here
  return (
    <div>

      {/* Section Title */}
      <h2 className="font-bold text-lg">Places to Visit</h2>

      {/* Container for all days */}
      <div className="mt-4 space-y-6">

        {/* Loop through each day in the trip plan */}
        {trip?.tripData?.daywise?.map((day, index) => (

          // Each day block (card-like container)
          // key is required by React for efficient re-rendering
          <div key={index} className="border rounded-xl p-4 space-y-4">

            {/* Day Title */}
            <h3 className="font-bold text-md">
              {/* Show Day number */}
              Day {day?.day} 
              
              {/* If title exists, show it after dash */}
              {day?.title && `- ${day.title}`}
            </h3>

            {/* Day Summary (optional) */}
            {/* Only render if summary exists */}
            {day?.summary && (
              <p className="text-sm text-gray-600">
                {day.summary}
              </p>
            )}

            {/* Activities Section */}
            <div className="space-y-4">

              {/* Loop through activities of that day */}
              {day?.activities?.map((activity, aIndex) => (

                // Render each activity using reusable PlaceCard component
                // Passing activity data as prop named 'place'
                <PlaceCard key={aIndex} place={activity} />
              ))}
            </div>

            {/* Travel Time and Budget Section */}
            <div className="text-xs text-gray-500">

              {/* Show travel time only if it exists */}
              {day?.travelTimeBetween && (
                <p>Travel Time: {day.travelTimeBetween}</p>
              )}

              {/* Show budget only if it exists */}
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

// Export component so it can be used in other files/pages
export default PlaceToVisit;

/*
This component (PlaceToVisit) is responsible for rendering a structured travel itinerary.

Flow:
1. It receives a 'trip' object as a prop.
2. It first checks if required nested data (trip.tripData.daywise) exists.
   - If not, it returns null to prevent crashes (defensive coding).

3. It iterates over the 'daywise' array:
   - Each item represents a single day of the trip.

4. For each day:
   - Displays day number and optional title.
   - Displays a summary if available.
   - Iterates through activities of that day.

5. Each activity is passed to a reusable component (PlaceCard),
   which is responsible for rendering individual place details.

6. It conditionally renders additional metadata:
   - Travel time between places
   - Budget estimate

Key Concepts Used:
- Conditional Rendering (&&)
- Optional Chaining (?.) for safe access
- Array Mapping for dynamic UI rendering
- Component Reusability (PlaceCard)
- Clean UI structuring with Tailwind CSS

Overall:
This component transforms structured JSON data into a dynamic, user-friendly UI,
where each day and its activities are clearly displayed in a modular and scalable way.
*/