import { useState } from "react";

import "../css/NFTForm.css";

export default function NFTForm({ gcitNFTAPI, setIsLoading }) {
  const [receipient, setReceipient] = useState("");
  const [tokenURI, setTokenURI] = useState("");

  async function handleMintGcitNFT(event) {
    setIsLoading(true);
    event.preventDefault();
    const tx = await gcitNFTAPI.addNFTItem(receipient, tokenURI);
    await tx.wait();
    if (tx.hash) {
      alert("Successfully minted the NFT");
      setIsLoading(false);
    } else {
      alert("Failed to mint NFT");
    }
    setReceipient("");
    setTokenURI("");
  }

  return (
    <form onSubmit={handleMintGcitNFT}>
      <label>Enter Recepient Address:</label>
      <input
        type="text"
        value={receipient}
        onChange={(event) => {
          setReceipient(event.target.value);
        }}
      />
      <br />
      <br />
      <label>NFT URI</label>
      <input
        type="url"
        value={tokenURI}
        onChange={(event) => {
          setTokenURI(event.target.value);
        }}
      />
      <br />
      <br />
      <input value="Mint GCIT NFT" type="submit" />
    </form>
  );
}
