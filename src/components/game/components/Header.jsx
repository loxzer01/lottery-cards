import {useEffect, useState} from "react";
import { ethers } from "ethers";
import "./Header.css";
import Swap from "./components/Swap.header";
import abiUSDT from "../../../abi/USDT.json";
import POOL from "../../../abi/POOL.json";
const addressUSDT = "0x3bBAe55Ac4dd797F40D1B4C27b5A5F10EC90018C";
const addressPOOL = "0xaC92D5726c464d4D4dE05c944E6Ae0e58eF048fC";
async function contracts(address, abi) {
    const provider = new ethers.providers.Web3Provider(window[localStorage.getItem("walletConnect")]);
    const signer = provider.getSigner();
    return new ethers.Contract(address,abi,signer);
}
let account = localStorage.getItem("account");
const Header = ()=>{
    const [balance, setBalance] = useState([0,0]);
    // const [account, setAccount] = useState(localStorage.getItem("account"));
    const _BALANCE = async () => {
        let contract = await contracts(addressPOOL, POOL);
        await contract.balanceOf(account).then((result) => {
          setBalance([String(result[0].toString()/10**18),String(result[1].toString()/10**18)]);
        });
    }
    const [isSwap, setIsSwap] = useState(false);
    function fixed_value(value){
        return value>0?value.toFixed(2):value;
    }
    function fixed_value_k_m(value){
        let text = fixed_value(Number(value));
        if(value>999999){
            text = (value/1000000).toFixed(2)+" M";
        }else if(value>999){
            text = (value/1000).toFixed(2)+" K";
        }
        return text;

    }
    useEffect(()=>{
        _BALANCE();
    },[account])
    useEffect(()=>{
        const val = setInterval(() => {
            _BALANCE();
            account = localStorage.getItem("account");
        }
        , 3000);
        return () => clearInterval(val);
    },[])
    
    return (
        <>
        {
            isSwap?<Swap setIsSwap={setIsSwap}/>:null}
        <header className="header_game">
            <div>
                <h2>Lottery<span>Card</span></h2>
            </div>
            <div className="mult" onClick={()=>{setIsSwap(true)}}>
                <img src="/favicon.png" alt="icon" width={18}/>
                {
                    fixed_value_k_m(balance[0])
                }
                <button onClick={()=>{setIsSwap(true)}}>
                    <span>+</span>
                </button>
            </div>
        </header>
        </>
    )
}

export default Header;