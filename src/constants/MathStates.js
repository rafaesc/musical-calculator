import * as types from './ActionTypes'

export const NUMBER_STATE = 'number'
export const SYMBOL_STATE = 'symbol'

export const ADD_SYMBOL = '+'
export const SUBSTRACT_SYMBOL = '-'
export const MULTIPLY_SYMBOL = '*'
export const DIVIDE_SYMBOL = '/'
export const RESULT_SYMBOL = '='

export const BASE = {
  [types.ADD]: ADD_SYMBOL,
  [types.SUBSTRACT]: SUBSTRACT_SYMBOL,
  [types.MULTIPLY]: MULTIPLY_SYMBOL,
  [types.DIVIDE]: DIVIDE_SYMBOL,
  [types.RESULT]: RESULT_SYMBOL,
}
export const CONVERT = {
  [ADD_SYMBOL]: types.ADD,
  [SUBSTRACT_SYMBOL]: types.SUBSTRACT,
  [MULTIPLY_SYMBOL]: types.MULTIPLY,
  [DIVIDE_SYMBOL]: types.DIVIDE,
  [RESULT_SYMBOL]: types.RESULT,
}
