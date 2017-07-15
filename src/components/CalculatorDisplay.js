import * as Rx from 'rxjs'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { filterKey } from '../constants/KeyboardCodes'

export default class CalculatorDisplay extends Component {
  constructor (props) {
    super(props)
    this.handleGoClick = this.handleGoClick.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  static propTypes = {
    text: PropTypes.any.isRequired,
    updateNumberCurrent: PropTypes.any
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.text !== this.props.text) {
      this.setInputValue(nextProps.text)
    }
  }

  componentDidMount () {
    const keydownEvent = Rx.Observable.fromEvent(this.inputNode, 'keydown')
      .filter((e) => filterKey(e.key))
    keydownEvent.subscribe((e) => {
      e.preventDefault()
    })
    const keyupEvent = Rx.Observable.fromEvent(this.inputNode, 'keyup')
    keyupEvent.subscribe((e) => {
      this.handleKeyUp(e)
    })
  }

  focusInput () {
    this.inputNode.focus()
  }

  getInputValue () {
    return this.inputNode.value
  }

  setInputValue (val) {
    this.inputNode.value = val
  }

  handleKeyUp (e) {
    this.handleGoClick(e)
  }

  handleGoClick (e) {
    let value = this.getInputValue()
    if (!value || value.length === 0) {
      value = 0
    }
    this.props.updateNumberCurrent(parseInt(value))
  }

  render () {
    return <div className='calculator-display'>
      <input
        disabled
        ref={ref => (this.inputNode = ref)}
        defaultValue={this.props.text} />
    </div>
  }
}
