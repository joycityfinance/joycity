import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  
  PRECISION = 1e18;
  MILK_SCALING = 1e21;

  // Mainnet address
  CLAIMER_ADDRESS = '0xe354AC0bB78a8013617fe0efA6099769749F027C';
  S3_URL = 'https://tomcatcity.herokuapp.com/';
  API_URL = 'https://tomcatcity.herokuapp.com/cats/';

  // new stuff (rinkeby network for now) (note you have to change chainId in web3Enabled)
  TCAT_ADDRESS = '0x8dc2f7D19217245b117aEBa0f1D050c9e85c7767';
  CAT_MINTER_ADDRESS = '0x9683D905cAa55743ac63c464C34053B0b219Cc8D';
  CAT_STAKER_ADDRESS = '0xF81d6EBAE82b429Dcf0b29fddC4d17538Ac0EAD8';
  CAT_BREEDER_ADDRESS = '0x39D327150ff6F7D59F6BB698895CbFAD2c4816C2';

  MULTICALL_ADDRESS = '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821';
  NFT_AGGREGATOR_ADDRESS = '0x03Cb9a56c5F7Ce6796562730E3D217B1F4Dd428b';

  // Mainnet address
  LP_POOL_REWARDS_ADDRESS = '0x57Ffef72352f285a9477293d35Bacc9C6667eEBf';
  // need to change this to LP pool address
}