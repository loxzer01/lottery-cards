import {useState,useEffect, useRef} from "react";
import { ethers } from "ethers";
import abiUSDT from "../../../../abi/USDT.json";
import POOL from "../../../../abi/POOL.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import "./swap.header.css";
const swap_token = {
    a: {
        icon:window.location.origin + "/img/icons/meta-mask.png",
        name: "MetaMask",
        symbol: "USDT",
    },
    b:{
        icon:window.location.origin + "/favicon.png",
        name: "LotteryCard",
        symbol: "ILUT"
    }
}
const addressUSDT = "0x3bBAe55Ac4dd797F40D1B4C27b5A5F10EC90018C";
const addressPOOL = "0xaC92D5726c464d4D4dE05c944E6Ae0e58eF048fC";
async function contracts(address, abi) {
    const provider = new ethers.providers.Web3Provider(window[localStorage.getItem("walletConnect")]);
    const signer = provider.getSigner();
    return new ethers.Contract(address,abi,signer);
}
const array_option = [
    {
        amount: 10,
    },
    {
        amount: 25,
    },
    {
        amount: 50,
    },
    {
        amount: 100,
    },{
        amount: 500,
    },{
        amount: "MAX",
    }
]
const Swap = ({setIsSwap})=>{
    const [option, setOption] = useState(null);
    const [account, setAccount] = useState(localStorage.getItem("account"));
    const [isApprove, setIsApprove] = useState(false);
    const [ isWithdraw, setIsWithdraw ] = useState(false);
    const [amount, setAmount] = useState(0);
    const [isTo, setIsTo] = useState(["a","b"]);
    const [balance, setBalance] = useState({
        a: 0,
        b: 0,
    });
    const refInput = useRef(null);

    //contract
    const _BALANCE = async () => {
        let contract = await contracts(addressPOOL, POOL);
        await contract.balanceOf(account).then((result) => {
            let array_result = result.toString().split(",");
            let array_is = {
                b: Number(array_result[0])>0?Number(array_result[0])/10**18:array_result[0],
                a: Number(array_result[1])>0?Number(array_result[1])/10**18:array_result[1]
            }
            let array_balance = {
                a: String(Number(array_result[0])/10**18),
                b: String(Number(array_result[1])/10**18)
            }
          setBalance(array_balance);
        });
    }
    const _isApprove = async () => {
        let contract = await contracts(addressUSDT, abiUSDT);
        let result = await contract.allowance(account, addressPOOL)
        if(result.toString() === "0"){
            setIsApprove(false);
        }else{
            setIsApprove(true);
        }
    }


    const fixed_value = (value)=>{
        return value>0?value.toFixed(2):value;
    }
    const approve = async () => {
        try{
          let contract = await contracts(addressUSDT, abiUSDT);
          let amount = ethers.utils.parseEther(String(1000000000));
          await contract.approve(addressPOOL, amount)
        }catch(e){
          console.log(e.messange)
          // messange(e.message,"red");
        }
    }
    const swap = async () => {
        try{
            let contract = await contracts(addressPOOL, POOL);
            let amountEdit = ethers.utils.parseEther(String(amount));
            await contract.swap(account,amountEdit,isWithdraw);
        }catch(e){
            console.log(e)
            // messange(e.message,"red");
        }
    }

    useEffect(()=>{
        let val = setInterval(()=>{
            _BALANCE();
            _isApprove();
            setAccount(localStorage.getItem("account"));
        }
        ,3000)
        return ()=>clearInterval(val);
    },[])

    return (
        <div className="swap_container">
            <span className="space"onClick={()=>setIsSwap(false)}></span>
            <div className="swap_item">
                <span className="x"onClick={()=>setIsSwap(false)}>x</span>
                <p className="title">Swap to Token</p>
                <p>Here you can move your USDT to ILUT.</p>
                <p className="yellow">1 USDT = 1 ILUT</p>
                <div className="swap_item_swap">
                    <div className="swap_">
                        <img src={swap_token[isTo[0]].icon} width={20} alt="icon" />
                        <ul>
                            <li className="fist">From <span>{swap_token[isTo[0]].name}</span></li>
                            <li className="seconds">Balance <span>{fixed_value(balance[isTo[0]]) +" "+ swap_token[isTo[0]].symbol}</span></li>
                        </ul>
                    </div>
                    <button className="change_to" onClick={()=>{
                        const array = [isTo[1],isTo[0]];
                        setIsWithdraw(!isWithdraw);
                        setIsTo(array);
                    }}><FontAwesomeIcon icon={faShuffle} width={40} color="#0d8bdf"/></button>
                    <div className="swap_">
                        <img src={swap_token[isTo[1]].icon} width={20} alt="icon" />
                        <ul>
                            <li className="fist">To <span>{swap_token[isTo[1]].name}</span></li>
                            <li className="seconds">Balance <span>{fixed_value(balance[isTo[1]]) +" "+ swap_token[isTo[1]].symbol}</span></li>
                        </ul>
                    </div>
                </div>
                <div className="swap_info">
                    <p className="title warnning">WINNING IN WEB3!</p>
                    <p>Swaps are Instant.</p>
                    <p>You'll have funds in a few seconds.</p>
                </div>
                <div className="swap_change">
                    <input min={1} type="number" placeholder="~$0" onChange={(event)=>{
                        setAmount(event.target.value);
                    }} ref={refInput}/>
                </div>
                <ul className="swap_option">
                        {
                        array_option.map((item,index)=>{
                            const amountLet = item.amount === "MAX"?balance[isTo[0]]:item.amount;
                            return (
                                <li key={index} onClick={()=>{
                                    setOption(amountLet)
                                    refInput.current.value = amountLet;
                                    setAmount(amountLet);
                                }}>{item.amount}</li>
                            )
                        })
                        }
                 </ul>
                 {!amount?<button className="btn_swap disabled" disabled>Enter an amount</button>
                 :
                 amount>balance[isTo[0]]?<button className="btn_swap disabled" disabled>Insufficient {swap_token[isTo[0]].symbol} balance</button>:
                 !isApprove?
                        <button className="btn_swap approve" onClick={()=>{
                            approve();
                        }
                        }>Enable USDT</button>
                        :
                        <button className="btn_swap swap" onClick={()=>{
                            swap();
                        }
                        }>Swap</button>
                }
            </div>
        </div>
    )
}

export default Swap;