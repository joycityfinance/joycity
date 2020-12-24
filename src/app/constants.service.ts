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
  TCAT_ADDRESS = '0x742f6aACd9e556536FFF34f90f885b2be65615ca';
  CAT_MINTER_ADDRESS = '0x57F6c527BfBF9bF28B1bA1bb8bFBa9fE8e7A6C54';
  CAT_STAKER_ADDRESS = '0xF81d6EBAE82b429Dcf0b29fddC4d17538Ac0EAD8';
  CAT_BREEDER_ADDRESS = '0x5D13E1dE2770d754b1943296Eed94873988f03F1';

  MULTICALL_ADDRESS = '0xB5d18FA2712e2d37133E41BB09f1E44b47Fe6f46';
  NFT_AGGREGATOR_ADDRESS = '0x32617D23A72DC3f69b8F4b30D31525E72af42C48';

  // Mainnet address
  LP_POOL_REWARDS_ADDRESS = '0x57Ffef72352f285a9477293d35Bacc9C6667eEBf';
  // need to change this to LP pool address
}