const Web3 = require('web3');

const rpcURL = "http://127.0.0.1:7545";
const kovanRpcURL = "https://kovan.infura.io/v3/3b71e4840573454784283317c7430054";

let provider = new Web3.providers.HttpProvider(kovanRpcURL)

const web3 = new Web3(provider);

const address = "0x4c2492cd6d33905ea622160454a51fb916c945dd";

web3.eth.getBalance(address, (err,wei) =>{
    balance = web3.utils.fromWei(wei,'ether')
    
    console.log("balance:"+balance)
})