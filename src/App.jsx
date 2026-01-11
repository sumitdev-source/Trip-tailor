import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"
import Hero from './components/ui/custom/Hero'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen flex flex-col">
      
      {/* Hero Section */}
      <div className="flex-grow">
        <Hero />
      </div>


    </div>
    </>
  )
}

export default App
