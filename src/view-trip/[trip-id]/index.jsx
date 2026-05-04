// Import React and hooks
import React, { useEffect, useState } from 'react'

// Hook to get dynamic params from URL (like /trip/:tripId)
import { useParams } from 'react-router-dom'

// Firebase database config
import { db } from '@/service/firebaseConfig';

// Firestore functions to access document
import { doc, getDoc } from 'firebase/firestore';

// Toast notification library (for showing messages)
import { toast } from 'sonner';

// UI components (different sections of the page)
import InfoSection from '@/view-trip/[trip-id]/components/InfoSection';
import Hotels from '@/view-trip/[trip-id]/components/Hotels';
import PlaceToVisit from '@/view-trip/[trip-id]/components/PlaceToVisit';
import Footer from '@/view-trip/[trip-id]/components/Footer';

function Viewtrip () {

  // Extract tripId from URL
  const {tripId} = useParams();

  // State to store trip data (initially undefined)
  const [trip, setTrip] = useState();

  // Runs when component loads OR when tripId changes
  useEffect(()=> {
    // If tripId exists, call API to fetch data
    tripId && GetTripData();
  },[tripId])

  // Function to fetch trip data from Firebase
  const GetTripData = async () => {

    // Create reference to document: collection = 'AITrips', docId = tripId
    const docRef = doc(db, 'AITrips', tripId);

    // Fetch document data
    const docSnap = await getDoc(docRef);

    // If document exists
    if(docSnap.exists()){
      console.log("Document:", docSnap.data());

      // Save data in state → triggers re-render
      setTrip(docSnap.data());
    }
    else {
      console.log("No such Document");

      // Show error message to user
      toast('No trip found')
    }
  }
  
  return (
    // Page layout with padding (Tailwind CSS)
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>

      {/* Pass trip data to different UI sections */}

      {/* Information Section */}
      <InfoSection trip={trip} />

      {/* Recommended Hotels */}
      <Hotels trip={trip} />

      {/* Daily Plan */}
      <PlaceToVisit trip={trip} />

      {/* Footer */}
      <Footer trip={trip} />

    </div>
  )
}

// Export component so it can be used in routing
export default Viewtrip;

/*
1. User opens URL like → /view-trip/abc123

2. useParams() extracts:
   tripId = "abc123"

3. useEffect runs because tripId is available

4. GetTripData() is called

5. Firebase is queried:
   Collection: AITrips
   Document: abc123

6. If data exists:
   → setTrip(data)
   → React re-renders UI

7. That data is passed into:
   InfoSection
   Hotels
   PlaceToVisit
   Footer

8. Each component uses trip data to display UI

9. If data NOT found:
   → toast("No trip found")
*/