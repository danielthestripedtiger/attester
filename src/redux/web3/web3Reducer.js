import { STORE_WEB3 } from './web3Types'

const initialState = {
  web3: null
}

const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_WEB3: return {
      ...state,
      web3: action.payload
    }

    default: return state
  }
}

export default web3Reducer
