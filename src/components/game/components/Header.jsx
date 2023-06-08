import {useEffect, useState} from "react";
import { ethers } from "ethers";
import "./Header.css";
import Swap from "./components/Swap.header";
import abiUSDT from "../../../abi/USDT.json";
import POOL from "../../../abi/POOL.json";
const addressUSDT = "0x394653e1A30053676E8F57D005Ff36dB8d582989";
const addressPOOL = "0xeD847D8Ed971BE95B3AbD02F31C54A93457932c0";
async function contracts(address, abi) {
    const provider = new ethers.providers.Web3Provider(window[localStorage.getItem("walletConnect")]);
    const signer = provider.getSigner();
    return new ethers.Contract(address,abi,signer);
}
const Header = ()=>{
    const [balance, setBalance] = useState([0,0]);
    const [account, setAccount] = useState(localStorage.getItem("account"));
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
        let text = value;
        if(value>999999){
            text = (value/1000000).toFixed(2)+" M";
        }else if(value>999){
            text = (value/1000).toFixed(2)+" K";
        }
        return text;

    }
    useEffect(()=>{
        const interval = setInterval(() => {
            setAccount(localStorage.getItem("account"));
            _BALANCE();
        }
        , 3000);
        return () => clearInterval(interval);
    },[])
    useEffect(()=>{
        _BALANCE();
    },[account])

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