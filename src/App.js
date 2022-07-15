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
const addressUSDT = "0x4Eb1E2D964777535ccc8E43C855a18AFdD045019";
const addressDAPP = "0x76FB9392a369BE13068653648a6C08Ef8a76b4f2";
const urlRef = window.location.href.split("?ref=")[1];

function App() {
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
  const day = [56,112,224]
  const [ calculate, setCalculate ] = useState(0);
  const [ Time_LOCKED, setTime_LOCKED ] = useState(0);
  const [ alert, setAlert ] = useState(false);
  const [ mensaje, setMensaje ] = useState("");
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
    setAccount(accounts[0]);
    setIsConnect(true);
    addNetwork(97);
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
            blockExplorerUrls: ["https://testnet.bscscan.com/"],
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
  const GET_REF = async () => {
    let contract = await contracts(addressDAPP, abiDapp);
    await contract._REF_TO_ADDRESS(account).then((result) => {
      setRef(result.toString());
    }
    );
  }
  const time_locked = async () => {
    let contract = await contracts(addressDAPP, abiDapp);
    await contract._TIME_LOCKED(account).then((result) => {
      setTime_LOCKED(result.toString());
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
      await contract.approve(addressDAPP, amount)
    }catch(e){
      messange(e.message,"red");
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
      await contract.FARM(index);
    }catch(e){
      messange(e.message.split('"')[1], "red");
    }
  }
  const time_lock = (time,secound) => {
    let newTime = Number(time)+secound - nowTime;
    newTime = newTime < 0 ? 0 : newTime;
    return newTime;
  }
  const reinvest = async () => {
    try{
      let contract = await contracts(addressDAPP, abiDapp);
      let amount = ethers.utils.parseEther(String(balanceLocked));
      await contract.REINVETS(amount);
    }catch(e){
      messange(e.message.split('"')[1], "red");
    }
  }
  const active_balance = async () => {
    try{
      let contract = await contracts(addressDAPP, abiDapp);
      await contract.ACTIVE_BALANCE().then(() => {
        _BALANCE();
      });
    }catch(e){
      messange(e.message.split('"')[1], "red");
    }
  }
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
  

  useEffect(()=>{
    connect()
    const interval = setInterval(() => {
      _BALANCE();
      _BALANCE_LOCKED();
      MY_BATCH_ALL();
      GET_REF();
      isApprove();
      time_locked();
      gain_ref();
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
                <li className="my-4"><p style={{fontSize: '9px'}} className="w-500 c-blanco text-center wall">{account}</p></li>
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
              <img className="animated flip infinite delay-1s" src="img/preloader.png" alt="" />
            </div>
          </div>
        </div>
        {/*Header*/}
        <div className="container-fluid align-items-center header">
          {/*Nav*/}
          <div className="row" style={{boxShadow: '4px 0 6px 1px #0000007d'}}>
            <div className="col-12">
              <div className="container">
                <div className="row  nav align-items-center justify-content-between">
                  {/*Logo*/}
                  <div className="col-3">
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
                  <div className="col-7 col-sm-5 col-md-3  text-right">
                    <ul className="l-h">
                      <li className="mr-4 c-blanco"><a id="open-login" className="btn-1"><span><img width="16px" className="mr-3" src="img/icons/wallet.png" alt="walleticon" /></span> {isConnect?"Connected":"Login Wallet"}</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                            <li onClick={()=>setIndexCalculate(0)} className={`btn-3  ${indexCalculate==0?"bt-active":""} c-blanco mr-3`}><a>1 Week </a></li>
                            <li onClick={()=>setIndexCalculate(1)} className={`btn-3  ${indexCalculate==1?"bt-active":""} c-blanco mr-3`}><a>2 Week </a></li>
                            <li onClick={()=>setIndexCalculate(2)} className={`btn-3  ${indexCalculate==2?"bt-active":""} c-blanco mr-3`}><a>1 Month</a></li>
                          </ul></li>
                        <li className="mb-3"><div>
                            <ul className="l-h">
                              <li className="mr-3"><input type="number" className="inp-1" placeholder={0.00} onChange={
                                (e)=>{
                                  let value = (e.target.value).replace(/[^0-9.]/g, '');
                                  let free = (value * 22 / 10000) * 28/100;
                                  let result = (value * 22 / 10000)-free;
                                  setCalculate((result * day[indexCalculate]).toFixed(2));
                                }
                              }/></li>
                            </ul>
                          </div></li>
                        <li className="mb-5"><ul>
                            <li><p className="w-600 c-blanco3">Lock Period: <span style={{fontWeight: 400}}> 1 Week</span></p></li>
                            <li><p className="w-600 c-blanco3">ROI: <span style={{fontWeight: 400}}> 0.22% Per Lot</span></p></li>
                            <li><p className="w-600 c-blanco3">Comision: <span style={{fontWeight: 400}}> 28% Per lot</span></p></li>
                            <li><p className="w-600 c-blanco3">Result: <span style={{fontWeight: 400}}> {calculate} USDT</span></p></li>
                          </ul></li>
                        <li className="mb-3"><div>
                            <ul className="l-h">
                              <li className="mr-3"><input type="number" className="inp-1" placeholder={0.00} onChange={(e)=>setAmount(e.target.value)}/></li>
                              {
                                Boolean(time_lock(Time_LOCKED,120)===0)?<li onClick={!isApproveUSDT?approve:invest} className="btn-5 c-blanco mr-3"><a>{!isApproveUSDT?"Approved":"Invest"}</a></li>:<li className="c-blanco mr-3">Unlock on: {Math.floor(time_lock(Time_LOCKED,120)/3600)}hours {Math.floor(time_lock(Time_LOCKED,120)/60%60)}mins {time_lock(Time_LOCKED,120)%60}secs</li>
                              }
                            </ul>
                          </div></li>
                        <li><p className=" t-sma c-blanco3 w-500">* The data expressed in the calculator will only be accurate if the user makes constant investments of the same amount in each lot, every three hours.</p></li>
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
                              <li className="btn-4 c-blanco mr-3" onClick={reinvest}><a>reInvest</a></li>
                              {
                                Boolean(time_lock(Time_LOCKED,120)===0)?<li className="btn-5 c-blanco mr-3" onClick={active_balance}><a>Active</a></li>:<li className="c-blanco mr-3">Unlock on: {Math.floor(time_lock(Time_LOCKED,120)/3600)}hours {Math.floor(time_lock(Time_LOCKED,120)/60%60)}mins {time_lock(Time_LOCKED,120)%60}secs</li>
                              }
                            </ul>
                          </ul>
                        </div>
                      </li>
                      {/*tarjeta*/}
                      <li className="mb-3">
                        <div className="card1">
                          <ul>
                            <li><p className="mb-2 t-sma c-blanco3 w-500">Aviable Balance <i className="bi bi-check" /></p></li>
                            <li><h4 className="mb-4 c-blanco w-500">{balance} USDT <span className="mb-2 t-sma c-blanco3 w-500"> + {gainRef} USDT (Referal Earns)</span> </h4></li>
                            <li className="mb-3"><div>
                                <ul className="l-h">
                                  <li className="mr-3"><input type="number" className="inp-1" placeholder={0.00}
                                  onChange={(e)=>setValueWithdraw(e.target.value)}
                                  /></li>
                                  <li onClick={withdraw} className="btn-5 c-blanco mr-3"><a>Withdraw</a></li>
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
                              </div></li>
                            <li><h4 className="mb-4 c-blanco w-500">{gainRef} USDT </h4></li>
                            <li className><ul>
                                <li><p className="w-600 c-blanco3">Level 1: <span style={{fontWeight: 400}}> 4%</span></p></li>
                                <li><p className="w-600 c-blanco3">Level 2: <span style={{fontWeight: 400}}> 3%</span></p></li>
                                <li><p className="w-600 c-blanco3">Level 3: <span style={{fontWeight: 400}}> 1%</span></p></li>
                              </ul></li>
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
                              <li key={item[4]} className="d-flex flex-row">
                                <div className="c-blanco t-sma d-flex flex-column">
                                  <span className="index">BATCH #{item[4]}</span>
                                  <span className="amount">Amount: {(Number(item[1])/10**18).toFixed(2)} USDT</span>
                                  <span className="gain">Gain: {(Number(item[2])/10**18).toFixed(4)} USDT</span>
                                  <span className="time">End in: {Math.floor(time_lock(item[0],60)/3600)}hours {Math.floor(time_lock(item[0],60)/60%60)}mins {time_lock(item[0],60)%60}secs</span>
                                </div>
                                {
                                  Boolean(item[3]==="true"&& time_lock(item[0],60)===0)?<button className="farm" onClick={()=>farm(item[4])}>Farm</button>:""
                                }
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
