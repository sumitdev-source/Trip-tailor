// Import axios → used to make HTTP requests (GET, POST, etc.) to APIs
import axios from "axios";

// Import React core + hooks
// useEffect → run side effects (like API calls, lifecycle logic)
// useState → store and update component state
import React, { useEffect, useState } from "react";

// Custom component → likely an autocomplete input (user types, suggestions show)
import MyAutocomplete from "../components/ui/MyAutocomplete";

// Custom Input component (probably styled input field)
import { Input } from "@/components/ui/input";

// Import predefined options → static data used in UI
// SelectBudgetOptions → list of budget choices
// SelectTravelesList → list of traveler types
import { SelectBudgetOptions, SelectTravelesList } from "../constants/options";

// Custom Button component (styled button)
import { Button } from "@/components/ui/button";

// Toast notification system
// Toaster → UI container to show notifications
// toast → function to trigger messages (success, error, etc.)
import { Toaster, toast } from "sonner";

// Function to generate JSON using Gemini (AI API)
// Probably sends prompt → returns structured travel plan
import { generateJSON } from "../gemeniClient";

// Dialog (modal popup) components
// Used for login popup or confirmations
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

// Google icon (for login button UI)
import { FcGoogle } from "react-icons/fc";

// Hook to handle Google OAuth login
// This gives you access token / user info after login
import { useGoogleLogin } from "@react-oauth/google";

// Firebase Firestore imports
// collection → reference a collection (table)
// query → create query
// where → filter data
// getDocs → fetch data
// doc → reference a specific document
// setDoc → insert/update data
import { collection, query, where, getDocs ,doc, setDoc } from "firebase/firestore";

// Firebase config (your database connection setup)
import { db } from "@/service/firebaseConfig";

// Loading spinner icon (used while API is processing)
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Navigation hook (used to move between pages in React Router)
import { useNavigate } from "react-router-dom";


function CreateTrip() {
  // React state to store selected place (probably from autocomplete)
  const [place, setPlace] = useState();

  // Stores all user input like destination, days, budget, etc.
  const [formData, setFormData] = useState({});

  // Stores the final generated itinerary (AI response or API result)
  const [itinerary, setItinerary] = useState(null);

  // Boolean flag to show loading (like spinner while fetching data)
  const [loading, setLoading] = useState(false);

  // Controls whether dialog/modal is open or not
  const [openDialog, setOpenDialog] = useState(false);

  // React Router hook → used to navigate between pages
  const navigate = useNavigate();


  // Function to update form data dynamically
  const handleInputChange = (name, value) => {
    // name = field name (e.g., "destination", "budget")
    // value = user input

    setFormData((prev) => ({
      ...prev,        // keep previous data
      [name]: value,  // update only the changed field
    }));
  };


  // Runs every time formData changes
  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]); // dependency array → triggers when formData updates


  // Function to build a prompt string (for AI or backend)
  const buildPrompt = (data) => {

    // Extract destination safely
    const destination =
      data?.destination?.description || // if it's an object (like Google Places)
      (typeof data?.destination === "string" ? data.destination : "Unknown"); // fallback

    // Convert number of days safely (default = 1)
    const days = Number(data?.noOfDays) || 1;

    // Default traveler if not provided
    const traveler = data?.traveler || "1 People";

    // Default budget if not provided
    const budget = data?.budget || "Moderate";


    // Return a formatted prompt string (used for AI generation)
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
// 🔐 Google Login hook (from react-oauth/google)
const login = useGoogleLogin({
  
  // 👉 Runs when login is successful
  onSuccess: (res) => {
    console.log("G-SUCCESS:", res); // contains access_token

    GetUserProfile(res);   // 🔥 Step 1: fetch user details using token
  },

  // 👉 Runs if login fails
  onError: (err) => console.error("G-ERROR:", err),
});


// 🔢 Function to count how many trips a user has in Firebase
const GetTripCountForEmail = async (email) => {

  // 🔍 Create a query on "AITrips" collection where email matches
  const q = query(
    collection(db, "AITrips"),
    where("userEmail", "==", email)
  );

  // 📦 Fetch matching documents
  const snapshot = await getDocs(q);

  return snapshot.size; // 👉 number of documents (trip count)
};



// 👤 Function to get user profile from Google using access_token
const GetUserProfile = (tokenInfo) => {

  axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "application/json",
        },
      }
    )

    // 👉 If API call successful
    .then((res) => {

      // 💾 Save user data (name, email, etc.) in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // ❌ Close login dialog
      setOpenDialog(false);

      // 🔥 Call main function again (now user exists)
      OnGenerateTrip();
    });
};



// 🚀 MAIN FUNCTION → handles trip generation
const OnGenerateTrip = async () => {

  // 🔥 Nested function → saves trip data into Firebase
  const SaveAiTrip = async (TripData) => {

    setLoading(true); // ⏳ show loading

    // 📥 Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // 🆔 Unique ID using timestamp
    const docId = Date.now().toString();

    // 📤 Save data in Firestore
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData, // user input (destination, days, etc.)
      tripData: TripData,      // AI generated itinerary
      userEmail: user?.email,  // logged-in user's email
      id: docId                // document ID
    });

    setLoading(false); // ⏹ stop loading

    // 🔁 Navigate to trip view page
    navigate('/view-trip/' + docId);
  };



  // 📥 Get user from localStorage
  const user = localStorage.getItem('user');

  // ❌ If user NOT logged in
  if (!user) {
    setOpenDialog(true); // 👉 open login popup
    return;              // ❌ stop execution
  }


  // ✅ Convert string → object
  const parsedUser = JSON.parse(user);

  // 🔢 Get how many trips user already created
  const tripCount = await GetTripCountForEmail(parsedUser.email);

  console.log("Total Trips by this user =", tripCount);


  // ⚠️ Validation → check if all fields are filled
  if (
    !formData?.destination ||
    !formData?.noOfDays ||
    !formData?.budget ||
    !formData?.traveler
  ) {
    toast("Please fill all details");
    return; // ❌ stop if invalid
  }


  // ⏳ Start loading
  setLoading(true);

  // 🧹 Clear old itinerary
  setItinerary(null);

  // 🧠 Build AI prompt from user input
  const prompt = buildPrompt(formData);


  try {
    // 🤖 Call AI model to generate trip JSON
    const aiJson = await generateJSON(prompt, "gemini-2.5-flash");

    // 📦 Store result in state
    setItinerary(aiJson);

    // 💾 Save to Firebase
    await SaveAiTrip(aiJson);

    console.log("Generated Trip JSON:", aiJson);

    toast("Trip generated");

  } catch (err) {

    console.error("AI error:", err);

    // ⚠️ If AI returns invalid JSON
    if (err.message === "AI_RESPONSE_JSON_PARSE_ERROR") {
      console.error("Raw AI text:", err.details?.raw);
      toast("AI returned non-JSON response. Check console and refine prompt.");
    } else {
      toast("AI error. Check console.");
    }

  } finally {
    // ⏹ Stop loading (always runs)
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
