import React, { createContext, useContext, useState } from "react";
import { NFTStorage, File } from "nft.storage";


const IPFSContext = createContext({});
require('dotenv').config();


export function IPFSContextProvider(props) {
  const [IPFSuploading, setIPFSuploading] = useState(false);
  const [IPFSerror, setIPFSerror] = useState(null);  

  async function IPFSupload(data, file) {     
   
    try {
      setIPFSerror(null);
      setIPFSuploading(false);
      const client = new NFTStorage({ token: process.env.NEW_TOKEN_KEY });
      
      
      const metadata = await client.store({
        name: data.name,
        description: data.description,
        price:data.price,
        image: new File([file], file.name, { type: file.type })
      });
      console.log('IPFS URL for the metadata:', metadata.url)
      console.log('metadata.json contents:\n', metadata.data)
      console.log('metadata.json with IPFS gateway URLs:\n', metadata.embed())
      
    } catch (error) {
      console.error(error);
      setIPFSerror(error);
    } finally {
      setIPFSuploading(false);
    }
  }

  return (
    <IPFSContext.Provider value={{ IPFSuploading, IPFSerror, IPFSupload }}>
      {props.children}
    </IPFSContext.Provider>
  );
}

export function useIPFS() {
  return useContext(IPFSContext);
}
