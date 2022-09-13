import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { useIPFS } from "./IPFSContextProvider";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Marketplace from './Marketplace.json';
import { ethers } from "ethers";

const ListNft = () => {  
    const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  
  const { IPFSuploading, IPFSerror, IPFSupload, metadata } = useIPFS();

  const inputFileRef = useRef(null);

   function inputFileHandler() {
    if (selectedFile) {
      setSelectedFile(null);
    } else {
      inputFileRef.current.click();
    }
  }
  
  async function mintNFThandler(metadataURL) {
    const { name, description, price } = formParams;

    if (!name) {
      return toast.warning("NFT Name should not be empty");
    } else if (!description) {
      return toast.warning("NFT Description should not be empty");
    } else if (!selectedFile) {
      return toast.warning("Select a file to upload");
    }
    else if (!price) {
      return toast.warning("price should be included");
    }

    try { 
      if (formParams.price < 0.01) {
        toast.error("minimum price is 0.01")
      } else {
        metadataURL = await IPFSupload({
        name,
        description,
        price
      },
        selectedFile        
        );
              const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
       let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
       );
      
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();
      let transaction = await contract.createToken(metadata, ethers.utils.parseEther(formParams.price.toString()), {
        value: listingPrice,
      });
        toast.info("Please wait.. minting may take upto 5 mins for complete transaction");
        await transaction.wait();
        updateFormParams({ name: "", description: "", price: "" });
      toast.success("Mint Successfull !");
      }       
      
      
    }   
    catch (error) {      
      if (error) {
        toast.error("failed"+" "+error.message);
      }

    } 
  } 
  
  useEffect(() => {
      if (IPFSuploading) {
        toast.info("Uploading NFT data To IPFS");
      }
  }, [IPFSuploading]);

  useEffect(() => {
    if (IPFSerror) {
      toast.error(IPFSerror.message);
    }
  }, [IPFSerror]);

  return (
    <section id="ListNFT">      
      <div className="listNft_container">
        <div className="listBoard">
          <div className="nft_name">
            NFT Name
            <input
              type="text"
              placeholder="your NFT name"
              className="nft_name_textbox"
              value={formParams.name}
              id={formParams.name}
              onChange={(e) => updateFormParams({ ...formParams, name: e.target.value })}
            ></input>
          </div>
          <div className="nft_description">
            NFT Description
            <textarea minLength="10" required
              cols="10"
              rows="5"
              type='text'
              placeholder="your NFT details"
              className="nft_description_textarea"
              id={formParams.description}
              value={formParams.description}
              onChange={(e) => updateFormParams({ ...formParams, description: e.target.value })}></textarea>
          </div>
          <div className="price_in_eth">
            price (In ETH)
            <input
              type="text"
              placeholder="min 0.01 ETH"
              className="price_in_eth_textbox"
              id={formParams.price}
            value={formParams.price}
            onChange={(e) => updateFormParams({ ...formParams, price: e.target.value })}>
            </input>
          </div>
          <div className="uploadNFT">
            upload NFT 
            <input ref={inputFileRef} type="file" onChange={(e) => setSelectedFile(e.target.files[0])} onClick={inputFileHandler}></input>
             {selectedFile ? (
          <div>
            <p>File Name : {selectedFile.name}</p>
            <p>File Type : {selectedFile.type}</p>
          </div>
        ) : (
          <p>0 File(s) Uploaded</p>
            )}
            
            <button className="listNFT_BTN"  onClick={mintNFThandler}>
              ListNFT
            </button>
          </div>
        </div>
      </div> 
      <ToastContainer
        style={{ overflowWrap: "anywhere" }}
        position="bottom-right"
      />
    </section>
    
    
  );
};

export default ListNft;

