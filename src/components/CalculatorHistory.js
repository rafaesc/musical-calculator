import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BASE, SYMBOL_STATE, NUMBER_STATE, CONVERT } from '../constants/MathStates'
import CalculatorPlayground from './CalculatorPlayground'

export default class CalculatorHistory extends Component {
  constructor (props) {
    super(props)
    this.convertStringToOperation = this.convertStringToOperation.bind(this)
  }

  static propTypes = {
    state: PropTypes.any.isRequired,
    handlerKeyboard: PropTypes.any,
    editOperation: PropTypes.any,
    equal: PropTypes.any
  }

  componentWillReceiveProps (nextProps) {
    if (this.history) {
      this.history.scrollTop += 1000
    }
  }

  covertOperationToString (operations, finalizeOperation = false, operator = false) {
    let output = operations.map(item => {
      if (item.type === SYMBOL_STATE) {
        return BASE[item.content]
      }
      return item.content
    })

    if (!finalizeOperation && operator && operations.length > 0) {
      output.push(BASE[operator])
    }

    return output.join(' ')
  }

  generateHistory () {
    const operationsState = this.props.state.operations
    const listOperations = operationsState.cacheOperations
          .map(this.covertOperationToString)
    return listOperations.map((item, index) =>
      <div key={index}>{item}</div>
    )
  }

  convertStringToOperation (str) {
    str = String(str)
    const pattern = /\d*\.?\d+|\/|\+|\-|\*/g
    const output = str.match(pattern).map(item => {
      if (!isNaN(item)) {
        return {
          type: NUMBER_STATE,
          content: item
        }
      } else {
        return {
          type: SYMBOL_STATE,
          content: CONVERT[item]
        }
      }
    })
    this.props.editOperation(output)
  }

  render () {
    const handlerKeyboard = this.props.handlerKeyboard
    const equal = this.props.equal
    const operationsState = this.props.state.operations
    const operations = operationsState.operationCurrent
    const operator = operationsState.operatorSave
    const finalizeOperation = operationsState.finalizeOperation
    const operationsCurrentText = this.covertOperationToString(operations, finalizeOperation, operator)
    return (
      <div className={'calculator-history'}>
        <div className={'calculator-cache'} ref={ref => (this.history = ref)}>
          {this.generateHistory()}
        </div>
        <div className={'calculator-playground'}>
          <CalculatorPlayground currentPath={operationsCurrentText}
            handlerKeyboard={handlerKeyboard}
            enter={equal}
            handleSubmit={this.convertStringToOperation} />
        </div>
      </div>
    )
  }
}
