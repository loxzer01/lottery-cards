import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import "./cards.main.css";
import DAPP from '../../../../abi/DAPP.json';
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
const addressDAPP = "0xeD847D8Ed971BE95B3AbD02F31C54A93457932c0";

async function contracts(address, abi) {
    const provider = new ethers.providers.Web3Provider(window[localStorage.getItem("walletConnect")]);
    const signer = provider.getSigner();
    return new ethers.Contract(address,abi,signer);
}

const Cards = ({
    selects,
    setSelects
}) => {
    const [amount_cards, setAmount_cards] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
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
        let contract = await contracts(addressDAPP, DAPP);
        const tx_array = []
        amount_cards.forEach(async id=>{
            const tx = await contract.VIEW_AMOUNT_FOR_BATCH(id);
            tx_array.push(tx);
        });    
        const txs = await Promise.all(tx_array);
        setAmount_cards(txs);
        
    }
    useEffect(()=>{
        let interval = setInterval(() => {
            pool_cards();
        }
        , 3000);
        return () => clearInterval(interval);
    },[])
    return (
        <main className='container_cards'>
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
                            <span className='card_span'>{fixed_value_k_m(0)} ILUT</span>
                        </div>
                    )
                })
            }
        </main>
    );
}

export default Cards;