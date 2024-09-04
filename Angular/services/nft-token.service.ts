import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import detectEthereumProvider from "@metamask/detect-provider";
import { BigNumber, ethers } from "ethers";
import { MARKET_SHELL_ABI, ABI2, ERC20_ABI_JSON, ERC721_ABI_JSON } from '../pages/add-mint/constants/constants';
import { getGasPrice } from '../utils/utils';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class NftTokenService {

  constructor( private commonService: CommonService) { }

  publicAddress!: string
  marketMysAddress: string = environment.marketSCAddress;
  contract_address: string = environment.mysSCAddress;
  erc20sc_address : string = environment.ERC20Address;
  erc721sc_address : string = environment.ERC721Address;
  provider!: any;
  metaMaskDetected = false;


  async detectMetaMask(){
     await this.hasMetaMask();
     this.metaMaskDetected = true;
  }


  async hasMetaMask() {
    let provider;
    if(this.metaMaskDetected){
      return this.provider || false;
    }else{
      provider = await detectEthereumProvider();
    }
    if (provider) {
      this.provider = provider;
      return this.provider
    }
    return false;
  }

  getPublicAddressIfPresent() {
    return this.publicAddress;
  }

  async getPublicAddress(): Promise<string> {
    let provider = await this.hasMetaMask();
    if (!provider)
      throw new Error('Metamask not found');

    const metamaskProvider = provider;
    const accounts = await metamaskProvider.request({ method: 'eth_requestAccounts' })
    if (Array.isArray(accounts) && accounts.length) {
      this.publicAddress = accounts[0];
      return accounts[0];
    }
    throw new Error('Public address not found');
  }



  async signMessage(publicAddress: string, nonce: string, checkChainId = true): Promise<{ signature: string, nonce: string }> {
    let provider = await this.hasMetaMask();
    if(checkChainId){
      await this.getAndHandleChainId();
    }
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signature = await web3Provider.getSigner(publicAddress).signMessage(nonce)
    return { signature: signature, nonce: nonce }
  }



  async checkItemAlreadyInMarket(token_id: string) {
    let provider = await this.hasMetaMask();
    await this.getPublicAddress();
    await this.getAndHandleChainId();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(this.marketMysAddress, MARKET_SHELL_ABI, signer);
    const res: BigNumber = await contract.getItemIdByTokenId(this.contract_address, token_id);
    return res;
  }

  async buyNftToken(itemId: BigNumber, price: number) {
    let provider = await this.hasMetaMask();
    await this.getAndHandleChainId();
    await this.getPublicAddress();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(this.marketMysAddress, MARKET_SHELL_ABI, signer);
    // const options = { value: ethers.utils.parseEther(price.toString()) }
    const gasPrice = getGasPrice(web3Provider, 2);
    await this.commonService.getconversionfactorETHToUSD()
    const exchangeRate = Math.round(this.commonService.costOfETHInUSD);
    const reciept = await contract.buyERC20(itemId , exchangeRate , { gasPrice });
    const res = await reciept.wait();
    return res
  }


  async getBalance() {
      let provider = await this.hasMetaMask();
      let publicAddress = await this.getPublicAddress();
      await this.getAndHandleChainId();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const erc20contract = new ethers.Contract(this.erc20sc_address , ERC20_ABI_JSON, signer);
      const reciept = await erc20contract.balanceOf(publicAddress);
      return +ethers.utils.formatEther(reciept);  
  }


  async checkAllowance(){
    let provider = await this.hasMetaMask();
    let publicAddress = await this.getPublicAddress();
    await this.getAndHandleChainId();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const erc20contract = new ethers.Contract(this.erc20sc_address, ERC20_ABI_JSON, signer);
    const reciept = await erc20contract.allowance(publicAddress, this.marketMysAddress);
    console.log(reciept);
    return +ethers.utils.formatEther(reciept);
  }

  async approve(amount : number){
    let provider = await this.hasMetaMask();
    let publicAddress = await this.getPublicAddress();
    await this.getAndHandleChainId();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const erc20contract = new ethers.Contract(this.erc20sc_address, ERC20_ABI_JSON, signer);
    const amountInWei = ethers.utils.parseEther(amount.toString()).toString();
    const gasPrice = getGasPrice(web3Provider, 2);
    const reciept = await erc20contract.approve(this.marketMysAddress, amountInWei, { gasPrice })
    return await reciept.wait();

  }
  async getChainId(){
    let provider = await this.hasMetaMask();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    return chainId.toString();
  }

  async handleChainIdChange(chainId : string){
    let newChainId = parseInt(chainId, 16);
    if(newChainId !== environment.networkChainId){
      await this.addChainNetwork();
    }
  }

  async getAndHandleChainId(){
    let chainId = await this.getChainId();
    await this.handleChainIdChange(chainId);
  }

  async addChainNetwork(){
    try {
      let provider = await this.hasMetaMask();
      if (!provider)
        throw new Error('Metamask not found');
      const metamaskProvider = provider;
      let res = await metamaskProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: environment.networkChainIdHex }], // Hexadecimal version of 80001, prefixed with 0x
      });
      return res;
  } catch (error: any) {
      if (error.code === 4902) {
          try {
            let provider = await this.hasMetaMask();
            if (!provider)
              throw new Error('Metamask not found');
              const metamaskProvider = provider;

              let res = await metamaskProvider.request({
                  method: 'wallet_addEthereumChain',
                  params: [{ 
                      chainId: environment.networkChainIdHex, // Hexadecimal version of 80001, prefixed with 0x
                      chainName: environment.chainName,
                      nativeCurrency: {
                          name: "MATIC",
                          symbol: "MATIC",
                          decimals: 18,
                      },
                      rpcUrls: [environment.rpcUrls],
                      blockExplorerUrls: [environment.blockExplorerUrl],
                      iconUrls: [""],
              
                  }],
              });
              console.log(res)
              return res;
          } catch (addError){
            
              console.log('Did not add network');
          }
      }
  }
  }
  async mintERC20(amount = '1000000000000000000000000') {
    let provider = await this.hasMetaMask();
    let publicAddress = await this.getPublicAddress();
    await this.getAndHandleChainId();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const erc20contract = new ethers.Contract(this.erc20sc_address , ERC20_ABI_JSON, signer);
    const reciept = await erc20contract.mint(publicAddress, amount);
    const res = await reciept.wait();
    return res;  
}

async mintERC721(amount = '1000000000000000000000000') {
  let provider = await this.hasMetaMask();
  let publicAddress = await this.getPublicAddress();
  await this.getAndHandleChainId();
  const web3Provider = new ethers.providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();
  const erc721contract = new ethers.Contract(this.erc721sc_address , ERC721_ABI_JSON, signer);
  const reciept = await erc721contract.mint(publicAddress, 'google.com/url');
  const res = await reciept.wait();
  return res;  
}

  async checkForMaticBalanceBeforeBuying(){
    let provider = await this.hasMetaMask();
    await this.getAndHandleChainId();
    let publicAddress = await this.getPublicAddress();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const balance = await web3Provider.getBalance(publicAddress);
    return { publicAddress , balance : ethers.utils.formatEther(balance) , fee: 0.2 };
  }
}