import "./App.css";
import { ethers } from "ethers";
import { useEffect, useLayoutEffect, useState } from "react";
import Title from "./ui/Title";
import NFTForm from "./ui/NFTForm";
import NFTCard from "./ui/NFTCard";
import LoadingSpinner from "./ui/LoadingSpinner";
import axios from "axios";

const gcitNFTABI = require("./contracts/GcitNFT.json");
//const gcitNFTContractAddress = "0xC421b1EE67b0dCc07dD9aFb53dE47772EA42e5a6";
const gcitNFTContractAddress = "0x83d0e9468eD4F1e79C541e835F6B18717d993E39";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSingner] = useState(null);
  const [gcitNFTAPI, setGCITNFTAPI] = useState(null);
  const [gcitNFTName, setGCITNFTName] = useState("");
  const [gcitNFTSymbol, setGCITNFTSymbol] = useState("");
  const [gcitNFTList, setGCITNFTList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      //Check for the metamask wallet
      if (window.ethereum == null) {
        console.log("Metamask not found");
        setProvider(ethers.getDefaultProvider());
      } else {
        const providerInstance = new ethers.BrowserProvider(window.ethereum);
        setProvider(providerInstance);
        //get the singer object so that you can perform the write operations
        providerInstance
          .getSigner()
          .then((signerInstance) => {
            setSingner(signerInstance);
            //Let connect with the smart contract

            setGCITNFTAPI(
              new ethers.Contract(
                gcitNFTContractAddress,
                gcitNFTABI.abi,
                signerInstance
              )
            );
          })
          .catch((error) => console.log(error));
      }
    };
    connectWallet();
  }, []);

  //Fetch the GCIT NFT name and symbol
  useEffect(() => {
    const fetchGCITNFTNameSymbol = async () => {
      if (gcitNFTAPI) {
        setGCITNFTName(await gcitNFTAPI.name());
        setGCITNFTSymbol(await gcitNFTAPI.symbol());
      }
    };
    fetchGCITNFTNameSymbol();
  }, [gcitNFTAPI]);

  useLayoutEffect(() => {
    //Set the website title
    document.title = gcitNFTSymbol + " " + document.title;
  }, [gcitNFTName, gcitNFTSymbol]);

  //Fetch Individual NFT
  useEffect(() => {
    const fetchGCITNFT = async () => {
      let tokenId = 0;
      const nft_list = [];
      if (gcitNFTAPI) {
        while (true) {
          try {
            let tx = await gcitNFTAPI.tokenURI(tokenId);
            let nft_data = await axios.get(tx);
            console.log(nft_data.data);
            nft_list.push(nft_data.data);
            tokenId += 1;
          } catch (error) {
            // console.log(error);
            break;
          }
        }
        setGCITNFTList(nft_list);
      }
    };
    fetchGCITNFT();
  }, [gcitNFTAPI, gcitNFTList]);

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
          {gcitNFTList.map((item) => (
            <NFTCard
              key={item.name}
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
