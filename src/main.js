import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Storage from './middleware/storage'
import { STORAGE } from './constants/StorageType'
import createStore from './store/createStore'
import initAudio from './initAudio'
import './styles/main.scss'

const store = createStore(Storage.get(STORAGE))

const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const App = require('./containers/App').default

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    MOUNT_NODE
  )
}

if (__DEV__) {
  if (module.hot) {
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    render = () => {
      try {
        renderApp()
      } catch (e) {
        console.error(e)
        renderError(e)
      }
    }

    module.hot.accept([
      './containers/App',
    ], () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

if (!__TEST__) render()
