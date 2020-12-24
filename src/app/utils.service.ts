import { Injectable } from '@angular/core';
import { ContractService } from './contract.service';
import { WalletService } from './wallet.service';

/*
 Usage:
 - contract has a reference to the multicall address for the relevant network you're on
 - format your argument to makeMulticall as a list of objects:
 multicallFns = {}
  "call1":  {
    target: ADDRESS,
    callData: METHOD.encodeABI()
  }
}
 - makeMulticall returns an object of function results with the same key that you provided in the argument
 - call decode with a string for the relevant type (e.g. "uint256") and the returned value to decode.
 - call decodeList with a list of strings if the returned value is a list.
 - refer to the web3 decodeParameter(s) documentation for more info
*/

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(public wallet: WalletService, public contract: ContractService) { }

  // https://github.com/Jacob-Friesen/obscurejs/blob/master/2018/zipObject.js
  zipObject(keys, values) {
    const obj = {};
    // Assuming the lengths of keys always equals the length of values to simplify the example.
    keys.forEach((key, index) => {
      obj[key] = values[index];
    })
  
    return obj;
  }

  async makeMulticall(multicallFns) {
    const multicallKeys = Object.keys(multicallFns);
    const multicallValues = Object.values(multicallFns);
    let rawResult = await this.contract.MULTICALL.methods.aggregate(multicallValues).call();
    let multicallResults = this.zipObject(multicallKeys, rawResult["returnData"]);
    return(multicallResults);
  }

  decode(type, arg) {
    return(this.wallet.web3.eth.abi.decodeParameter(type, arg));
  }

  decodeList(typeList, arg) {
    return(this.wallet.web3.eth.abi.decodeParameters(typeList, arg));
  }

  toHHMMSS(secs) {
    var sec_num = parseInt(secs, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
  }

}
