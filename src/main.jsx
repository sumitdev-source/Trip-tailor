import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateTrip from './create-trip/index.jsx';
import Header from './components/ui/custom/Header.jsx';
import { APIProvider } from "@vis.gl/react-google-maps";
import { Toaster, toast } from "sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './view-trip/[trip-id]';
import MyTrips from './my-trips';


const router=createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },
  {
    path:"/create-trip",
    element:<CreateTrip />
  },
  {
    path:'/view-trip/:tripId',
    element: <Viewtrip />
  },
  {
    path:'/my-trips',
    element: <MyTrips />
  }
])

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OUTH_CLIENT_ID}>
    <Header/>
    <Toaster />
    <RouterProvider router={router} />
    </GoogleOAuthProvider>
    </APIProvider>
  </StrictMode>
 ,
)
