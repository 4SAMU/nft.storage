# client files, index.js, App.js and IPFSContextProvider.js
others like upload.mjs you can upload directly by running node src/upload.mjs object.png/jpeg/jpg/gif/mp4/mp3 <nft name> <nft description> <nft price>

# creating BigNumber instances
```shell
const a = ethers.BigNumber.from('1') // creates BigNumber of 1
const b = ethers.utils.parseUnits('1', 18) // Creates BigNumber of 1000000000000000000
const c = ethers.utils.parseEther('1') // same as above, by default 18 decimals

a.toString() // '1'
b.toString() // '1000000000000000000'
ethers.utils.formatEther(a) // '0.000000000000000001'
ethers.utils.formatEther(b) // '1.0'
```
# run by:
  ```shell
  npm install
  npm start
  ```
