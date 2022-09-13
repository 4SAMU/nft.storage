import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { useIPFS } from "./IPFSContextProvider";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListNft = () => {

  const[nftName, setNftName]=useState("")
  const[description, setDescription]=useState("")
  const [price, setPrice] = useState("") 
  const [selectedFile, setSelectedFile] = useState(null);
  
  const { IPFSuploading, IPFSerror, IPFSupload } = useIPFS();

  const inputFileRef = useRef(null);

   function inputFileHandler() {
    if (selectedFile) {
      setSelectedFile(null);
    } else {
      inputFileRef.current.click();
    }
  }
  
  async function mintNFThandler() {
    if (!nftName) {
      return toast.warning("NFT Name should not be empty");
    } else if (!description) {
      return toast.warning("NFT Description should not be empty");
    } else if (!selectedFile) {
      return toast.warning("Select a file to upload");
    }
    else if (!price) {
      return toast.warning("price should be include");
    }

    try {
      const result = await IPFSupload(
        {
          name: nftName,
          description: description,
          price:price
        },
        selectedFile
      );
      console.log(result)     
      toast.success("Mint Successfull !");
    } catch (error) {      
      if (error) {
        toast.error(error.message);
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
              value={nftName}
              id={nftName}
              onChange={(e) => setNftName(e.target.value)}
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
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="price_in_eth">
            price (In ETH)
            <input
              type="text"
              placeholder="min 0.01 ETH"
              className="price_in_eth_textbox"
              id={price}
            value={price}
            onChange={(e) => setPrice(e.target.value)}>
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

