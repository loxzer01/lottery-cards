import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/css/mdb.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.min.js";
import {useEffect, useState} from "react";

import "./css/style.css";
import { binance, metamask } from "./utils/conect";

import Header from "./components/Header";
import Invest from "./components/Invest";
import Game from "./components/game";
import Menu from "./components/Menu";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const blackList = ["0x98Ab3efbEF52C3b4F3ADb00072586cC1f2897F7E", "0xbA5444dB6c899d0924CC8bBA9036aE496FDe8373"];


function App() {
  // const [isAds, setIsAds] = useState(true);
  const [ isConnect, setIsConnect ] = useState(false);
  const [ account, setAccount ] = useState(null);
  const [ alert, setAlert ] = useState(false);
  const [ mensaje, setMensaje ] = useState("");
  const connect = (conection) => {
    if(
      conection === "BinanceChain"
    ){
      localStorage.setItem("walletConnect", "BinanceChain");
      binance({
        setAccount,
        setIsConnect,
      });
    }else if(
      conection === "ethereum"
    ){
      localStorage.setItem("walletConnect", "ethereum");
      metamask({
        setAccount,
        setIsConnect,
        messange,
        blackList
      });
    }else{
      if(localStorage.getItem("walletConnect") === "BinanceChain"){
        binance({
          setAccount,
          setIsConnect,
        });
      }else if(localStorage.getItem("walletConnect") === "ethereum"){
        metamask({
          setAccount,
          setIsConnect,
          messange,
          blackList
        });
      }
    }
  }
  function messange(msj, clase) {
    setAlert(true);
    setMensaje(msj.slice(0, 255));
    document.querySelector(".alert").classList.add(clase);
  }
  useEffect(() => {
    try{
      window[localStorage.getItem("walletConnect")].on("accountsChanged", function(accounts) {
        setIsConnect(true);
        connect("ethereum");
      });
      window[localStorage.getItem("walletConnect")].on("chainChanged", function(accounts) {
        setIsConnect(true);
        connect("ethereum");
      });
    }catch(e){
      console.log(e);
    }
  }, []);
  // if(localStorage.getItem("walletConnect") === "ethereum" && account === null){
  //   connect("ethereum");
  // }
  return (
    <>
  <Router>
      <Routes>
        <Route path="/" element={ <>
        <Header
            account={account}
            connect={connect}
            isConnect={isConnect}
            setAlert={setAlert}
            alert={alert}
            mensaje={mensaje}
            setIsConnect={setIsConnect}
            view={false}
          />
          <Menu />
          </>} />
        <Route
          path="/invest"
          element={
            <><Header
            account={account}
            connect={connect}
            isConnect={isConnect}
            setAlert={setAlert}
            alert={alert}
            mensaje={mensaje}
            setIsConnect={setIsConnect}
            view={true}
          />
            <Invest
              account={account}
              isConnect={isConnect}
              setAlert={setAlert}
              alert={alert}
              mensaje={mensaje}
              setIsConnect={setIsConnect}
              messange={messange}
              connect={connect}
            />
            </>
          }
        />
        <Route path="/game" element={<><Header
            account={account}
            connect={connect}
            isConnect={isConnect}
            setAlert={setAlert}
            alert={alert}
            mensaje={mensaje}
            setIsConnect={setIsConnect}
            view={false}
          /><Game /></>} />
      </Routes>
    </Router>

    </>
  );
}

export default App;
