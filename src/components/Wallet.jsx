import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { generateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"
import { Buffer } from 'buffer';


export default function Wallet() {
  const location = useLocation();
  // console.log("loaction: ", location);
  const {selectedBlockchain} = location.state || {};
  //console.log("Blockchain: ", selectedBlockchain);
  const [keyPhrase, setKeyPhrase] = useState('');
  const [wallets, setWallets] = useState([]);
  const [showPrivateKey, setShowPrivateKey] = useState({});
  const [copiedStates, setCopiedStates] = useState({});
  const [mnemonic, setMnemonic] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const generateSecretPhrase = async () => {
    const mn = await generateMnemonic();
    setMnemonic(mn)
  };

  
  const generateWallet = () => {
    if (!selectedBlockchain) return;

    let newWallet;
    const phrase = keyPhrase || generateSecretPhrase();
    console.log("Mnemonmis: ",phrase);

    if (selectedBlockchain === 'Solana') {
      const seed = mnemonicToSeed(phrase);
      //501 for SOL
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const privateKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const publicKey = Keypair.fromSecretKey(privateKey);
      setCurrentIndex(currentIndex + 1);
      newWallet = {
        publicKey: publicKey.toBase58(),
        privateKey:privateKey,
        // privateKey: Buffer.from(privateKey).toString('hex'),
      };
    } 
    //else {
    //   const wallet = ethers.Wallet.fromMnemonic(phrase);
    //   newWallet = {
    //     publicKey: wallet.address,
    //     privateKey: wallet.privateKey,
    //   };
    // }

    setWallets([...wallets, newWallet]);
    setKeyPhrase('');
    console.log("Wallets SOL: ", wallets);
  };
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [key]: true });
    setTimeout(() => setCopiedStates({ ...copiedStates, [key]: false }), 2000);
  };

  const togglePrivateKeyVisibility = (index) => {
    setShowPrivateKey(prev => ({ ...prev, [index]: !prev[index] }));
  };


  return (
    <div className='text-white items-center text-3xl mx-auto my-auto'>
      <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{selectedBlockchain} Wallet Generator</CardTitle>
        <CardDescription>Generate wallets for {selectedBlockchain}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="keyPhrase">Enter Key Phrase (optional)</Label>
          <Input
            id="keyPhrase"
            value={keyPhrase}
            onChange={(e) => setKeyPhrase(e.target.value)}
            placeholder="Enter your key phrase or leave blank to auto-generate"
          />
        </div>

        <Button onClick={generateWallet} className="w-full">
          Generate Wallet
        </Button>

        {wallets.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Wallets</h3>
            {wallets.map((wallet, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Wallet {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label>Public Key:</Label>
                    <Input value={wallet.publicKey} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(wallet.publicKey, `publicKey${index}`)}
                    >
                      {copiedStates[`publicKey${index}`] ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>Private Key:</Label>
                    <Input 
                      type={showPrivateKey[index] ? "text" : "password"} 
                      value={wallet.privateKey} 
                      readOnly 
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => togglePrivateKeyVisibility(index)}
                    >
                      {showPrivateKey[index] ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(wallet.privateKey, `privateKey${index}`)}
                    >
                      {copiedStates[`privateKey${index}`] ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  )
}
