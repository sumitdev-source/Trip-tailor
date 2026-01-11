import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import UserTripCardItem from '@/my-trips/components/UserTripCardItem';

function MyTrips() {

  const navigate = useNavigate();  // ✅ hook top-level pe

  const [userTrips, setUserTrips]=useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  /**
   * Used to Get All User Trips
   * @returns 
   */

  const GetUserTrips = async () => {  // ✅ async added
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (!storedUser) {
      navigate('/');     // ✅ redirect to home if not logged in
      return;
    }

    setUserTrips([]);
    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", storedUser.email)   // ✅ correct email access
    );

    const querySnapshot = await getDocs(q);        // ✅ await now allowed
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setUserTrips(prevVal=>[...prevVal,doc.data()])
    });
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'> MyTrips </h2>

      <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
        {userTrips?.length>0?userTrips.map((trip,index)=>(
          <UserTripCardItem trip={trip} key={index}/>
        ))
        :[1,2,3,4,5,6].map((item,index)=>(
          <div key={index} className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'>

          </div>
        ))
      }

      </div>
    </div>
  );
}

export default MyTrips;
