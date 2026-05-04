// Importing React library so we can create components
import React from 'react'

// Importing Link component from react-router-dom (used for navigation between pages)
// NOTE: In this file, Link is NOT used → unnecessary import (you should remove it)
import { Link } from 'react-router-dom'

// Importing a custom component that will display each hotel card
// '@/...' means alias path (usually mapped to src folder in config)
import HotelCardItem from '@/view-trip/[trip-id]/components/HotelCardItem';


// Creating a functional React component named Hotels
// It receives 'trip' as a prop (data passed from parent component)
function Hotels({ trip }) {

  return (
    <div>

      {/* Heading for the section */}
      <h2 className='font-bold text-xl mt-5'>
        Hotel Recommendation
      </h2>

      {/* 
        Creating a responsive grid layout using Tailwind CSS:
        grid-cols-2 → 2 columns on small screens
        md:grid-cols-3 → 3 columns on medium screens
        xl:grid-cols-4 → 4 columns on large screens
        gap-5 → spacing between grid items
      */}
      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>

        {/* 
          Optional chaining (?.) is used to avoid errors if data is undefined

          trip?.tripData?.hotels:
          - trip → main object
          - tripData → nested object
          - hotels → array of hotel objects

          .map() → loops over each hotel in the array
        */}
        {trip?.tripData?.hotels?.map((hotel, index) => (

          // Rendering HotelCardItem for each hotel
          // key={index} → React needs a unique key for list items
          // hotel={hotel} → passing each hotel data as prop to child component
          <HotelCardItem key={index} hotel={hotel} />

        ))}

      </div>
    </div>
  )
}

// Exporting this component so it can be used in other files
export default Hotels

/*
WHAT THIS COMPONENT IS DOING:

1. It receives trip data from a parent component.
2. It extracts hotel data from trip.tripData.hotels.
3. It loops over that hotel array using map().
4. For each hotel, it renders a HotelCardItem component.
5. Each card gets its own hotel data.
6. The layout is responsive using Tailwind grid.

FLOW (Step-by-step):

Parent Component
   ↓ passes trip prop
Hotels Component
   ↓ reads trip.tripData.hotels
   ↓ loops using map()
   ↓ renders multiple HotelCardItem
HotelCardItem
   ↓ displays UI for each hotel

IMPORTANT PROBLEMS IN YOUR CODE:

❌ 1. Unused import:
   - Link is imported but never used → remove it

❌ 2. key={index} is BAD practice:
   - Using index as key can cause bugs in dynamic lists
   - Better: use a unique id (hotel.id if available)

❌ 3. No fallback UI:
   - If hotels is empty → nothing shows
   - You should handle loading or empty state

Example improvement:
{trip?.tripData?.hotels?.length === 0 && <p>No hotels found</p>}

BOTTOM LINE:

This is a "presentational + mapping component"
→ It doesn't create data
→ It only displays data by looping and passing it down

If you don't understand this deeply, you'll struggle in React interviews.
You should be able to explain:
- props flow
- component hierarchy
- map rendering
- key importance

If you want, next step:
👉 I can break down HotelCardItem also (that’s where real UI logic is)
*/