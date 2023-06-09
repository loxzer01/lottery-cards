import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { ethers } from 'ethers';
import "./cards.main.css";
import DAPP from '../../../../abi/DAPP.json';
import POOL from '../../../../abi/POOL.json';
const imgs = [
    '/img/card/1.png',
    '/img/card/2.png',
    '/img/card/3.png',
    '/img/card/4.png',
    '/img/card/5.png',
    '/img/card/6.png',
    '/img/card/7.png',
    '/img/card/8.png',
    '/img/card/9.png',
    '/img/card/10.png',
    '/img/card/11.png',
    '/img/card/12.png',
]
const addressDAPP = "0x9144D6921af0efE90B2b4A8Be3EF908C35c09A8a";
const addressPOOL = "0xaC92D5726c464d4D4dE05c944E6Ae0e58eF048fC";
const Newtworks =  {
    prod: "https://bsc-dataseed.binance.org/",
    test: "https://rpc2.sepolia.org"
}
async function contracts2(address, abi) {
    const provider = new ethers.providers.JsonRpcProvider(Newtworks.test);
    const wallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
    const contract = new ethers.Contract(address, abi, wallet);
    return contract;
}
async function contracts(address, abi) {
    const provider = new ethers.providers.Web3Provider(window[localStorage.getItem("walletConnect")]);
    const signer = provider.getSigner();
    return new ethers.Contract(address,abi,signer);
}
let time = 0;
const Cards = ({
    selects,
    setSelects,
}) => {
    const [amount_cards, setAmount_cards] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
    const [account, setAccount] = useState(localStorage.getItem("account"));
    // const [time, setTime] = useState(0);
    const [time_now, setTime_now] = useState(0);
    const [batch, setBatch] = useState(0);
    const [amount, setAmount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [ message, setMessage ] = useState("");
    const refAmount = useRef();
    const _now_time = () => {
        // ver tiempo actual y cuanto falta para terminar _time
        const now = Number((Date.now()/1000).toFixed())
        // console.log(now)
        const distance = time-now;
        setTime_now(distance);
    }
    const id_batch = async () => {
        // ver el id del batch actual VIEW_BATCH_ID
        let contract = await contracts(addressDAPP, DAPP);
        const tx = await contract.VIEW_BATCH_ID();
        setBatch(tx.toString());
    }
    const viewTime = async () => {
        // ver el tiempo del batch actual VIEW_TIME
        let contract = await contracts(addressDAPP, DAPP);
        const tx = await contract.VIEW_TIME();
        time = (Number(tx.toString()))
    }
    const _BALANCE = async () => {
        let contract = await contracts(addressPOOL, POOL);
        await contract.balanceOf(account).then((result) => {
            let array_result = result.toString().split(",");
            let array_is = {
                b: Number(array_result[0])>0?Number(array_result[0])/10**18:array_result[0],
                a: Number(array_result[1])>0?Number(array_result[1])/10**18:array_result[1]
            }
            // let array_balance = {
            //     a: String(Number(array_result[0])/10**18),
            //     b: String(Number(array_result[1])/10**18)
            // }
          setBalance(array_is["a"]);
        });
    }
    const play = async () => {
        // ver el tiempo del batch actual VIEW_TIME_FOR_BATCH
        try{        
        let contract = await contracts(addressDAPP, DAPP);
        const amountEdit = ethers.utils.parseUnits(amount.toString(), 18);
        const tx = await contract.BUY_TICKET(selects, amountEdit);
        console.log(tx);
        setTimeout(() => {
            setSelects([]);
            refAmount.current.value = "";
        }, 2000);}
        catch(e){
            setMessage(e.message);
            setTimeout(() => {
                setMessage("");
            }
            , 5000);
        }
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
    const pool_cards = async () => {
        let contract = await contracts2(addressDAPP, DAPP);
        if(amount<balance[0]){
            return;
        }
        const array =  amount_cards.map(id=>{
            return (async ()=> await contract.VIEW_AMOUNT_FOR_BATCH(id))();
        });
        const xEdit = Number(array.toString())?Number(array.toString()):0;
        setAmount_cards(xEdit);
        
    }
    useEffect(()=>{
        let interval = setInterval(() => {
            pool_cards();
            id_batch();
            _BALANCE();
            setAccount(localStorage.getItem("account"));
            viewTime();
        }
        , 3000);
        return () => clearInterval(interval);
    },[])
    useEffect(()=>{
        let interval = setInterval(() => {
            _now_time()
        }
        , 500);
        return () => clearInterval(interval);
    },[])
    return (
        <main className='container_cards'>
            <div className='container_card_time'>
                {
                    time_now > 0 ?
                    <div className='card_time_div'>
                        <p className='card_time_span nex'>Batch: #{batch}</p>
                        <p className='card_time_span'>Ends in: {Number(time_now)} seg</p>
                    </div>
                    : 
                    <div className='card_time_div'>
                        <p className='card_time_span nex'>Batch: #{batch}</p>
                        <p className='card_time_span'>Ends in: Finished</p>
                    </div>
                }   
            </div>
            <div className='container_cards_cards'>
            {
                imgs.map((img, i) => {
                    return (
                        <div key={i} className={`card_div ${selects.some((x)=>x===i)?'active':""}`} onClick={()=>{
                            if (selects.some((x)=>x===i)){
                                setSelects(selects.filter(item=>item!==i));
                                return;
                            }else{
                                setSelects([...selects, i]);
                            }
                            console.log(selects);
                        }
                        }>
                            <img src={img} alt='card' />
                            <div className='card_span'>
                                <span>Pool Global: {fixed_value_k_m(amount_cards[i])}</span>
                                <span>Your: {fixed_value_k_m(amount_cards[i])} </span>
                            </div>
                        </div>
                    )
                })
            }
            </div>
            <div className='container_button'>
                <div className='clase1'>
                    {
                        message.length>0?<p className="text-right">el valor maximo es 10</p>
                        :null
                    }
                    <img src="/favicon.png" alt="icon" width={25} />
                    <input min={1} type="number" className='btn_amount' ref={refAmount} placeholder='~$0'
                    onChange={
                        (e)=>{
                            setAmount(e.target.value);
                        }
                    }/>
                </div>
                {
                    amount>0?
                    selects.length>0?
                    <button className='button'
                onClick={play}>
                    Play
                    <FontAwesomeIcon icon={faPlay}/>
                </button>
                : <button className='button disabled' disabled>
                    Select 1 or more cards
                </button>
                : <button className='button disabled' disabled>
                    Add quantity
                </button>

                }
            </div>
        </main>
    );
}

export default Cards;