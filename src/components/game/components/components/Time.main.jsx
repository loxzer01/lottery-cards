import { useState } from 'react';
import "./time.main.css";
import { ethers } from 'ethers';
import DAPP from '../../../../abi/DAPP.json';

const addressDAPP = "0xA96A16878ef0010b7C6cD7d92BE52C9d9BDe87BE";
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