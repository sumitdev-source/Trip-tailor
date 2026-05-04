// Import React hooks for state and lifecycle
import React, { useEffect, useState } from 'react';

// Hook to navigate between pages
import { useNavigate } from 'react-router-dom';

// Firestore functions to query data
import { collection, query, where, getDocs } from "firebase/firestore";

// Firebase database config
import { db } from "@/service/firebaseConfig";

// Component to display each trip card
import UserTripCardItem from '@/my-trips/components/UserTripCardItem';

function MyTrips() {

  // Hook used to programmatically redirect user
  const navigate = useNavigate();

  // State to store all trips of the logged-in user
  const [userTrips, setUserTrips] = useState([]);

  // useEffect runs once when component loads (empty dependency array)
  useEffect(() => {
    GetUserTrips();  // call function to fetch trips
  }, []);

  /**
   * Function to fetch trips of logged-in user from Firestore
   */
  const GetUserTrips = async () => {

    // Get user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    // If user is not logged in → redirect to home page
    if (!storedUser) {
      navigate('/');
      return;
    }

    // Clear previous trips before fetching new ones
    setUserTrips([]);

    // Create Firestore query:
    // Select documents from "AITrips" where userEmail matches logged-in user
    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", storedUser.email)
    );

    // Execute query and wait for response
    const querySnapshot = await getDocs(q);

    // Loop through all documents returned
    querySnapshot.forEach((doc) => {

      // Print each document id and data in console
      console.log(doc.id, " => ", doc.data());

      // Add each trip to state (important: using prevVal to avoid overwrite)
      setUserTrips(prevVal => [...prevVal, doc.data()]);
    });
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>

      {/* Page heading */}
      <h2 className='font-bold text-3xl'> MyTrips </h2>

      {/* Grid layout for trip cards */}
      <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>

        {/* If trips exist → show actual data */}
        {userTrips?.length > 0
          ? userTrips.map((trip, index) => (
              // Render each trip card
              <UserTripCardItem trip={trip} key={index} />
            ))

          // If no data yet → show loading skeleton UI
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={index}
                className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'
              >
                {/* Placeholder loading box */}
              </div>
            ))
        }

      </div>
    </div>
  );
}

// Export component so it can be used in routing
export default MyTrips;