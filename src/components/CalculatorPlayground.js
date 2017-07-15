import * as Rx from 'rxjs'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { filterKey } from '../constants/KeyboardCodes'

export default class CalculatorPlayground extends Component {
  constructor (props) {
    super(props)
    this.handleGoClick = this.handleGoClick.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  static propTypes = {
    currentPath: PropTypes.any.isRequired,
    handleSubmit: PropTypes.any,
    handlerKeyboard: PropTypes.any,
    enter: PropTypes.any
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentPath !== this.props.currentPath) {
      this.setInputValue(nextProps.currentPath)
    }
  }

  componentDidMount () {
    const keyupEvent = Rx.Observable.fromEvent(this.inputNode, 'keyup')
      .debounceTime(1000)

    keyupEvent.subscribe((e) => {
      this.handleKeyUp(e)
    })
    const keydownEvent = Rx.Observable.fromEvent(this.inputNode, 'keydown')
    keydownEvent.subscribe((e) => {
      if (!filterKey(e.key)) {
        e.preventDefault()
      }
    })
    const focusEvent = Rx.Observable.fromEvent(this.inputNode, 'focus')
    focusEvent.subscribe((e) => {
      this.props.handlerKeyboard(false)
    })
    const blurEvent = Rx.Observable.fromEvent(this.inputNode, 'blur')
    blurEvent.subscribe((e) => {
      this.props.handlerKeyboard(true)
    })
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
    this.props.handleSubmit(value)
    this.props.enter(false)
  }

  render () {
    return <textarea
      className='current-path-input'
      ref={ref => (this.inputNode = ref)}
      defaultValue={this.props.currentPath}>
    </textarea>
  }
}
