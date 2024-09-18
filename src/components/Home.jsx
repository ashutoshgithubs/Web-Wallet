import React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';


export default function Home() {
    const [selectedBlockchain, setSelectedBlockchain] = useState('');
    const navigate = useNavigate();
    const buttonHandler = ()=>{
      navigate('/generate',{ state: {selectedBlockchain}});
      console.log("Home block: ", selectedBlockchain);
    }
  return (
    <div className='items-center my-auto'>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Select Blockchain</CardTitle>
          <CardDescription>Choose the blockchain for your wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={(value) => setSelectedBlockchain(value)}>
            <SelectTrigger id="blockchain">
              <SelectValue placeholder="Select a blockchain" />
            </SelectTrigger>
            <SelectContent className="font-serif">
              <SelectItem value="Solana">Solana</SelectItem>
              <SelectItem value="Ethereum">Ethereum</SelectItem>
            </SelectContent>
          </Select>
          <Button 
              onClick={buttonHandler} 
              disabled={!selectedBlockchain}
              className="w-full mt-2"
            >
              Next
            </Button>
        </CardContent>
      </Card>
    </div>
  )
}
