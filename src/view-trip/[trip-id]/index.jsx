import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import InfoSection from '@/view-trip/[trip-id]/components/InfoSection';
import Hotels from '@/view-trip/[trip-id]/components/Hotels';
import PlaceToVisit from '@/view-trip/[trip-id]/components/PlaceToVisit';
import Footer from '@/view-trip/[trip-id]/components/Footer';

function Viewtrip () {

  const {tripId}=useParams();
  const [trip, setTrip]=useState();

  useEffect(()=> {
    tripId&&GetTripData();
  },[tripId])

  const GetTripData=async()=>{
    const docRef=doc(db,'AITrips', tripId);
    const docSnap= await getDoc(docRef);

    if(docSnap.exists()){
      console.log("Document:",docSnap.data());
      setTrip(docSnap.data());
    }
    else {
      console.log("No such Document");
      toast('No trip found')
      
    }
  }
  
  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/*Information Section */}
      <InfoSection trip={trip} />

      {/* Recommended Hotels*/}
      <Hotels trip={trip} />

      {/* Daily Plan*/}
      <PlaceToVisit trip={trip} />

      {/*Footer */}
      <Footer trip={trip} />

    </div>
  )
}

export default Viewtrip