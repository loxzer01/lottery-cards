import { useState } from 'react';
import "./time.main.css";
import { ethers } from 'ethers';
import DAPP from '../../../../abi/DAPP.json';

const addressDAPP = "0x9144D6921af0efE90B2b4A8Be3EF908C35c09A8a";
const Newtworks =  {
    prod: "https://bsc-dataseed.binance.org/",
    test: "https://rpc2.sepolia.org"
}
async function contracts(address, abi) {
    const provider = new ethers.providers.JsonRpcProvider(Newtworks.test);
    const wallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
    const contract = new ethers.Contract(address, abi, wallet);
    return contract;
}

const Time = () => {


    
    return (
        <main className='container_times'>
            <h2>BATCH #{0}</h2>

        
        </main>
    );
}

export default Time;