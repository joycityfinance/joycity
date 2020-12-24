import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.css']
})
export class MonsterComponent implements OnInit {

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, private utils: UtilsService, private activatedRoute: ActivatedRoute) {
    this.resetData();
  }

  monId: string;
  monStruct: any;
  monData: any;

  resetData() {
    this.monStruct = {};
    this.monData = {};
  }

  ngOnInit(): void {
    this.monId = this.activatedRoute.snapshot.paramMap.get('id');
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
      this.monId = routeParams.id;
      if (this.wallet.connected) {
        this.loadData();
      }
    });
  }

  async loadData() {
    let multicallFns = {
      "monData": {
        target: this.constants.MON_MINTER_ADDRESS,
        callData: this.contract.MON_MINTER.methods.monRecords(this.monId).encodeABI()
      }
    }
    let result = await this.utils.makeMulticall(multicallFns);
    this.monStruct = this.utils.decode({
      "parentStruct": {
        "summoner": "address",
        "parent1Id": "uint256",
        "parent2Id": "uint256",
        "minterContract": "address",
        "contractOrder": "uint256",
        "gen": "uint256",
        "bits": "uint256",
        "exp": "uint256",
        "rarity": "uint256"
      }
    }, result["monData"]);

    const response = await fetch("./assets/monData.json");
    const responseObj = await response.json();
    this.monData["name"] = responseObj["1"]["name"] + this.monId;
    this.monData["img"] =  responseObj["1"]["img"];
    this.monData["epithets"] = "The Test Monster";
    this.monData["lore"] = "The Test Monster is large and hideous. Very spooky." + this.monId;
  }
}
