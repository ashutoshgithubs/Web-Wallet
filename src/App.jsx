
import './App.css'
import { Route, Routes} from "react-router-dom";
import Wallet from './components/Wallet';
import Home from './components/Home';

export default function App() {
  return (
        <div className="w-screen min-h-screen bg-richblack-900 flex flex-col">
       
      <Routes>
        <Route path="/" element={<Home/>}/>
         <Route path="/generate" element={<Wallet />} />
      </Routes>
    </div>
  )
}

