import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdbootstrap/css/mdb.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import abiUSDT from "./abi/USDT.json";
import abiDapp from "./abi/DAPP.json";
import "bootstrap/dist/js/bootstrap.min.js";
import "./css/style.css";
import $ from "jquery";
import {useEffect, useLayoutEffect, useState} from "react";
import { ethers } from "ethers";
const addressUSDT = "0x55d398326f99059fF775485246999027B3197955";
const addressDAPP = "0xaC92D5726c464d4D4dE05c944E6Ae0e58eF048fC";
const urlRef = window.location.href.split("?ref=")[1];
const addressOwner = "0xEc7e933Ba03016fdAe786291f2655f074fb591e1";
let addressAccount = "";
// const addressOwner = "0xEc7e933Ba03016fdAe786291f2655f074fb591e1";
function App() {
  const [isAds, setIsAds] = useState(true);
  const blackList = ["0x98Ab3efbEF52C3b4F3ADb00072586cC1f2897F7E", "0xbA5444dB6c899d0924CC8bBA9036aE496FDe8373"];
  const [ isConnect, setIsConnect ] = useState(false);
  const [ account, setAccount ] = useState(null);
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
  const [ alert, setAlert ] = useState(false);
  const [ mensaje, setMensaje ] = useState("");
  const [ TIME_LOCKED, setTIME_LOCKED ] = useState(0);
  const [ TIME_PROFIT, setTIME_PROFIT ] = useState(0);
  const [ timeDisable, setTimeDisable ] = useState(0);
  const [ LOCK_BALANCE, setLOCK_BALANCE ] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const connect = (conection) => {
    if(localStorage.getItem("walletConnect") === "BinanceChain" || conection === "BinanceChain"){
      binance();
    }
    if(localStorage.getItem("walletConnect") === "ethereum" || conection === "ethereum"){
      metamask();
    }
    
  }
  async function metamask() {
    localStorage.setItem("walletConnect", "ethereum");
    if (window.ethereum === undefined)
      window.open(`https://metamask.app.link/dapp/${window.location.href}`, "_blank");
    //conect to metamask
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if(blackList.some(i=>i===accounts[0])) return messange("Your account is in the blacklist", "red")
    setAccount(accounts[0]);
    addressAccount=accounts[0];
    setIsConnect(true);
    addNetwork(56);
  }
  async function binance() {
    //conect to Binance wallet
      localStorage.setItem("walletConnect", "BinanceChain");
      const accounts = await window.BinanceChain.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setIsConnect(true);
  }
  async function addNetwork(id) {
    let networkData;
    switch (id) {
      // bsctestnet
      case 97:
        networkData = [
          {
            chainId: "0x61",
            chainName: "BSCTESTNET",
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
            nativeCurrency: {
              name: "BINANCE COIN",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.bscscan.com/"],
          },
        ];
        break;
      // bscmainet
      case 56:
        networkData = [
          {
            chainId: "0x38",
            chainName: "BSCMAINET",
            rpcUrls: ["https://bsc-dataseed1.binance.org"],
            nativeCurrency: {
              name: "BINANCE COIN",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://bscscan.com/"],
          },
        ];
        break;
      default:
        break;
    }
    return window[localStorage.getItem("walletConnect")].request({
      method: "wallet_addEthereumChain",
      params: networkData,
    });
  }
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
  }
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
  function messange(msj, clase) {
    setAlert(true);
    setMensaje(msj.slice(0, 255));
    document.querySelector(".alert").classList.add(clase);
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
    setIsOwner(addressAccount.toUpperCase == addressOwner.toUpperCase)
  }
  useEffect(()=>{
    connect()
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
  useLayoutEffect(()=>{
    setTimeout(()=>{
      $('#pre').hide('fade');
    },2000)
    /*Scripts Start*/
    $(document).ready(function(){
        /////////Control del login
        //Open
        $('#open-login').click(function(){
            $('.pdo').show('fade');
            $('.conect').show('drop');
        });
        //Close
        $('#close-login').click(function(){
            $('.conect').hide('drop');
            $('.pdo').hide('fade');
        });
     });
     window[localStorage.getItem("walletConnect")]?.on("accountsChanged", function(accounts) {
      setIsConnect(true);
      connect();
    });
  },[])
  useEffect(() => {
    // messange("Investments available until the new contract", "red");/
    const script = document.createElement('script');
  
    script.src = "https://www.livecoinwatch.com/static/lcw-widget.js";
    script.async = true;
  
    document.body.appendChild(script);
    // messange("Investments available until the new contract", "red")
    return () => {
      document.body.removeChild(script);
    }
  }, []);
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
      {alert?<div className="alerta" onClick={
        ()=>setAlert(false)
      }>
        <p>{mensaje}</p>
      </div>:null}
        <div className="pdo hd" />
        {/*Pantalla de login*/}
        <div className="container-fluid p-5 hd conect">
          <div className="row ">
            {/*Medidas Responsives*/}
            <div className="col-0 col-sm-2 col-md-3 col-lg-4" />
            <div className="col-12 col-sm-8 col-md-6 col-lg-4 box-1 conta c-blanco radius-2 p-4 position-relative">
              <ul>
                <li className="mb-3"><h5 className="w-500 c-blanco">Connect Wallet</h5><i id="close-login" className="exit-icon bi bi-x" /></li>
                <li className="my-4"><p style={{fontSize: '9px'}} className="w-500 c-blanco text-center wall" id="walletID">{account}</p></li>
                <li className="mb-4"><p style={{fontSize: 'small'}} className="w-500 c-blanco2">Please select a wallet to connect with <br /> IluminatisCoin 2.0</p></li>
                <li className="mb-3" onClick={()=>connect("ethereum")}><p className="w-500 c-blanco wall"><img className="mr-3" src="img/icons/meta-mask.png" alt="" /> Metamask</p></li>
                <li className="mb-3" onClick={()=>connect("BinanceChain")}><p className="w-500 c-blanco wall"><img className="mr-3" src="img/icons/binance.png" alt="" /> Binance </p></li>
              </ul>
            </div>
            <div className="col-0 col-sm-2 col-md-3 col-lg-4" />
          </div>
        </div>
        {/*Inicio del proyecto*/}
        <div style={{backgroundColor: '#050505'}} id="pre" className="container-fluid vh100 bg-negro">
          <div className="row vh100 align-items-center">
            <div className="col text-center ">
              <img className="animated flip infinite delay-1s" src="img/logo-light.png" alt="" width={250} height={250} />
            </div>
          </div>
        </div>
        {/* {isAds?<div className="ads_project">
          <span className="exit"onClick={()=>setIsAds(false)}>x</span>
          <h2>Important Announcement</h2>
          <h3>Dear Users</h3>
          <h4>Guarantee and Liquidity Audit.</h4>
          <span>Date: 28/11/2022 to 04/12/2022</span>
          <span className="show">
          <p>With all the uncertain landscape that exists around the crypto ecosystem, we want our community to feel comfortable having one or more smart contracts with us. For this reason, we have decided to audit our first three months of operation and draw a balance that demonstrates the liquidity of our smart contract, demonstrating that we are a long-term alternative.</p>
          <p>To do so, we need the collaboration of our community.</p>
          <p>We request that from 28/11/2022 all 04/12/2022 all the funds of our users be withdrawn to their wallet. We will demonstrate in this period that there is the guarantee and liquidity to continue operating without depending on the smart contracts of the community.</p>
          <p>Once the balances are at 0, we will be able to get our report and share it with all of you, demonstrating that the guarantee and liquidity of the project exists.</p>
          <p>On December 6, everyone will be able to reactivate their smart contract and add new investments. We will request to do this process every 6 months to demonstrate that we have reserve capital and that we are not affected by market conditions.</p></span>
       </div>
        :null} */}
        {/*Header*/}
    
        <div className="container-fluid align-items-center header">
          {/*Nav*/}
          <div className="row" style={{boxShadow: '4px 0 6px 1px #0000007d'}}>
            <div className="col-12">
              <div className="container">
                <div className="row  nav align-items-center justify-content-between">
                  {/*Logo*/}
                  <div className="col-2">
                    <ul className="l-h">
                      <li className="mr-4"><img src="img/logo-light.png" width="50px" alt="Logo" /></li>
                    </ul>
                  </div>
                  {/*Menu*/}
                  {/* <div className="col-6 text-center">
                    <ul className="l-h">
                    <li className="mr-4 c-blanco"><p>Dapp</p></li>
                    <li className="mr-4 c-blanco"><p>Investments</p></li>
                    <li className="mr-4 c-blanco"><p>Withdraws</p></li>
                    <li className="mr-4 c-blanco"><p>Contact Us</p></li>
                    </ul>
                  </div> */}
                  {/*Login*/}
                  <div className="col-8 col-sm-5 col-md-3  text-right textFontpequeña">
                    <ul className="l-h">
                      <li className="mr-4 c-blanco"><a id="open-login" className="btn-1"><span><img width="16px" className="mr-3" src="img/icons/wallet.png" alt="walleticon" /></span> {isConnect?"Connected":"Login Wallet"}</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="livecoinwatch-widget-5 py-2 bg-primary-color" lcw-base="USD" lcw-color-tx="#888888" lcw-marquee-1="coins" lcw-marquee-2="movers" lcw-marquee-items="10" ></div>
          {/*Center Info*/}
          <div className="row mt-5">
            <div className="col-12 ">
              <div className="container">
                <div className="row text-center">
                  {/*Titulo*/}
                  <div className="col">
                    <ul className>
                      <li className="mb-4"><img src="img/icons/check.png" alt="" /></li>
                      <li className="mb-2"><h1 className="c-blanco w-500">START INVESTMENT</h1></li>
                      <li className="mb-4"><p className="c-blanco w-500">Safe investments, with smart returns</p></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                              <button onClick={()=>{
                                  if(!isApproveUSDT){
                                    setTimeout(approve,100);
                                    btnDisable();
                                  }else{
                                    invest();
                                    btnDisable();
                                  }
                                }}
                                className="btn-5 c-blanco mr-3" disabled={timeDisable===0?false:true}>{!isApproveUSDT?"Approved":"Invest"}</button>
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

export default App;
