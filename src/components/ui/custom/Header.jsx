import React, { useEffect, useState } from 'react'

// 👉 ShadCN Button component (UI library)
import { Button } from "@/components/ui/button";

// 👉 ShadCN Popover (small dropdown UI)
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// 👉 Google logout function
import { googleLogout } from '@react-oauth/google';

// 👉 ShadCN Dialog (modal popup UI)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog"

// 👉 Google icon
import { FcGoogle } from "react-icons/fc";

// 👉 Google login hook
import { useGoogleLogin } from "@react-oauth/google";

// 👉 Axios for API calls
import axios from "axios";


function Header() {

  // 👉 Get user from localStorage (runs every render)
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 👉 Controls login popup (Dialog)
  const [openDialog, setOpenDialog] = useState(false);

  // 👉 Loading state (currently not fully used)
  const [loading, setLoading] = useState(false);


  /*
  👉 FUNCTION: Fetch user profile from Google API
  */
  const GetUserProfile = (tokenInfo) => {
    axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "application/json",
        },
      }
    )
    .then((res) => {

      // 👉 Save user data in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // 👉 Close login dialog
      setOpenDialog(false);

      // 👉 Reload app to reflect login state
      window.location.reload();
    });
  };


  /*
  👉 GOOGLE LOGIN HOOK
  */
  const login = useGoogleLogin({
    onSuccess: (res) => {
      console.log("G-SUCCESS:", res);

      // 👉 After login, fetch profile
      GetUserProfile(res);
    },
    onError: (err) => console.error("G-ERROR:", err),
  });


  /*
  👉 Runs once when Header loads
  */
  useEffect(() => {
    console.log("HEADER USER:", user);
  }, []);


  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>

      {/* LEFT SIDE: Logo + App Name */}
      <a href="/">
        <div className='flex items-center gap-2 cursor-pointer'>
          <img src="/logo.svg" alt="logo" className="w-10" />
          <h1 className="text-xl font-bold">Trip Tailor</h1>
        </div>
      </a>


      {/* RIGHT SIDE: Conditional UI */}
      <div>
        {user ? (
          // 👉 IF USER LOGGED IN
          <div className='flex items-center gap-3'>

            {/* Create Trip button */}
            <a href='/create-trip'>
              <Button variant="outline" className="rounded-full cursor-pointer">
                + Create Trip
              </Button>
            </a>

            {/* My Trips button */}
            <a href='/my-trips'>
              <Button variant="outline" className="rounded-full cursor-pointer">
                My Trips
              </Button>
            </a>

            {/* User profile dropdown */}
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  alt="user"
                  className='h-[50px] w-[50px] rounded-full object-cover'
                />
              </PopoverTrigger>

              <PopoverContent>
                {/* Logout logic */}
                <h2 onClick={()=>{
                  googleLogout();       // logout from Google
                  localStorage.clear(); // clear user data
                  window.location.href="/"; // redirect
                }}>
                  Logout
                </h2>
              </PopoverContent>
            </Popover>

          </div>
        ) : (
          // 👉 IF USER NOT LOGGED IN
          <Button onClick={()=>setOpenDialog(true)}>
            Sign In
          </Button>
        )}
      </div>


      {/* 👉 LOGIN DIALOG (POPUP) */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>

              {/* Close button */}
              <DialogClose asChild>
                <button className="absolute top-2 right-2">✕</button>
              </DialogClose>

              {/* Logo */}
              <div className="flex items-center gap-3 mt-2">
                <img src="/logo.svg" alt="" />
                <span className="font-bold text-lg text-black">
                  Trip Tailor
                </span>
              </div>

              {/* Title */}
              <h2 className="font-bold text-lg">
                Sign In With Google
              </h2>

              {/* Description */}
              <p>
                Sign in to the App with Google authentication securely
              </p>

              {/* Google Login Button */}
              <Button
                disabled={loading}
                onClick={() => login()}
                className="w-full mt-5 flex gap-4 items-center"
              >
                <FcGoogle className="h-7 w-7" />
                Sign In With Google
              </Button>

            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default Header;

// 1. App loads
// 2. Header runs → checks user in localStorage

// IF user exists:
//    → show "My Trips"
// ELSE:
//    → show "Sign In"

// 3. User logs in (Google)
//    → user data saved in localStorage
//    → app reloads

// 4. User clicks "My Trips"
//    → MyTrips component loads

// 5. MyTrips runs (top → bottom)
//    → state = []

// 6. First UI render
//    → shows loading skeleton (no data yet)

// 7. useEffect runs AFTER render
//    → calls GetUserTrips()

// 8. GetUserTrips():
//    → checks user again
//    → queries Firestore (userEmail match)
//    → gets trip data

// 9. setUserTrips() updates state

// 10. React re-renders

// 11. UI updates
//     → shows real trip cards