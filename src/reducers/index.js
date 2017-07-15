import { combineReducers } from 'redux'
import operations from './operations'
import loading from './loading'

const reducers = combineReducers({
  operations,
  loading
})

export default reducers
