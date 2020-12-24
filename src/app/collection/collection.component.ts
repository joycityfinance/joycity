import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { ContractService } from '../contract.service';
import { ConstantsService } from '../constants.service';
import { UtilsService } from '../utils.service';
import { CommonModule } from "@angular/common";
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, public utils: UtilsService) { 
    this.resetData();
  }

  monList: any;

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
    this.monList = [];
  }

  async loadData() {
    
    let multicallFns = {
      "monIds": {
        target: this.constants.NFT_AGGREGATOR_ADDRESS,
        callData: this.contract.NFT_AGG.methods.getIds(this.constants.MON_MINTER_ADDRESS, this.wallet.userAddress).encodeABI()
      }
    };
    let multicallKeys = Object.keys(multicallFns);
    let multicallValues = Object.values(multicallFns);
    let rawResult = await this.contract.MULTICALL.methods.aggregate(multicallValues).call();
    let multicallResults = this.utils.zipObject(multicallKeys, rawResult["returnData"]);
    let monIdList = this.wallet.web3.eth.abi.decodeParameter('uint256[]', multicallResults["monIds"]);

    const response = await fetch("./assets/monData.json");
    const responseObj = await response.json();
    for (let i of monIdList) {
      let obj = {};
      obj["id"] = i;
      obj["name"] = responseObj["1"]["name"] + i;
      obj["img"] =  responseObj["1"]["img"];
      this.monList.push(obj);
    }
  }

}
