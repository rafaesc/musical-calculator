import { buffersCache } from './ListSounds'

const createAudioContext = require('ios-safe-audio-context')
window.audioContext = createAudioContext()

const audioContext = window.audioContext

if (!audioContext.createGain) { window.audioContext.createGain = window.audioContext.createGainNode }
if (!audioContext.createDelay) { window.audioContext.createDelay = window.audioContext.createDelayNode }
if (!audioContext.createScriptProcessor) { window.audioContext.createScriptProcessor = window.audioContext.createJavaScriptNode }

let gainNode = window.audioContext.createGain()
gainNode.gain.value = 1
gainNode.connect(window.audioContext.destination)

function loadAudioFile (object, urlParam) {
  let onLoad = function (buffer) {
    object.dispatchEvent('load')
  }

  if (urlParam in buffersCache) {
    onLoad(buffersCache[urlParam])
  } else {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', urlParam, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function () {
      window.audioContext.decodeAudioData(xhr.response, function (buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + urlParam)
          return
        }
        buffersCache[urlParam] = buffer
        onLoad(buffer)
      })
    }
    xhr.onerror = function () {
      console.error('BufferLoader: XHR error')
    }
    xhr.send()
  }
}

function refreshBufferSource (object) {
  object.bufferSource = window.audioContext.createBufferSource()

  object.bufferSource.buffer = buffersCache[object.src]

  object.bufferSource.connect(object.gainNode)

  object.bufferSource.loop = object._loop
}

export default class AudioHelper {
  constructor () {
    this._loop = false
    this._duration = NaN
    this._src = ''
    this.gainNode = window.audioContext.createGain()
    this.gainNode.connect(gainNode)

    this.analyser = this.gainNode.context.createAnalyser()
    this.analyser.fftSize = 2048
    this.gainNode.connect(this.analyser)
  }

  play (startAtTime) {
    startAtTime = startAtTime || 0
    refreshBufferSource(this)
    this.bufferSource[this.bufferSource.start ? 'start' : 'noteOn'](startAtTime)
  }

  get src () {
    return this._src
  }

  set src (value) {
    this._src = value
    loadAudioFile(this, value)
  }

  addEventListener (eventName, callback) {
    this._listeners[++this._listenerId] = {
      eventName: eventName,
      callback: callback
    }
  }

  dispatchEvent (eventName, args) {
    for (let id in this._listeners) {
      let listener = this._listeners[id]
      if (listener.eventName == eventName) {
        listener.callback && listener.callback.apply(listener.callback, args)
      }
    }
  }
}
