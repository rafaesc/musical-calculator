import * as MATH from './MathStates'

export const ENTER = 'Enter'
export const BACKSPACE = 'Backspace'
export const CLEAR = 'Clear'
export const POINT = '.'
export const ARROW_LEFT = 'ArrowRight'
export const ARROW_RIGHT = 'ArrowLeft'

export const VALIDATE_KEYS = [ENTER, BACKSPACE, POINT, ' ', ARROW_LEFT, ARROW_RIGHT]

export function filterKey (key) {
  const patternNumber = /^\d+$/
  const patternSymbols = /^\/|\+|\-|\*$/
  if (patternNumber.test(key) ||
    patternSymbols.test(key) ||
    VALIDATE_KEYS.indexOf(key) > -1
  ) {
    return true
  }
  return false
}

export function executeAction (key, actions, numberCurrent, listenKeyboard) {
  if (!listenKeyboard) return
  if ((/^\d+$/).test(key)) {
    const number = parseInt(key, 10)
    if (numberCurrent === '0') {
      actions.updateNumberCurrent(number)
    } else {
      actions.addNumber(number)
    }
  } else if (key === MATH.ADD_SYMBOL) {
    actions.add()
  } else if (key === MATH.MULTIPLY_SYMBOL) {
    actions.multiply()
  } else if (key === MATH.DIVIDE_SYMBOL) {
    actions.divide()
  } else if (key === MATH.SUBSTRACT_SYMBOL) {
    actions.substract()
  } else if (key === ENTER) {
    actions.equal(true)
  } else if (key === POINT) {
    actions.addNumber(POINT)
  } else if (key === BACKSPACE) {
    actions.remove()
  } else if (key === CLEAR) {
    actions.deleted()
  }
}
