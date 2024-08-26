import "./App.css";
import Web3 from "web3";
import { useEffect, useLayoutEffect, useState } from "react";
import Title from "./ui/Title";
import NFTForm from "./ui/NFTForm";
import NFTCard from "./ui/NFTCard";
import LoadingSpinner from "./ui/LoadingSpinner";
import axios from "axios";

const gcitNFTABI = require("./contracts/GcitNFT.json");
const gcitNFTContractAddress = "0x0D12842eB6A5aA19b2BF002889c0529f3F21B0C7";

function App() {
  const [web3, setWeb3] = useState(null);
  const [gcitNFTAPI, setGCITNFTAPI] = useState(null);
  const [gcitNFTName, setGCITNFTName] = useState("");
  const [gcitNFTSymbol, setGCITNFTSymbol] = useState("");
  const [gcitNFTList, setGCITNFTList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum == null) {
        console.log("Metamask not found");
      } else {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const contract = new web3Instance.eth.Contract(
            gcitNFTABI.abi,
            gcitNFTContractAddress
          );
          setGCITNFTAPI(contract);
        } catch (error) {
          console.log("Error connecting to Metamask or contract:", error);
        }
      }
    };
    connectWallet();
  }, []);

  useEffect(() => {
    const fetchGCITNFTNameSymbol = async () => {
      if (gcitNFTAPI) {
        try {
          const name = await gcitNFTAPI.methods.name().call();
          const symbol = await gcitNFTAPI.methods.symbol().call();
          setGCITNFTName(name);
          setGCITNFTSymbol(symbol);
        } catch (error) {
          console.log("Error fetching NFT name or symbol:", error);
        }
      }
    };
    fetchGCITNFTNameSymbol();
  }, [gcitNFTAPI]);

  useLayoutEffect(() => {
    document.title = gcitNFTSymbol + " " + document.title;
  }, [gcitNFTName, gcitNFTSymbol]);

  useEffect(() => {
    const fetchGCITNFT = async () => {
      let tokenId = 0;
      const nft_list = [];
      if (gcitNFTAPI) {
        try {
          while (true) {
            try {
              await gcitNFTAPI.methods.ownerOf(tokenId).call();
              const tokenURI = await gcitNFTAPI.methods
                .tokenURI(tokenId)
                .call();
              const nft_data = await axios.get(tokenURI);
              console.log(nft_data.data);
              nft_list.push(nft_data.data);
              tokenId += 1;
            } catch (innerError) {
              console.log(
                "No more tokens or failed to fetch token:",
                innerError
              );
              break;
            }
          }
        } catch (error) {
          console.log("Error fetching NFT or token does not exist:", error);
        }
        setGCITNFTList(nft_list);
      }
    };
    fetchGCITNFT();
  }, [gcitNFTAPI]);

  console.log(gcitNFTList.length);

  return (
    <div className="App">
      <Title name={gcitNFTName} symbol={gcitNFTSymbol} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <NFTForm gcitNFTAPI={gcitNFTAPI} setIsLoading={setIsLoading} />
      )}
      <br />
      <h1>NFT Gallery</h1>
      {gcitNFTList.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="nft-card-list">
          {gcitNFTList.map((item, index) => (
            <NFTCard
              key={index}
              name={item.name}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
