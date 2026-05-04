// Importing React so we can create a component
import React from 'react'

// Importing a reusable Button component (from your UI library - likely shadcn/ui)
import { Button } from "@/components/ui/button";

// Importing Link from react-router-dom to enable navigation without page reload
import { Link } from 'react-router-dom';

// Defining a functional component named Hero
function Hero() {

  // The return statement defines what UI this component will render
  return (

    // Main container div
    // flex → enables flexbox
    // flex-col → stack items vertically
    // items-center → center items horizontally
    // mx-40 → horizontal margin (left + right spacing)
    // gap-9 → space between child elements
    <div className='flex flex-col items-center mx-40 gap-9'>

      {/* Heading section */}
      {/* font-extrabold → very bold text
          text-[60px] → custom large font size
          text-center → center align text
          mt-16 → margin from top */}
      <h1 className='font-extrabold text-[60px] text-center mt-16'>

        {/* Highlighted part of heading */}
        {/* text-[#f56551] → custom color */}
        <span className='text-[#f56551]'>
          Discover Your Next Adventure with AI:
        </span>

        {/* Remaining text of heading */}
        {" "}Personalized Itineraries at Your Fingertips
      </h1>

      {/* Description paragraph */}
      {/* text-xl → medium-large font
          text-gray-500 → gray color text
          text-center → center align */}
      <p className='text-xl text-gray-500 text-center'>

        {/* NOTE: You have a typo here → "budge" should be "budget" */}
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budge.
      </p>

      {/* Navigation wrapper */}
      {/* Link component ensures client-side routing (no full page reload) */}
      <Link to={'/create-trip'}>

        {/* Button component */}
        {/* When clicked → user navigates to /create-trip */}
        <Button>
          Get Started, It's Free
        </Button>

      </Link>

    </div>
  )   
}

// Exporting the component so it can be used in other files
export default Hero


// Flow (what actually happens step-by-step)

// React loads this file and identifies the Hero component

// When Hero is used somewhere in the app, this JSX gets executed

// A vertical layout is created using flex and flex-col

// Elements (heading → paragraph → button) are stacked one below another

// The button is wrapped inside a Link component for navigation

// When the user clicks the button, the route changes to "/create-trip"

// Navigation happens without page reload (client-side routing)