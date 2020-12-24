import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-cat',
  templateUrl: './cat.component.html',
  styleUrls: ['./cat.component.css']
})
export class CatComponent implements OnInit {

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, private utils: UtilsService, private activatedRoute: ActivatedRoute) {
    this.resetData();
  }

  catId: string;
  catStruct: any;
  catData: any;

  resetData() {
    this.catStruct = {};
    this.catData = {};
  }

  ngOnInit(): void {
    this.catId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.wallet.connected) {
      this.loadData();
    }
    this.wallet.connectedEvent.subscribe(() => {
      this.loadData();
    });
    this.wallet.errorEvent.subscribe(() => {
      this.resetData();
    });

    this.activatedRoute.params.subscribe(routeParams => {
      this.catId = routeParams.id;
      if (this.wallet.connected) {
        this.loadData();
      }
    });
  }

  async loadData() {
    let multicallFns = {
      "catData": {
        target: this.constants.CAT_MINTER_ADDRESS,
        callData: this.contract.CAT_MINTER.methods.catRecords(this.catId).encodeABI()
      }
    }
    let result = await this.utils.makeMulticall(multicallFns);
    this.catStruct = this.utils.decode({
      "parentStruct": {
        "adopter": "address",
        "parent1Id": "uint256",
        "parent2Id": "uint256",
        "minterContract": "address",
        "contractOrder": "uint256",
        "gen": "uint256",
        "bits": "uint256",
        "exp": "uint256",
        "rarity": "uint256"
      }
    }, result["catData"]);

    const response = await fetch("./assets/catData.json");
    const responseObj = await response.json();
    this.catData["name"] = responseObj["1"]["name"] + this.catId;
    this.catData["img"] =  responseObj["1"]["img"];
    this.catData["epithets"] = "The Tom Cat";
    this.catData["lore"] = "The Tom Cat is small and furry. Very cute." + this.catId;
  }
}
