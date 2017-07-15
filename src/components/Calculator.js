import * as Rx from 'rxjs'
import RxCSS from 'rxcss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CalculatorDisplay from './CalculatorDisplay'
import CalculatorHistory from './CalculatorHistory'
import CalculatorKeypad from './CalculatorKeypad'
import { executeAction, filterKey } from '../constants/KeyboardCodes'

export default class Calculator extends Component {
  constructor (props) {
    super(props)
    this.handlerKeyboard = this.handlerKeyboard.bind(this)
  }

  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  }

  state = {
    listenKeyboard: true
  }

  componentDidMount () {
    this.props.actions.loading()
    this.layoutRx()
    this.bindKeyboard()
  }

  handlerKeyboard (value) {
    this.setState({
      listenKeyboard: value
    })
  }

  layoutRx () {
    const doc = document.documentElement
    const calculator = this.mountNode
    const { clientWidth, clientHeight } = doc
    const animationFrame$ = Rx.Observable.interval(0, Rx.Scheduler.animationFrame)
    const diference = 2000
    const mouse$ = Rx.Observable
      .fromEvent(document, 'mousemove')
      .map(({ clientX, clientY }) => ({
        x: (clientWidth / 2 - clientX) / (clientWidth + diference),
        y: (clientHeight / 2 - clientY) / (clientHeight + diference),
      }))

    const smoothMouse$ = animationFrame$
      .withLatestFrom(mouse$, (_, m) => m)
      .scan(RxCSS.lerp(0.1))

    RxCSS({
      mouse: smoothMouse$
    }, calculator)
  }

  bindKeyboard () {
    const possibleCode$ = Rx.Observable.fromEvent(document, 'keydown')
      .map(e => e.key)
      .filter(filterKey)

    possibleCode$.subscribe({
      next: code => {
        executeAction(code,
        this.props.actions,
        this.props.state.operations.numberCurrent,
        this.state.listenKeyboard)
      }
    })
  }

  layoutLoading () {
    if (this.props.state.loading.loading) {
      return (<div className={'loading-audio'}>CARGANDO AUDIOS POR FAVOR ESPERE...</div>)
    }
  }

  render () {
    const state = this.props.state
    const actions = this.props.actions
    return (
      <div className={'calculator '} ref={ref => (this.mountNode = ref)}>
        {this.layoutLoading()}
        <div className={'calculator-header'}>
          <CalculatorHistory
            state={state}
            editOperation={actions.editOperation}
            equal={actions.equal}
            handlerKeyboard={this.handlerKeyboard} />
        </div>
        <CalculatorDisplay {...actions}
          text={state.operations.numberCurrent} />
        <CalculatorKeypad {...actions} />
      </div>
    )
  }
}
