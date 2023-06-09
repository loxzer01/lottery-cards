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
      addNetwork(11155111)
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
        // sepolia mainet
        case 11155111:
          networkData = [
            {
              chainId: "0x"+id.toString(16),
              chainName: "SEPOLIA",
              rpcUrls: ["https://rpc2.sepolia.org"],
              nativeCurrency: {
                name: "SEPOLIA",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io/"],
            },
          ];
          break;
      default:
        break;
        
    }
    if (window.ethereum === undefined) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x"+id.toString(16) }], // chainId must be in hexadecimal numbers
      });
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: networkData,
      });
    }
    catch (error) {
      console.log(error);
    }
}
export async function metamask({
    setAccount,
    setIsConnect,
    messange,
    blackList
}) {
    addNetwork(11155111)
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