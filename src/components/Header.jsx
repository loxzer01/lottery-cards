import {useState,useEffect,useLayoutEffect} from 'react'
import $ from "jquery";

const Header = ({
    account,
    connect,
    isConnect,
    setAlert,
    alert,
    mensaje,
    setIsConnect,
    view,
}) => {
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
    
    //   useEffect(()=>{
//     setTimeout(()=>{
//         if(time === 1){
//             setTime(0)
//         }else{
            
//             setTime(time+1)
//         }
//     }, 7000)
// },[time])
const [time, setTime ] = useState(0);
const dicBanner = [["https://iluminatiscoin2-0.com/","1"],["https://iluminatiscoin2-0.com/","2"]]
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
                      <a className="mr-4" href={window.location.origin}><img src="img/logo-light.png" width="50px" alt="Logo" /></a>
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
          {
            view? <div className="row mt-5">
            <div className="col-12 banner">
              <a href={dicBanner[time][0]} target="_blank">
                  <img src={`./img/banner-${dicBanner[time][1]}.png`} />
              </a>
            </div>
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
        </div>:null
          }
        </div>
    </>
  )
}

export default Header