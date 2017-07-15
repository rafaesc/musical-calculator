import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Calculator from '../components/Calculator'
import { bindActionCreators } from 'redux'
import * as TodoActions from '../actions'

const App = ({ state, actions }) => (
  <Calculator state={state} actions={actions} />
)

App.propTypes = {
  state: PropTypes.any.isRequired,
  actions: PropTypes.any.isRequired,
}

const mapStateToProps = state => (
  { state }
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TodoActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
