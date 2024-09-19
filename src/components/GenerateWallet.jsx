import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import solLogo from '../assets/sol.png';
import ethLogo from '../assets/eth.png';
import { Wallet, HDNodeWallet } from "ethers";
import { MdDelete } from "react-icons/md";  
import { useToast } from "@/hooks/use-toast"
import { FaRegCopy } from "react-icons/fa6";


export default function GenerateWallet() {
  const location = useLocation();
  const theme = localStorage.getItem('theme');
  const navigate = useNavigate();
  const { toast } = useToast()
  const { selectedBlockchain } = location.state || {}; 
  const [keyPhrase, setKeyPhrase] = useState('');
  const [wallets, setWallets] = useState([]);
  const [showPrivateKey, setShowPrivateKey] = useState({});
  const [copiedStates, setCopiedStates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mnemonics, setMnemonics] = useState('');

  const localStorageKey = selectedBlockchain === 'Solana' ? 'solanaWallets' : 'ethereumWallets';

  // Let's load the wallets from localStorage when the page loads or when the blockchain selection changes
  useEffect(() => {
    const walletsFromLocalStorage = localStorage.getItem(localStorageKey);
    if (walletsFromLocalStorage) {
      setWallets(JSON.parse(walletsFromLocalStorage));
    } else {
      setWallets([]);
    }
    setCurrentIndex(0);
  }, [selectedBlockchain, localStorageKey]);

  // Better to Save wallets to localStorage whenever wallets are updated :)
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem(localStorageKey, JSON.stringify(wallets));
    } else {
      localStorage.removeItem(localStorageKey);
    }
  }, [wallets, localStorageKey]);


  const DeleteWallets = () => {
    setWallets([]); 
    localStorage.removeItem(localStorageKey); 
    setCurrentIndex(0); 
    navigate('/')
  };

  const deleteAWallet = (index) => {
    const updatedWallets = wallets.filter((_, i) => i !== index);
    setWallets(updatedWallets); 
  };


  const generateWallet = async () => {
    if (!selectedBlockchain) return;

    let newWallet;
    const wordPhrase = keyPhrase || generateMnemonic();
    setMnemonics(wordPhrase);

    if (selectedBlockchain === 'Solana') {
      const seed = mnemonicToSeedSync(wordPhrase);
      const path = `m/44'/501'/${currentIndex}'/0'`; 
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const privateKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const publicKey = Keypair.fromSecretKey(privateKey).publicKey;
      setCurrentIndex(currentIndex + 1);
      newWallet = {
        publicKey: publicKey.toBase58(),
        privateKey: Buffer.from(privateKey).toString('hex'),
      };
    } else {
      const seed = mnemonicToSeedSync(wordPhrase);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`; 
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
      setCurrentIndex(currentIndex + 1);
      newWallet = {
        publicKey: wallet.address.toString(),
        privateKey: Buffer.from(privateKey).toString('hex'),
      };
    }

    if (newWallet) {
      setWallets([...wallets, newWallet]); 
    }

    setKeyPhrase('');
  };

 
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [key]: true });
    toast({
      title: "Items copied successfully!",
      description: "",
    })
    setTimeout(() => setCopiedStates({ ...copiedStates, [key]: false }), 2000);
  };

  const togglePrivateKeyVisibility = (index) => {
    setShowPrivateKey((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className='text-white text-3xl my-auto'>
      <Card className="w-full max-w-2xl mx-auto relative">
        {/* Blockchain logo */}
        {theme === 'dark' && (
          <div className="absolute top-0 right-0 left-0 flex justify-center items-center opacity-35 pointer-events-none">
            {selectedBlockchain === 'Solana' && <img src={solLogo} alt="Solana Logo" className="h-36" />}
            {selectedBlockchain === 'Ethereum' && <img src={ethLogo} alt="Ethereum Logo" className="h-36" />}
          </div>
        )}
        {theme === 'light' && (
          <div className="absolute top-0 right-0 left-0 flex justify-center items-center opacity-25 pointer-events-none">
            {selectedBlockchain === 'Solana' && <img src={solLogo} alt="Solana Logo" className="h-36" />}
            {selectedBlockchain === 'Ethereum' && <img src={ethLogo} alt="Ethereum Logo" className="h-36" />}
          </div>
        )}

        <CardHeader className="relative z-10">  
          <CardTitle className="text-center">{selectedBlockchain} Wallet</CardTitle>
          <CardDescription className="text-center font-serif">Add wallets for {selectedBlockchain}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {wallets.length === 0 && (
            <div>
              <div className="space-y-2">
                <Label htmlFor="keyPhrase">Enter Mnemonic Phrase (optional)</Label>
                <Input
                  id="keyPhrase"
                  value={keyPhrase}
                  onChange={(e) => setKeyPhrase(e.target.value)}
                  placeholder="Enter your mnemonic phrases or leave blank to auto-generate"
                />
              </div>

              <Button onClick={generateWallet} className="w-full">
                Generate Wallet
              </Button>
            </div>
          )}

          {wallets.length > 0 && (
            <div className="space-y-4">
              <div className='flex justify-between'>
              <Button className="h-8 w-10"
                  onClick={() => copyToClipboard(mnemonics, 'mnemonics')} 
                  title="Save your Mnemonics for future" 
                >
                  <FaRegCopy size={28} />
                </Button>
                <div className='flex justify-between gap-2'>
                  <Button onClick={generateWallet} className="">
                    Add Wallet
                  </Button>
                  <Button onClick={DeleteWallets} className="bg-red-600">
                    Clear
                  </Button>
                </div>
              </div>
              
              {wallets.map((wallet, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className='flex justify-between'>
                      <CardTitle>Wallet {index + 1}</CardTitle>
                      <button className='items-end text-red-300' onClick={() => deleteAWallet(index)}>
                        <MdDelete size={22} />
                      </button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label>Public Key:</Label>
                      <Input value={wallet?.publicKey} readOnly />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(wallet?.publicKey, `publicKey${index}`)}
                      >
                        {copiedStates[`publicKey${index}`] ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label>Private Key:</Label>
                      <Input
                        type={showPrivateKey[index] ? "text" : "password"}
                        value={wallet?.privateKey}
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
                        onClick={() => copyToClipboard(wallet?.privateKey, `privateKey${index}`)}
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
  );
}
