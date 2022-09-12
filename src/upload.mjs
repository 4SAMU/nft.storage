// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from 'nft.storage'

// The 'mime' npm package helps us set the correct file type on our File objects
import mime from 'mime'

// The 'fs' builtin module on Node.js provides access to the file system
import fs from 'fs'

// The 'path' module provides helpers for manipulating filesystem paths
import path from 'path'



// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDViOTg4Q0U4NjZBMkQxNTZmNDI5QTcwZDQ5OWExNDM3NmIwNERBOGMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjczNDAxMDk1MSwibmFtZSI6ImNvaW5iYXNlbmZ0In0._E1KnvPg0cJ44QtGx8LN-ZwoZ6CaxkCWybUiOFknVkw'

/**
  * Reads an image file from `imagePath` and stores an NFT with the given name and description.
  * @param {string} imagePath the path to an image file
  * @param {string} name a name for the NFT
  * @param {string} description a text description for the NFT
  * @param {string} price price for the NFT
  */
async function storeNFT(imagePath, name, description, price) {
    // load the file from disk
    const image = await fileFromPath(imagePath)

    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

    // call client.store, passing in the image & metadata
    return nftstorage.store({
        image,
        name,
        description,
        price
    })
}

/**
  * A helper to read a file from a location on disk and return a File object.
  * Note that this reads the entire file into memory and should not be used for
  * very large files. 
  * @param {string} filePath the path to a file to store
  * @returns {File} a File object containing the file content
  */
async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}


/**
 * The main entry point for the script that checks the command line arguments and
 * calls storeNFT.
 * 
 * To simplify the example, we don't do any fancy command line parsing. Just three
 * positional arguments for imagePath, name, and description
 */
async function main() {
    const args = process.argv.slice(2)
    if (args.length !== 4) {
        console.error(`usage: ${process.argv[0]} ${process.argv[1]} <image-path> <name> <description> <price>`)
        process.exit(1)
    }

    const [imagePath, name, description, price] = args
    const result = await storeNFT(imagePath, name, description, price)    

    const imageUri = result.ipnft;
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const data = await fetch(`https://nftstorage.link/ipfs/${imageUri}/metadata.json`)
    const json = await data.json()
    const str = json.image;
    const mylink = str.slice(7);
    console.log("https://nftstorage.link/ipfs/"+mylink)
    
    
    
}

// Don't forget to actually call the main function!
// We can't `await` things at the top level, so this adds
// a .catch() to grab any errors and print them to the console.
main()
  .catch(err => {
      console.error(err)
      process.exit(1)
  })