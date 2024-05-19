import React, { useEffect, useState, useRef } from 'react';
import ConnectWalletIcon from '../Icon/ConnectWalletIcon';
import { getInscriptions } from '../utils/inscription';
import { IUtxo, getUtxos } from '../utils/utxo';  // Ensure this line correctly points to the file location
import { networks, Network } from 'bitcoinjs-lib';
import { mintToken } from '../utils/mint'; // Ensure this import points to where your mintToken function is defined


const ConnectWalletBtn = () => {
  const [unisatInstalled, setUnisatInstalled] = useState(false);
  const [address, setAddress] = useState('');
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  const [network, setNetwork] = useState<Network>(networks.bitcoin); // Changed from string to Network type and default to bitcoin network

  // Check if UniSat is installed
  useEffect(() => {
    if (typeof window.unisat !== 'undefined') {
      setUnisatInstalled(true);
    } else {
      setUnisatInstalled(false);
      console.warn("UniSat Wallet is not installed!");
    }
  }, []);

  const connectWallet = async () => {
    if (!unisatInstalled) {
      console.warn("Attempted to connect without UniSat Wallet installed.");
      return;
    }
    try {
      const result = await window.unisat.requestAccounts();
      if (result.length > 0) {
        setConnected(true);
        setAccounts(result);
        setAddress(result[0]);
        await fetchWalletDetails(result[0]);
      } else {
        setConnected(false);
      }
    } catch (error) {
      console.error('Error connecting to UniSat Wallet:', error);
    }
  };

  const fetchWalletDetails = async (accountAddress: string) => {
    const publicKey = await window.unisat.getPublicKey();
    const balance = await window.unisat.getBalance();
    const networkName = await window.unisat.getNetwork();
    const networkConfig = networkName === 'testnet' ? networks.testnet : networks.bitcoin; // Adjusted to set the correct network configuration based on the name

    setPublicKey(publicKey);
    setBalance(balance);
    setNetwork(networkConfig); // Updated to use the network configuration object
  };

  const fetchInscriptions = async () => {
    if (!address) {
      console.warn("Wallet address is not available.");
      return;
    }
    try {
      const inscriptions = await getInscriptions(address, network); // Fixed the type issue by ensuring 'network' is of type Network
      console.log(inscriptions); // Handle the fetched inscriptions as needed
    } catch (error) {
      console.error("Error fetching inscriptions:", error);
    }
  };
  
    // Add state to hold UTXOs
    const [utxos, setUtxos] = useState<IUtxo[]>([]);

    // Function to fetch UTXOs
    const fetchUtxos = async () => {
      if (!address) {
        console.warn("Wallet address is not available.");
        return;
      }
      try {
        const fetchedUtxos = await getUtxos(address, network);
        console.log('UTXOs:', fetchedUtxos);
        setUtxos(fetchedUtxos);
      } catch (error) {
        console.error("Error fetching UTXOs:", error);
      }
    };

// Within your ConnectWalletBtn.tsx or similar component
const handleMint = async () => {
  if (publicKey && address) {
    await mintToken(publicKey, address);
  } else {
    console.warn("Public Key or Address missing!");
  }
};

  return (
    <div className='flex justify-center items-center w-[220px] px-[15px] pt-[18px] pb-[18px] rounded-[15px] border border-[#494459] gap-2 cursor-pointer'>
      <ConnectWalletIcon />
      <div onClick={connectWallet} className='text-white font-League-Spartan text-[23px] cursor-pointer mt-2'>
        {connected ? (
          <div>
            <p>Address: {address}</p>
            <p>Network: {network === networks.bitcoin ? 'bitcoin' : 'testnet'}</p> {/* Adjusted to display the network name based on the network configuration */}
            <p>Balance: {balance.total} (Confirmed: {balance.confirmed}, Unconfirmed: {balance.unconfirmed})</p>
            <p>Public Key: {publicKey}</p>
            <button onClick={fetchInscriptions} className="fetch-inscriptions-btn">
              Fetch Inscriptions
            </button>
            <button onClick={fetchUtxos} className="fetch-utxos-btn">Fetch UTXOs</button>
            <button onClick={handleMint}>Mint Token</button>

          </div>
        ) : (
          'Connect Wallet'
        )}
      </div>
    </div>
  );

};

export default ConnectWalletBtn;