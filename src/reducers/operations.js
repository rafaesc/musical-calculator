import * as types from '../constants/ActionTypes'
import { NUMBER_STATE, SYMBOL_STATE } from '../constants/MathStates'
import { listSounds, buffersCache } from '../utils/ListSounds'

const initialState = {
  numberCurrent: '0',
  operator: types.WRITING,
  operatorSave: '',
  numberSave: '0',
  operationCurrent: [],
  finalize: false,
  cacheOperations: [],
  finalizeOperation: false
}

function convertToNumber (str) {
  const number = String(str).replace(/\,/g, '')
  return Number(number)
}

function generateOperationMemory (operationCurrent, state, action) {
  let output = operationCurrent || []
  if (action.waiting && output.length === 0) {
    output = [{
      type: NUMBER_STATE,
      content: state.numberCurrent
    }]
  } else {
    if (output.length === 0) {
      output.push({
        type: NUMBER_STATE,
        content: state.numberCurrent
      })
    } else if ((!state.finalize || action.equal) && action.save !== false) {
      let symbol = state.operatorSave || state.operator
      output.push({
        type: SYMBOL_STATE,
        content: symbol
      })
      output.push({
        type: NUMBER_STATE,
        content: state.numberCurrent
      })
    }
  }
  return output
}

function calc (operationCurrent) {
  let listOperations = operationCurrent.map(item => {
    if (item.type === NUMBER_STATE) {
      return convertToNumber(item.content)
    }
    return item.content
  })
  function rec (arr) {
    if (arr.length < 3) {
      return arr.filter(value => {
        return !isNaN(value)
      })
    }
    let operation = arr.splice(0, 3)
    let result = 0
    switch (operation[1]) {
      case types.ADD:
        result = operation[0] + operation[2]
        break
      case types.SUBSTRACT:
        result = operation[0] - operation[2]
        break
      case types.MULTIPLY:
        result = operation[0] * operation[2]
        break
      case types.DIVIDE:
        result = operation[0] / operation[2]
        break
      default:
        result = operation[0]
        break
    }
    arr.unshift(result)
    return rec(arr)
  }
  const language = navigator.language || 'en-US'
  let output = rec(listOperations)
  if (typeof output[0] !== 'undefined') {
    return parseFloat(output[0]).toLocaleString(language, {
      useGrouping: true,
      maximumFractionDigits: 6
    })
  } else {
    return 'Error'
  }
}

function playMusic (index) {
  if (!index) {
    index = Math.floor(Math.random() * listSounds.length - 1)
  }
  const sound = listSounds[index]
  if (sound && Object.keys(buffersCache).indexOf(sound.src) > -1) {
    sound.audio.play()
  }
}

export default function operations (state = initialState, action) {
  let finalize = state.finalize
  let numberCurrent = state.numberCurrent
  let numberSave = state.numberSave
  let operationCurrent = state.operationCurrent
  let operatorSave = state.operatorSave
  let operator = state.operator
  let cacheOperations = state.cacheOperations
  let finalizeOperation = state.finalizeOperation
  if (finalizeOperation) {
    operationCurrent = []
    finalizeOperation = false
  }
  switch (action.type) {
    case types.UPDATE_NUMBER_CURRENT:
      numberCurrent = action.number
      if (finalize) {
        operationCurrent = generateOperationMemory(operationCurrent, state, action)
        finalize = false
        numberSave = action.number
        numberCurrent = '0'
      }
      if (action.remove) {
        playMusic()
        numberCurrent = String(state.numberCurrent).slice(0, -1)
      }
      return {
        numberCurrent,
        operator,
        operatorSave,
        numberSave,
        operationCurrent,
        finalize,
        cacheOperations,
        finalizeOperation
      }
    case types.CUSTOM_INSIDE:
      playMusic()
      if (action.custom === types.REVERSE) {
        numberCurrent = String(-convertToNumber(numberCurrent))
      } else if (action.custom === types.PERCENT) {
        numberCurrent = String(convertToNumber(numberCurrent) / 100)
      } else if (action.custom === types.SQUARE_ROOT) {
        numberCurrent = String(Math.sqrt(convertToNumber(numberCurrent)))
      }
      return {
        numberCurrent,
        operator,
        operatorSave,
        numberSave,
        operationCurrent,
        finalize,
        cacheOperations,
        finalizeOperation
      }
    case types.ADD_NUMBER:
      playMusic(action.number)
      if (finalize) {
        finalize = false
        numberSave = action.number
        numberCurrent = action.number
      } else {
        let strNumberCurrent = String(state.numberCurrent)
        if (action.number === '.' && strNumberCurrent.indexOf('.') > -1) {
          action.number = ''
          numberCurrent = strNumberCurrent + String(action.number)
        } else if (strNumberCurrent.indexOf('.') === -1 && action.number === '.') {
          numberCurrent = String(strNumberCurrent) + String(action.number)
        } else {
          numberCurrent = String(Number(strNumberCurrent + String(action.number)))
        }
      }
      return {
        numberCurrent,
        operator: state.operator,
        operatorSave,
        numberSave,
        operationCurrent,
        finalize,
        cacheOperations,
        finalizeOperation
      }
    case types.RESTART:
      playMusic()
      if (action.all) {
        operationCurrent = []
        finalize = false
      } else {
        finalize = false
      }
      return {
        numberCurrent: '0',
        operator: types.WRITING,
        operatorSave,
        numberSave: '0',
        operationCurrent,
        finalize,
        cacheOperations,
        finalizeOperation
      }
    case types.EDIT_OPERATION:
      operationCurrent = action.operationCurrent
      numberCurrent = calc(operationCurrent)
      return {
        numberCurrent: '0',
        operator: types.WRITING,
        operatorSave,
        numberSave,
        operationCurrent,
        finalize,
        cacheOperations,
        finalizeOperation
      }
    case types.CALC:
      playMusic()
      finalize = true
      if (state.finalize) {
        operatorSave = action.operator
      }
      operationCurrent = generateOperationMemory(operationCurrent, state, action)
      operatorSave = action.operator
      numberCurrent = calc(operationCurrent)
      if (!action.waiting && action.save) {
        if (operationCurrent.length > 2) {
          cacheOperations.push([...operationCurrent,
            {
              type: SYMBOL_STATE,
              content: types.RESULT
            },
            {
              type: NUMBER_STATE,
              content: numberCurrent
            }
          ])
          if (cacheOperations.length === 6) {
            cacheOperations.shift()
          }
        }
        finalizeOperation = true
      }
      return {
        numberCurrent,
        operator: action.operator,
        operatorSave,
        numberSave: calc(operationCurrent),
        operationCurrent,
        finalize,
        cacheOperations,
        finalizeOperation
      }
    default:
      return state
  }
};
