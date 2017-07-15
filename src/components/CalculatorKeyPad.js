import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from './Button'

export default class CalculatorKeypad extends Component {
  constructor (props) {
    super(props)
    this.addPoint = this.addPoint.bind(this)
  }

  static propTypes = {
    add: PropTypes.func.isRequired,
    substract: PropTypes.func.isRequired,
    multiply: PropTypes.func.isRequired,
    divide: PropTypes.func.isRequired,
    equal: PropTypes.func.isRequired,
    restart: PropTypes.func.isRequired,
    deleted: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    reverse: PropTypes.func.isRequired,
    percent: PropTypes.func.isRequired,
    squareRoot: PropTypes.func.isRequired,
    addNumber: PropTypes.func.isRequired
  }

  addNumber (number) {
    return this.props.addNumber.bind(this, number)
  }

  addPoint () {
    this.props.addNumber('.')
  }

  render () {
    return (
      <div className={'calculator-keypad'}>
        <div className={'calculator-body'}>
          <div className={'calculator-keys'}>
            <div className={'calculator-head'}>
              <Button operationAction={this.props.remove} className={'delete'}>BORRAR</Button>
              <Button operationAction={this.props.deleted}>CE</Button>
              <Button operationAction={this.props.restart}>C</Button>
            </div>
            <div className={'calculator-number'}>
              <Button operationAction={this.props.equal} className={'equal'}>=</Button>
              <Button operationAction={this.addNumber(0)}>{0}</Button>
              <Button operationAction={this.addNumber(1)}>{1}</Button>
              <Button operationAction={this.addNumber(2)}>{2}</Button>
              <Button operationAction={this.addNumber(3)}>{3}</Button>
              <Button operationAction={this.addNumber(4)}>{4}</Button>
              <Button operationAction={this.addNumber(5)}>{5}</Button>
              <Button operationAction={this.addNumber(6)}>{6}</Button>
              <Button operationAction={this.addNumber(7)}>{7}</Button>
              <Button operationAction={this.addNumber(8)}>{8}</Button>
              <Button operationAction={this.addNumber(9)}>{9}</Button>
            </div>
          </div>
          <div className={'calculator-another'}>
            <Button operationAction={this.props.reverse}>+/-</Button>
            <Button operationAction={this.props.squareRoot}>RAIZ</Button>
            <Button operationAction={this.props.percent}>%</Button>
            <Button operationAction={this.addPoint} className={'dot'}>.</Button>
          </div>
          <div className={'calculator-operators'}>
            <Button operationAction={this.props.add}>+</Button>
            <Button operationAction={this.props.substract}>-</Button>
            <Button operationAction={this.props.multiply}>*</Button>
            <Button operationAction={this.props.divide}>/</Button>
          </div>
        </div>
      </div>
    )
  }
}
