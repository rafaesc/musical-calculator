import * as Rx from 'rxjs'
import * as types from '../constants/ActionTypes'
import Storage from './storage'
import { STORAGE } from '../constants/StorageType'
import { buffersCache, listSounds } from '../utils/ListSounds'

export const equalOperator = (action$, store) => {
  return action$.ofType(types.EQUAL)
    .map(state => {
      const operations = store.getState().operations
      let operator = state.operator
      let waiting = true
      let equal = false
      if (!operator) {
        operator = operations.operator
        waiting = false
        equal = true
      }
      const saveStore = Rx.Observable.of(operations)
        .delay(1000)

      saveStore.subscribe(() => {
        Storage.set(STORAGE, {
          loading: {
            loading: false,
          },
          operations: {
            numberCurrent: '0',
            operator: types.WRITING,
            operatorSave: '',
            numberSave: '0',
            operationCurrent: [],
            finalize: false,
            cacheOperations: operations.cacheOperations,
            finalizeOperation: false
          } })
      })

      return {
        type: types.CALC,
        waiting,
        operator,
        equal,
        save: state.save
      }
    })
}

export const loading = (action$, store) => {
  return action$.ofType(types.LOADING).delay(500).map(state => {
    const result = listSounds.every(item => {
      return Object.keys(buffersCache).indexOf(item.src) > -1
    })
    if (!result) {
      return {
        type: types.LOADING
      }
    } else {
      return {
        type: types.DONE
      }
    }
  })
}
