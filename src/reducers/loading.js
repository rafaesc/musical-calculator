import * as types from '../constants/ActionTypes'

const initialState = {
  loading: true,
}

export default function loading (state = initialState, action) {
  switch (action.type) {
    case types.DONE:
      return {
        loading: false
      }
    case types.LOADING:
      return {
        loading: true
      }
    default:
      return state
  }
}
