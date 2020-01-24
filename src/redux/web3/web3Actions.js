import { STORE_WEB3 } from './web3Types'

export const storeWeb3 = (web3) => {
  return {
    type: STORE_WEB3,
    payload: web3
  }
}
