<template>
    <div class="content">
  <h3> CICA </h3>
  <span>测试CICA </span>
  <p>这是我的地址{{currentAccount}}</p>
  <p>这是我的余额{{balance}}</p>
  <p>当前网络: {{chainId === "0x1" ? "以太坊主网":"其他网络"}}</p>
  <p>合约上的值为: {{myNum}}</p>

    <button @click="linkwallet">连接钱包</button>
    <br><br>
    <input v-model="contractNum" placeholder="edit me">

    <button @click="setContractCounter">发送交易</button>
    <button @click="signData">点击签名</button>

</div>
</template>

<script>
const Web3 = require('web3');
const Web3Provider = require('@ethersproject/providers')
var abi = require('./Hello')

export default {
    name: 'CrowdFund',
    data: function() {
        return {
            currentAccount: '',
            balance: 0,
            chainId: '',
            provider: null,
            web3: null,
            helloC: null,
            myNum: 0,
            contractNum: null,
            myContract: null,
        }
    },

    created: function() {
        this.initMetaMask()
        this.updateAccount()
        this.checkNetwork()
        this.updateNetwork()

    },
    computed: {

    },

    methods: {

        initMetaMask() {
            if (typeof window.ethereum !== 'undefined') {
                if (!window.ethereum.isMetaMask) {
                    console.error("是否安装了其他钱包？")
                }
                this.linkwallet()
            } else {
                alert("请安装MetaMask")
            }

        },

        async linkwallet() {
            await window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(this.handleAccountChanged)
            .catch((err) => {
                if (err.code === 4001) {
                    // If this happens, the user rejected the connection request.
                    console.log("user rejected")
                } else {
                    // some unexpected error
                    console.error(err)
                }
                
            })
        },

        handleAccountChanged(accounts) {
            if (accounts.length === 0) {
                console.log('请连接Metamask')
            } else {
                // debugger
                // this总是指向调用该函数的对象
                this.currentAccount = accounts[0] 

                // 账户相关状态的初始化也在这里完成
                this.initWeb3()
            }
            
        },

        async updateAccount() {
            window.ethereum.on('accountsChanged',this.handleAccountChanged)
        },

        handleChainChanged(_chainId) {
            this.chainId = _chainId
            window.location.reload()
        },

        async checkNetwork() {
            let _chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (_chainId != '0x1') {
                // alert("请切换到以太坊主网")
            }
            this.chainId = _chainId
        },

        async updateNetwork() {
            window.ethereum.on('chainChanged',this.handleChainChanged)
        },

        initWeb3() {
           if(window.ethereum){
               this.provider = window.ethereum
           } else {
               // 注意这里只能通过ws的方式连接,不能通过HttpProvider
               try{
                   this.provider = new Web3.providers.HttpProvider("https://data-seed-prebsc-2-s2.binance.org:8545")
                    // this.provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/3b71e4840573454784283317c7430054")
                    // this.provider = new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/3b71e4840573454784283317c7430054")
               } catch (error) {
                   console.error(error)
               }
           }
           this.web3 = new Web3(this.provider)
           this.getBalance()
           this.initContract()
           
        },

        async signData() {
            var pro = new Web3Provider.Web3Provider(window.ethereum)
            var signer = pro.getSigner()
            signer.signMessage("1111")
        },

        async initContract() {
            let contract_address = "0x56E020848EEdED7766Da1F096c790eF86b92e4B3"
            this.myContract = new this.web3.eth.Contract(abi,contract_address)
            this.getContractCounter()
        },

        getBalance() {
            this.web3.eth.getBalance(this.currentAccount, (err,wei) =>{
               this.balance = this.web3.utils.fromWei(wei,'ether')
            })
        },

        getContractCounter() {
            this.myContract.methods.getCounter().call((err,result) => {
                console.log("myNum", result)
                this.myNum = result
            })
        },

        async setContractCounter() {
            var self = this
            // let cn = this.contractNum
            this.contractNum = null
            this.myContract.methods.setCounter()
            .send({ from: this.currentAccount })
            .on("receipt", function() {
                // console.log("交易成功了",receipt)
                self.getContractNum()
                
            })
            .on("error", function(error){
                console.log("交易失败了",error)
            })
        }

    },
    watch: {
    },
    mounted: function() {

    }
}

</script>