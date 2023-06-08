import abiUSDT from "../../abi/USDT.json";
import abiDapp from "../../abi/DAPP.json";
import "../../css/style.css";
import {useEffect, useLayoutEffect, useState} from "react";
import { ethers } from "ethers";

const addressUSDT = "0x55d398326f99059fF775485246999027B3197955";
const addressDAPP = "0xaC92D5726c464d4D4dE05c944E6Ae0e58eF048fC";
const addressOwner = "0x772E13dfA48ace1c3C68763A0a199d19219f2E09";
// const addressOwner = "0xEc7e933Ba03016fdAe786291f2655f074fb591e1";

const urlRef = window.location.href.split("?ref=")[1]?.split("#")[0]?.split("&")[0];


function Invest({
    account,
    messange,
}) {

  const [ isApproveUSDT, setIsApproveUSDT ] = useState(false);
  const [ indexCalculate, setIndexCalculate ] = useState(0);
  const [ Amount, setAmount ] = useState(0);
  const [ balance, setBalance ] = useState(0);
  const [ balanceLocked, setBalanceLocked ] = useState(0);
  const [ ref, setRef ] = useState(0);
  const [ valueWithdraw, setValueWithdraw ] = useState(0);
  const [ myBatch, setMyBatch ] = useState([]);
  const [ nowTime, setNowTime ] = useState(0);
  const [ gainRef, setGainRef ] = useState(0);
  const day = [7,14,30]
  const [ calculate, setCalculate ] = useState(0);

  const [ TIME_LOCKED, setTIME_LOCKED ] = useState(0);
  const [ TIME_PROFIT, setTIME_PROFIT ] = useState(0);
  const [ timeDisable, setTimeDisable ] = useState(0);
  const [ LOCK_BALANCE, setLOCK_BALANCE ] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  async function contracts(address, abi) {
    const provider = new ethers.providers.Web3Provider(window[localStorage.getItem("walletConnect")]);
    const signer = provider.getSigner();
    return new ethers.Contract(address,abi,signer);
  }
  const btnDisable = () => {
    setTimeDisable(5);
  }
  const _BALANCE = async () => {
    let contract = await contracts(addressDAPP, abiDapp);
    await contract._BALANCE(account).then((result) => {
      setBalance(String(result.toString()/10**18).match(/^-?\d+(?:\.\d{0,4})?/)[0]);
    });
  }
  const _BALANCE_LOCKED = async () => {
    let contract = await contracts(addressDAPP, abiDapp);
    await contract._BALANCE_LOCKED(account).then((result) => {
      setBalanceLocked(String(result.toString()/10**18).match(/^-?\d+(?:\.\d{0,4})?/)[0]);
    });
  }
  const MY_BATCH_ALL = async () => {
    let contract = await contracts(addressDAPP, abiDapp);
    let result = await contract._MY_BATCH_ALL(account)
    setMyBatch(result.map((item,index) => {
      return [...item.toString().split(","), index];
    }).reverse());
  }
  const _LOCK_BALANCE = async () => {
    let contract = await contracts(addressDAPP, abiDapp);
    await contract._LOCK_BALANCE(account).then((result) => {
      setLOCK_BALANCE(result.toString());
    }
    );
  }
  const GET_REF = async () => {
    let contract = await contracts(addressDAPP, abiDapp);
    await contract._REF_TO_ADDRESS(account).then((result) => {
      setRef(result.toString());
    }
    );
  }//window
  const gain_ref = async () => {
    let contract = await contracts(addressDAPP, abiDapp);
    await contract._GAIN_REF(account).then((result) => {
      setGainRef(String(result.toString()/10**18).match(/^-?\d+(?:\.\d{0,4})?/)[0]);
    }
    );
  }

  const _TIME_PROFIT = async () => {
    let contract = await contracts(addressDAPP, abiDapp);
    await contract._TIME_PROFIT().then((result) => {
      setTIME_PROFIT(result.toString());
    });
  }
  const _TIME_LOCK = async () => {
    let contract = await contracts(addressDAPP, abiDapp);
    await contract._TIME_LOCK().then((result) => {
      setTIME_LOCKED(result.toString());
    });
  }
  const isApprove= async () => {
    let contract = await contracts(addressUSDT, abiUSDT);
    let result = await contract.allowance(account, addressDAPP)
    if(result.toString() === "0"){
      setIsApproveUSDT(false);
    }else{
      setIsApproveUSDT(true);
    }
    
  }

  const invest = async () => {
    try{
      let contract = await contracts(addressDAPP, abiDapp);
      let amount = ethers.utils.parseEther(String(Amount));
      await contract.INVETS(amount, String(urlRef===undefined?0:urlRef)).then((result) => {
        console.log(result);
      })
    }catch(e){
      messange(e.message,"");
    }
  }

  const approve = async () => {
    try{
      let contract = await contracts(addressUSDT, abiUSDT);
      let amount = ethers.utils.parseEther(String(1000000000));
      await contract.approve(addressDAPP, amount).then((result)=>result?setTimeout(invest,4000):""
      )
    }catch(e){
      console.log(e.messange)
      // messange(e.message,"red");
    }
  }
  
  const copy = () => {
    const text = document.getElementById("copy");
    text.disabled = false;
    text.value = text.placeholder;
    text.select();
    document.execCommand("copy");
    messange("Copied to clipboard", "green");
    text.disabled = true;
    text.value = "";
  }
  

  const farm = async (index) => {
    try{
      let contract = await contracts(addressDAPP, abiDapp);
      await contract.PROFIT(index);
    }catch(e){
      messange(e.message.split('"')[1], "red");
    }
  }
  const time_lock = (time,secound) => {
    let newTime = Number(time)+Number(secound) - nowTime;
    newTime = newTime < 0 ? 0 : newTime;
    return newTime;
  }
  const reinvest = async (index) => {
    try{
      let contract = await contracts(addressDAPP, abiDapp);
      await contract.REINVETS(index);
    }catch(e){
      messange(e.message.split('"')[1], "red");
    }
  }
  
  const REINVERTS_BALANCE = async () => {
    try{
      let contract = await contracts(addressDAPP, abiDapp);
      let amount = ethers.utils.parseEther(String(valueWithdraw));
      await contract.REINVERTS_BALANCE(amount);
    }catch(e){
      // console.log(e.message.split('"')[1]);
      messange(e.message.split('"')[1], "red");
    }
  }
  const _isOwner = ()=>{
    setIsOwner(account.toUpperCase() == addressOwner.toUpperCase())
  }

  useEffect(()=>{
    const interval = setInterval(() => {
      _BALANCE();
      _BALANCE_LOCKED();
      MY_BATCH_ALL();
      GET_REF();
      isApprove();
      gain_ref();
      _TIME_PROFIT();
      _TIME_LOCK();
      _LOCK_BALANCE();
      _isOwner();
    }, 3000);
    return () => clearInterval(interval);
  },[account,balance])
  useEffect(()=>{
    const interval = setInterval(() => {
      setNowTime(Math.floor(Date.now()/1000));
    }
    , 1000);
    return () => clearInterval(interval);
  },[])
  useEffect(()=>{
    const interval = setInterval(() => {
      if(timeDisable > 0){
        setTimeDisable(timeDisable-1);
      }
    }, 1000);
    return () => clearInterval(interval);
  },[timeDisable])
  const withdraw = async () => {
    try{
      let contract = await contracts(addressDAPP, abiDapp);
      let amount = ethers.utils.parseEther(String(valueWithdraw));
      await contract.WITHDRAW(amount);
    }catch(e){
      // console.log(e.message.split('"')[1]);
      messange(e.message.split('"')[1], "red");
    }
  }


  return (
    <>
        {/*Panel de inversiones*/}
        <div className="container-fluid pb-5 pt-5 align-items-center investment">
          {/*Nav*/}
          <div className="row">
            <div className="col-12">
              <div className="container">
                <div className="row gap-md-0 gap-3">
                  {/*panel de inversion*/}
                  <div className="col-12 col-md-6">
                    <div className="card1">
                      <ul>
                        <li><h4 className="mb-4 c-blanco w-500">Investment, wait and take you return <br /> in this seccion</h4></li>
                        <li><p className="mb-2 t-sma c-blanco2 w-500">Calculate your earnings</p></li>
                        <li className="mb-4 mt-3"><ul className="l-h">
                            <li onClick={()=>setIndexCalculate(0)} className={`btn-3  ${indexCalculate===0?"bt-active":""} c-blanco mr-3`}><a>1 Week </a></li>
                            <li onClick={()=>setIndexCalculate(1)} className={`btn-3  ${indexCalculate===1?"bt-active":""} c-blanco mr-3`}><a>2 Week </a></li>
                            <li onClick={()=>setIndexCalculate(2)} className={`btn-3  ${indexCalculate===2?"bt-active":""} c-blanco mr-3`}><a>1 Month</a></li>
                          </ul></li>
                        <li className="mb-3"><div>
                            <ul className="l-h">
                              <li className="mr-3"><input type="number" className="inp-1" placeholder={0.00} onChange={
                                (e)=>{
                                  let value = (e.target.value).replace(/[^0-9.]/g, '');
                                  let free = (value * 82 / 10000) * 28/100;
                                  let result = (value * 82 / 10000)-free;
                                  setCalculate((result * day[indexCalculate]).toFixed(2));
                                }
                              }/></li>
                            </ul>
                          </div></li>
                        <li className="mb-5"><ul>
                            <li><p className="w-600 c-blanco3">Lock Period: <span style={{fontWeight: 400}}> {indexCalculate===0?"1 Week":indexCalculate==1?"2 Week":"1 Month"}</span></p></li>
                            <li><p className="w-600 c-blanco3">ROI: <span style={{fontWeight: 400}}> 0.82% Per Lot</span></p></li>
                            <li><p className="w-600 c-blanco3">Comision: <span style={{fontWeight: 400}}> 28% Per lot</span></p></li>
                            <li><p className="w-600 c-blanco3">Result: <span style={{fontWeight: 400}}> {calculate} USDT</span></p></li>
                          </ul></li>
                        <li className="mb-3"><div>
                            <ul className="l-h">
                              <li className="mr-3"><input type="number" className="inp-1" placeholder={0.00} onChange={(e)=>setAmount(e.target.value)}/></li>
                              {/* <button onClick={()=>{
                                  if(!isApproveUSDT){
                                    setTimeout(approve,100);
                                    btnDisable();
                                  }else{
                                    invest();
                                    btnDisable();
                                  }
                                }}
                                className="btn-5 c-blanco mr-3" disabled={timeDisable===0?false:true}>{!isApproveUSDT?"Approved":"Invest"}</button> */}
                            </ul>
                          </div></li>
                        <li><p className=" t-sma c-blanco3 w-500">* The data expressed in the calculator will only be accurate if the user makes constant investments of the same amount in each lot, every 24 hours.</p></li>
                      </ul>
                    </div>
                  </div>
                  {/*panel de inversion*/}
                  <div className="col-12 col-md-6">
                    <ul>
                      {/*tarjeta*/}
                      <li className="mb-3">
                        <div className="card1">
                          <ul>
                            <li><p className="mb-2 t-sma c-blanco3 w-500">Locked Balance <i className="bi bi-lock" /></p></li>
                            <ul className="l-h">
                              <li><h4 className="mb-4 c-blanco w-500">{balanceLocked} USDT </h4></li>
                            </ul>
                          </ul>
                        </div>
                      </li>
                      {/*tarjeta*/}
                      <li className="mb-3">

                        <div className="card1">
                          <ul>
                            <li><p className="mb-2 t-sma c-blanco3 w-500">Available Balance <i className="bi bi-check" /></p></li>
                            <li><h4 className="mb-4 c-blanco w-500">{balance} USDT <span className="mb-2 t-sma c-blanco3 w-500"> + {gainRef} USDT (Referal Earns)</span> </h4></li>
                            <li className="mb-3"><div>
                                <ul className="l-h">
                                  <li className="mr-3"><input type="number" className="inp-1" placeholder={0.00}
                                  onChange={(e)=>setValueWithdraw(e.target.value)}
                                  /></li>
                                  {
                                    !(isOwner || time_lock(LOCK_BALANCE,TIME_PROFIT)<=0)?
                                    <p className="c-blanco2">{`${Math.floor(time_lock(LOCK_BALANCE,TIME_PROFIT)/3600)}hours ${Math.floor(time_lock(LOCK_BALANCE,TIME_PROFIT)/60%60)}mins ${time_lock(LOCK_BALANCE,TIME_PROFIT)%60}secs`}</p>
                                    :<button onClick={()=>{withdraw(); btnDisable()}} disabled={timeDisable===0?false:true} className="btn-5 c-blanco mr-3">Withdraw</button>
                                  }
                                <button onClick={()=>{
                                  REINVERTS_BALANCE();
                                  btnDisable();
                                }} 
                                className="btn-4 c-blanco mr-3" disabled={timeDisable===0?false:true}>Re-Invest</button>
                                </ul>
                              </div></li>
                          </ul>
                        </div>
                      </li>
                      {/*tarjeta*/}
                      <li className="mb-3">
                        <div className="card1">
                          <ul>
                            <li><p className="mb-2 t-sma c-blanco3 w-500"> Refers <i className="bi bi-person" /></p></li>
                            <li className="mb-3"><div>
                                <ul className="l-h d-flex flex-wrap flex-wrap">
                                  <li className="mr-3 w-100"><input type="text" className="inp-1" id="copy" disabled placeholder={`${window.location.origin}/?ref=${ref}`} /></li>
                                  <li className="btn-4 c-blanco mr-3" onClick={copy}><a>Copy to clipboard</a></li>
                                </ul>
                              </div>
                            </li>
                            <li><h4 className="mb-4 c-blanco w-500">{gainRef} USDT </h4></li>
                            <li className>
                              <ul>
                                <li><p className="w-600 c-blanco3">Level 1: <span style={{fontWeight: 400}}> 10%</span></p></li>
                                <li><p className="w-600 c-blanco3">Level 2: <span style={{fontWeight: 400}}> 5%</span></p></li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <div className="card1">
                        <h3 className="mb-2 t-sma c-blanco3 w-500">Your Batch</h3>
                        <ul className="d-flex my_batch">
                          {
                            myBatch.map((item)=>(
                              <li key={item[5]} className="d-flex flex-row">
                                <div className="c-blanco t-sma d-flex flex-column">
                                  <span className="index">BATCH #{item[5]}</span>
                                  <span className="amount">Amount: {(Number(item[2])/10**18).toFixed(2)} USDT</span>
                                  <span className="gain">Gain: {(Number(item[3])/10**18).toFixed(4)} USDT</span>
                                  <span className="time">Re-invest in: {item[4]==="true"?Math.floor(time_lock(item[1],TIME_PROFIT)/3600):0}hours {item[4]==="true"?Math.floor(time_lock(item[1],TIME_PROFIT)/60%60):0}mins {item[4]==="true"?time_lock(item[1],TIME_PROFIT)%60:0}secs</span>
                                  <span className="time">Farm in: {item[4]==="true"?Math.floor(time_lock(item[0],TIME_LOCKED)/3600):0}hours {item[4]==="true"?Math.floor(time_lock(item[0],TIME_LOCKED)/60%60):0}mins {item[4]==="true"?time_lock(item[0],TIME_LOCKED)%60:0}secs</span>
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                {
                                  Boolean(item[4]==="true"&& time_lock(item[1],TIME_PROFIT)<=0)?<button className="btn_1" disabled={timeDisable===0?false:true} onClick={(e)=>{reinvest(item[5]); btnDisable();}}><a>reInvest</a></button>:""
                                }
                                {
                                  Boolean(item[4]==="true" && time_lock(item[0],TIME_LOCKED)<=0 && time_lock(item[1],TIME_PROFIT)<=0)?<button className="farm" disabled={timeDisable===0?false:true} onClick={(e)=>{farm(item[5]); btnDisable();}}>Farm</button>:""
                                }
                                </div>
                            </li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}

export default Invest;
