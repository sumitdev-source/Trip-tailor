import axios from "axios";
import React, { useEffect, useState } from "react";
import MyAutocomplete from "../components/ui/MyAutocomplete";
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelesList } from "../constants/options";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { generateJSON } from "../gemeniClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";

import { useGoogleLogin } from "@react-oauth/google";
import { collection, query, where, getDocs ,doc, setDoc } from "firebase/firestore";

import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";


function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog]=useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  const buildPrompt = (data) => {
    const destination =
      data?.destination?.description ||
      (typeof data?.destination === "string" ? data.destination : "Unknown");
    const days = Number(data?.noOfDays) || 1;
    const traveler = data?.traveler || "1 People";
    const budget = data?.budget || "Moderate";

    return `Return ONLY valid JSON EXACTLY in this shape:
{
  "daywise": [
    { "day": 1, "title": "", "summary": "", "activities": [{ "placeName":"", "placeDetails":"", "placeImageUrl":"", "geo": {"lat":0,"lng":0}, "ticketPricing":"", "rating":"", "bestTimeToVisit":"" }], "travelTimeBetween":"", "budgetEstimate":"" }
  ],
  "hotels": [
    { "hotelName":"", "address":"", "price":"", "imageUrl":"", "geo":{"lat":0,"lng":0}, "rating":"", "description":"" }
  ],
  "summary": ""
}

Now, using the following input, create a travel plan:
Location: ${destination}
Days: ${days}
Traveler: ${traveler}
Budget: ${budget}
Requirements:
- Provide a hotel options list (hotelName, address, price, image url, geo coordinates, rating, description).
- Provide day-wise itinerary for ${days} day(s). For each day include: placename, place details, place image url, geo coordinates, ticket pricing, rating, travel time between locations, best time to visit.
Be concise and keep the JSON valid.`;
  };

  // Google Login hook: this returns a function (login) that opens Google OAuth popup.
// onSuccess → Google se credential/data milta hai
// onError → login fail ya popup cancel hone par error aata hai

  const login = useGoogleLogin({
  onSuccess: (res) => {
    console.log("G-SUCCESS:", res);
    GetUserProfile(res);   // IMPORTANT
  },
  onError: (err) => console.error("G-ERROR:", err),
});

 
  const GetTripCountForEmail = async (email) => {
  const q = query(
    collection(db, "AITrips"),
    where("userEmail", "==", email)
  );

  const snapshot = await getDocs(q);
  return snapshot.size; // total trips
};

  // 👉 YAHAN GETUSERPROFILE FUNCTION ADD KARO
  const GetUserProfile = (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        OnGenerateTrip(); // now call trip generator again
      });
  };

  const OnGenerateTrip = async () => {

  //firebase
  const SaveAiTrip=async(TripData)=>{

    setLoading(true);
    const user=JSON.parse( localStorage.getItem('user'));
    const docId=Date.now().toString()
    // Add a new document in collection "cities"
      await setDoc(doc(db, "AITrips", docId), {
        userSelection:formData,
        tripData: TripData,
        userEmail:user?.email,
        id:docId
      });
     setLoading(false);
     navigate('/view-trip/'+ docId)
  }



    const user=localStorage.getItem('user');

    if(!user) 
    {
      setOpenDialog(true)
      return;
    }

    const parsedUser = JSON.parse(user);
    const tripCount = await GetTripCountForEmail(parsedUser.email);
    console.log("Total Trips by this user =", tripCount);
    
    
    // validation
    if (
      !formData?.destination ||
      !formData?.noOfDays ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please fill all details");
      return;
    }

    setLoading(true);
    setItinerary(null);

    const prompt = buildPrompt(formData);

    try {
      const aiJson = await generateJSON(prompt, "gemini-2.5-flash");
      setItinerary(aiJson);
      await SaveAiTrip(aiJson);   // 👉 ye line data Firebase me save karegi
      console.log("Generated Trip JSON:", aiJson); //to show code in console
      toast("Trip generated");
    } catch (err) {
      console.error("AI error:", err);
      if (err.message === "AI_RESPONSE_JSON_PARSE_ERROR") {
        console.error("Raw AI text:", err.details?.raw);
        toast("AI returned non-JSON response. Check console and refine prompt.");
      } else {
        toast("AI error. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <Toaster />
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕️🌴</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a
        customized itinerary based on your preferences
      </p>

      <div className="mt-20">
        <div>
          <h2 className="text-xl my-3 font-medium">What is destination of choice?</h2>
        </div>
      </div>

      <MyAutocomplete
        onSelectPlace={(description, coords) => {
          setPlace({ description, coords });
          handleInputChange("destination", { description, coords });
        }}
      />

      <div className="mt-5 ">
        <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
        <Input
          placeholder={"Ex.3"}
          type="number"
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
        />
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">What is your Budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.budget == item.title && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with on your next adventure?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("traveler", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.traveler == item.people && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button onClick={OnGenerateTrip} disabled={loading}>
          {loading?
          <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />: 'Generate Trip'
          }
          </Button>
      </div>


<Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogDescription>

        {/* ONLY one close button — keep this and remove any other DialogClose elsewhere */}
        <DialogClose asChild>
          <button aria-label="Close" className="absolute top-2 right-2">✕</button>
        </DialogClose>

        {/* Logo + Text together */}
        <div className="flex items-center gap-3 mt-2">
          <img src="/logo.svg" alt="" />
          <span className="font-bold text-lg text-black">Trip Tailor</span>
        </div>


        <h2 className="font-bold text-lg">Sign In With Google</h2>
        <p>Sign in to the App with Google authentication securely</p>

        <Button
          disabled={loading}
          onClick={() => { console.log("Calling login()"); login(); }}
          className="w-full mt-5 flex gap-4 items-center">
            
          <FcGoogle className="h-7 w-7" />Sign In With Google
          
        </Button>
        

      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>


    </div>
  );
}

export default CreateTrip;
