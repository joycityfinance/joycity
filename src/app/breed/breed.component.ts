import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { ContractService } from '../contract.service';
import { ConstantsService } from '../constants.service';
import { UtilsService } from '../utils.service';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-merge',
  templateUrl: './breed.component.html',
  styleUrls: ['./breed.component.css']
})
export class BreedComponent implements OnInit {

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, public utils: UtilsService) { 
    this.resetData();
  }

  blockNumber: BigNumber;
  catLeft: any;
  catRight: any;
  catList: any;
  catLookup: any;
  breedFee: BigNumber;
  tcatBalance: BigNumber;
  numCats: BigNumber;
  maxCats: BigNumber;

  ngOnInit(): void {
    if (this.wallet.connected) {
      this.loadData();
    }
    this.wallet.connectedEvent.subscribe(() => {
      this.loadData();
    });
    this.wallet.errorEvent.subscribe(() => {
      this.resetData();
    });
  }

  resetData() {
    this.blockNumber = new BigNumber(0);
    this.catLeft = "";
    this.catRight = "";
    this.catList = [];
    this.catLookup = {};
    this.breedFee = new BigNumber(0);
    this.tcatBalance = new BigNumber(0);
    this.numCats = new BigNumber(0);
    this.maxCats = new BigNumber(0);
  }

  async loadData() {

    let multicallFns = {
      "catIds": {
        target: this.constants.NFT_AGGREGATOR_ADDRESS,
        callData: this.contract.NFT_AGG.methods.getIds(this.constants.CAT_MINTER_ADDRESS, this.wallet.userAddress).encodeABI()
      },
      "breedFee": {
        target: this.constants.CAT_BREEDER_ADDRESS,
        callData: this.contract.CAT_BREEDER.methods.breedFee.call().encodeABI()
      },
      "tcatBalance": {
        target: this.constants.TCAT_ADDRESS,
        callData: this.contract.TCAT.methods.balanceOf(this.wallet.userAddress).encodeABI()
      },
      "numCats": {
        target: this.constants.CAT_BREEDER_ADDRESS,
        callData: this.contract.CAT_BREEDER.methods.numCats.call().encodeABI()
      },
      "maxCats": {
        target: this.constants.CAT_BREEDER_ADDRESS,
        callData: this.contract.CAT_BREEDER.methods.maxCats.call().encodeABI()
      }
    };
    let multicallKeys = Object.keys(multicallFns);
    let multicallValues = Object.values(multicallFns);
    let rawResult = await this.contract.MULTICALL.methods.aggregate(multicallValues).call();
    this.blockNumber = rawResult["blockNumber"];
    let multicallResults = this.utils.zipObject(multicallKeys, rawResult["returnData"]);
    this.breedFee = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["breedFee"])).div(this.constants.PRECISION);
    this.tcatBalance = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["tcatBalance"])).div(this.constants.PRECISION);
    this.numCats = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["numCats"]));
    this.maxCats = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["maxCats"]));

    // Get unlock blocks in second multicall
    let catIdList = this.wallet.web3.eth.abi.decodeParameter('uint256[]', multicallResults["catIds"]);
    let newCall = {};
    for (let i of catIdList) {
      newCall[i.toString()] = {
        target: this.constants.CAT_BREEDER_ADDRESS,
        callData: this.contract.CAT_BREEDER.methods.catUnlock(i).encodeABI()
      }
    }
    multicallKeys = Object.keys(newCall);
    multicallValues = Object.values(newCall);
    rawResult = await this.contract.MULTICALL.methods.aggregate(multicallValues).call();
    multicallResults = this.utils.zipObject(multicallKeys, rawResult["returnData"]);

    const response = await fetch("./assets/catData.json");
    const responseObj = await response.json();
    for (let i of catIdList) {
      let obj = {};
      obj["id"] = i;
      obj["name"] = responseObj["1"]["name"] + i;
      obj["img"] =  responseObj["1"]["img"];
      obj["unlockBlock"] = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults[i]));
      this.catList.push(obj);
      this.catLookup[i] = obj;
    }
  }

  breedNewCat() {
    if (this.catLeft === this.catRight) {
      alert("You can't 💕 Bang Bang 💕 yourself!");
      return;
    }
    if (this.getUnlockBlock(this.catLeft).gt(this.blockNumber)) {
      alert(this.getName(this.catLeft) + " is not yet ready for breeding!");
      return;
    }
    if (this.getUnlockBlock(this.catRight).gt(this.blockNumber)) {
      alert(this.getName(this.catRight) + " is not yet ready for breedng!");
      return;
    }
    else {
      const func = this.contract.CAT_BREEDER.methods.breedNewCat(this.catLeft, this.catRight);
      this.wallet.sendTxWithToken(func, this.contract.TCAT, this.constants.CAT_BREEDER_ADDRESS, this.breedFee, 550000, ()=>{}, ()=>{
        this.loadData();
      }, ()=>{});
    }
  }

  getName(id) {
    if (id === "") {
      return "";
    }
    return this.catLookup[id]["name"];
  }

  getImg(id) {
    if (id === "") {
      return "./assets/placeholder.png";
    }
    return this.catLookup[id]["img"];
  }

  getUnlockBlock(id) {
    if (id === "") {
      return new BigNumber(0);
    }
    return this.catLookup[id]["unlockBlock"];
  }
}
