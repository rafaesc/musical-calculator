import { applyMiddleware, createStore as createReduxStore } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { equalOperator, loading } from '../middleware'
import reducer from '../reducers'

const createStore = (initialState = {}) => {
  const rootEpic = combineEpics(
    equalOperator, loading
  )

  const epicMiddleware = createEpicMiddleware(rootEpic)

  const store = createReduxStore(
    reducer,
    initialState,
    applyMiddleware(epicMiddleware)
  )

  return store
}

export default createStore
