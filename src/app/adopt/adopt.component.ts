import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { UtilsService } from '../utils.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-adopt',
  templateUrl: './adopt.component.html',
  styleUrls: ['./adopt.component.css']
})
export class AdoptComponent implements OnInit {

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, public utils: UtilsService) { 
    this.resetData();
  }

  stakeAmount: string;
  stakedTcat: BigNumber;
  maxStakeAmount: BigNumber;
  tcatBalance: BigNumber;
  milkBalance: BigNumber;
  milkFee: BigNumber;
  blockNumber: any;
  unlockBlock: BigNumber;
  baseDelay: BigNumber;
  currentDelay: BigNumber;
  maxDelay: BigNumber;
  resetFee: BigNumber;
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
    this.stakedTcat = new BigNumber(0);
    this.maxStakeAmount = new BigNumber(0);
    this.tcatBalance = new BigNumber(0);
    this.milkBalance = new BigNumber(0);
    this.milkFee = new BigNumber(0);
    this.unlockBlock = new BigNumber(0);
    this.baseDelay = new BigNumber(0);
    this.currentDelay = new BigNumber(0);
    this.resetFee = new BigNumber(0);
    this.maxDelay = new BigNumber(0);
    this.numCats = new BigNumber(0);
    this.maxCats = new BigNumber(0);
  }

  async loadData() {

    const multicallFns = {
      "tcatBalance": {
        target: this.constants.TCAT_ADDRESS,
        callData: this.contract.TCAT.methods.balanceOf(this.wallet.userAddress).encodeABI()
      },
      "maxStakeAmount": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.maxStake().encodeABI()
      },
      "milkFee": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.milkFee().encodeABI()
      },
      "milkBalance": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.milkBalances(this.wallet.userAddress).encodeABI()
      },
      "pendingMilkBalance": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.pendingMilk(this.wallet.userAddress).encodeABI()
      },
      "unlockBlock": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.nextAdoptTime(this.wallet.userAddress).encodeABI()
      },
      "baseDelay": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.startDelay().encodeABI()
      },
      "currentDelay": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.adoptDelay(this.wallet.userAddress).encodeABI()
      },
      "resetFee": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.resetFee().encodeABI()
      },
      "stakeRecords": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.stakeRecords(this.wallet.userAddress).encodeABI()
      },
      "maxDelay": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.maxDelay().encodeABI()
      },
      "numCats": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.numCats().encodeABI()
      },
      "maxCats": {
        target: this.constants.CAT_STAKER_ADDRESS,
        callData: this.contract.CAT_STAKER.methods.maxCats().encodeABI()
      }
    };

    const multicallKeys = Object.keys(multicallFns);
    const multicallValues = Object.values(multicallFns);
    let rawResult = await this.contract.MULTICALL.methods.aggregate(multicallValues).call();
    let multicallResults = this.utils.zipObject(multicallKeys, rawResult["returnData"]);

    this.blockNumber = rawResult["blockNumber"];
    this.tcatBalance = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["tcatBalance"])).div(this.constants.PRECISION);
    this.maxStakeAmount = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["maxStakeAmount"])).div(this.constants.PRECISION);

    this.milkFee = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["milkFee"])).div(this.constants.MILK_SCALING);
    let currMilkBalance = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["milkBalance"]))
    let pendingMilkBalance = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["pendingMilkBalance"]));
    this.milkBalance = currMilkBalance.plus(pendingMilkBalance).div(this.constants.MILK_SCALING);

    this.unlockBlock = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["unlockBlock"]));
    this.baseDelay = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["baseDelay"]));
    this.resetFee = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["resetFee"])).div(this.constants.PRECISION);
    this.currentDelay = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["currentDelay"]));
    this.maxDelay = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["maxDelay"]));
    this.stakedTcat = new BigNumber(this.wallet.web3.eth.abi.decodeParameter({
      "stakeRecord": {
        "amount": "uint256",
        "startBlock": "uint256"
      }
    }, multicallResults["stakeRecords"])["amount"]).div(this.constants.PRECISION);
    this.numCats = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["numCats"]));
    this.maxCats = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["maxCats"]));
  }

  stake() {
    if (!this.stakeAmount) {
      this.stakeAmount = '0';
    }
    if (this.stakeAmount === '0') {
      alert("Must have stake greater than 0!");
      return;
    }
    const formattedStakeAmount = new BigNumber(this.stakeAmount).times(this.constants.PRECISION).integerValue().toFixed();
    const maxStake = this.maxStakeAmount.times(this.constants.PRECISION).integerValue().toFixed();

    if (this.stakedTcat.plus(formattedStakeAmount).gt(maxStake)) {
      alert("Staking more than max stake!");
      return;
    }

    const func = this.contract.CAT_STAKER.methods.addStake(formattedStakeAmount);
    this.wallet.sendTxWithToken(func, this.contract.TCAT, this.constants.CAT_STAKER_ADDRESS, formattedStakeAmount,
      200000, () => { }, () => {
        this.loadData();
      }, () => { });
  }

  removeStake() {
    const func = this.contract.CAT_STAKER.methods.removeStake();
    this.wallet.sendTx(func, () => { }, () => {
      this.loadData();
    }, () => { });
  }

  claimMilk() {
    const func = this.contract.CAT_STAKER.methods.awardMilk(this.wallet.userAddress);
    this.wallet.sendTx(func, () => { }, () => {
      this.loadData();
    }, () => { });
  }

  claimCat() {
    const func = this.contract.CAT_STAKER.methods.claimCat();
    this.wallet.sendTx(func, () => { }, () => {
      this.loadData();
    }, () => { });
  }

  resetDelay() {
    const func = this.contract.CAT_STAKER.methods.resetDelay();
    this.wallet.sendTx(func, () => { }, () => {
      this.loadData();
    }, () => { });
  }

  getMilkPerHour() {
    let milkPerHour = this.stakedTcat.times(new BigNumber(9)).div(new BigNumber(2)).times(new BigNumber(60)).times(this.constants.PRECISION).div(this.constants.MILK_SCALING);
    return milkPerHour;
  }

  adoptAvailable() {
    return this.unlockBlock.lt(this.blockNumber);
  }
}