import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from './components/Home';
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import ToggleTheme from './components/ToggleTheme';
import GenerateWallet from './components/GenerateWallet';
import logo from './assets/logo.png'

export default function App() {
  const navigate = useNavigate()
  return (
    <div className="w-screen min-h-screen bg-background text-foreground flex flex-col items-between">
      
      {/* //NavBar */}
        <div className='w-full flex justify-between'>
          <button onClick={() => navigate('/')}>
            <img src={logo} className='h-20 w-20 fixed top-1 left-2 z-20' ></img>
          </button>
          <ToggleTheme/>
        </div>
      
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<GenerateWallet />} />
      </Routes>
      <div className='text-center mt-2 mb-2 font-serif opacity-40'>
        <h4>
          Designed & Developed by Ashutosh Kumar
        </h4>
      </div>
    </div>
  )
}