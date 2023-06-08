export async function binance({
    setAccount,
    setIsConnect,
}) {
    //conect to Binance wallet
      localStorage.setItem("walletConnect", "BinanceChain");
      const accounts = await window.BinanceChain.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      localStorage.setItem("account", accounts[0]);
      setIsConnect(true);
  }
export async function addNetwork(id) {
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
export async function metamask({
    setAccount,
    setIsConnect,
    messange,
    blackList
}) {
    localStorage.setItem("walletConnect", "ethereum");
    if (window.ethereum === undefined)
      window.open(`https://metamask.app.link/dapp/${window.location.href}`, "_blank");
    //conect to metamask
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if(blackList.some(i=>i===accounts[0])) return messange("Your account is in the blacklist", "red")
    setAccount(accounts[0]);
    localStorage.setItem("account", accounts[0]);
    setIsConnect(true);
    if(!window.ethereum.on) return;
}