import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
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
import axios from "axios";




function Header() {

 const user = JSON.parse(localStorage.getItem("user") || "null");
const [openDialog, setOpenDialog] = useState(false);
const [loading, setLoading] = useState(false);   // ✅ FIXED


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
          window.location.reload();
        });
    };

      const login = useGoogleLogin({
    onSuccess: (res) => {
      console.log("G-SUCCESS:", res);
      GetUserProfile(res);   // IMPORTANT
    },
    onError: (err) => console.error("G-ERROR:", err),
  });

  useEffect(() => {
    console.log("HEADER USER:", user);
  }, []);

 
  

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>

      {/* LEFT SIDE: Logo + Company Name */}

     
        <a href="/">
          <div className='flex items-center gap-2 cursor-pointer'>
            <img src="/logo.svg" alt="logo" className="w-10" />
            <h1 className="text-xl font-bold">Trip Tailor</h1>
          </div>
        </a>
     

      <div>
        {user ? (
          <div className='flex items-center gap-3'>

            <a href='/create-trip'>
            <Button variant="outline" className="rounded-full cursor-pointer">+ Create Trip</Button>
            </a>

            <a href='/my-trips'>
            <Button variant="outline" className="rounded-full cursor-pointer">My Trips</Button>
            </a>

            <Popover>
              <PopoverTrigger>
                 <img
                    src={user?.picture}
                    alt="user"
                    className='h-[50px] w-[50px] rounded-full object-cover'
                  />
              </PopoverTrigger>
              <PopoverContent>
                <h2 onClick={()=>{
                  googleLogout();
                  localStorage.clear();
                  window.location.href="/";
                }}>Logout</h2>
              </PopoverContent>
            </Popover>

          </div>
        ) : (
          <Button onClick={()=>setOpenDialog(true)}>Sign In</Button>
        )}
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
                  className="w-full mt-5 flex gap-4 items-center"
                >
                  <FcGoogle className="h-7 w-7" />Sign In With Google
                  
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
