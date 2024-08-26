import { useState } from "react";
import "../css/NFTForm.css";

export default function NFTForm({ gcitNFTAPI, setIsLoading }) {
  const [receipient, setReceipient] = useState("");
  const [tokenURI, setTokenURI] = useState("");

  async function handleMintGcitNFT(event) {
    setIsLoading(true);
    event.preventDefault();
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const tx = await gcitNFTAPI.methods
        .awardItem(receipient, tokenURI)
        .send({ from: accounts[0] });

      if (tx.transactionHash) {
        alert("Successfully minted the NFT");
      } else {
        alert("Failed to mint NFT");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Error minting NFT");
    }
    setIsLoading(false);
    setReceipient("");
    setTokenURI("");
  }

  return (
    <form onSubmit={handleMintGcitNFT}>
      <label>Enter Recipient Address:</label>
      <input
        type="text"
        value={receipient}
        onChange={(event) => setReceipient(event.target.value)}
      />
      <br />
      <br />
      <label>NFT URI:</label>
      <input
        type="url"
        value={tokenURI}
        onChange={(event) => setTokenURI(event.target.value)}
      />
      <br />
      <br />
      <input value="Mint GCIT NFT" type="submit" />
    </form>
  );
}
