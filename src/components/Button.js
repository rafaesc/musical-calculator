import * as Rx from 'rxjs'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Button extends Component {
  static propTypes = {
    operationAction: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
    className: PropTypes.string
  }

  componentDidMount () {
    const clickEvent = Rx.Observable.fromEvent(this.buttonNode, 'click')

    clickEvent.subscribe((e) => {
      this.props.operationAction()
    })
  }

  render () {
    return (
      <button className={this.props.className} ref={ref => (this.buttonNode = ref)}>{this.props.children}</button>
    )
  }
}
