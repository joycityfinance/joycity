import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { WalletService } from './wallet.service';
import BigNumber from 'bignumber.js';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(public wallet: WalletService, public constants: ConstantsService) { 
    this.loadData();
  }

  public get ClAIMER() {
    const abi = require('../assets/abi/Claimer.json');
    const address = this.constants.CLAIMER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get XMON() {
    const abi = require('../assets/abi/ERC20.json');
    const address = this.constants.XMON_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get MON_MINTER() {
    const abi = require('../assets/abi/MonMinter.json');
    const address = this.constants.MON_MINTER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get MON_STAKER() {
    const abi = require('../assets/abi/MonStaker.json');
    const address = this.constants.MON_STAKER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get MON_SPAWNER() {
    const abi = require('../assets/abi/MonSpawner.json');
    const address = this.constants.MON_SPAWNER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get MULTICALL() {
    const abi = require('../assets/abi/Multicall.json');
    const address = this.constants.MULTICALL_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get NFT_AGG() {
    const abi = require('../assets/abi/NFTAggregator.json');
    const address = this.constants.NFT_AGGREGATOR_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }
  

  async loadData() {
    // this.currBlock = new BigNumber(await this.wallet.web3.eth.getBlockNumber());
  }
}
