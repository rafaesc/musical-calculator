import AudioHelper from './utils/AudioHelper'
import { listSounds } from './utils/ListSounds'

window.requestAnimFrame = (function () {
  // Polifyll requestAnimFrame
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame || function (a) {
      window.setTimeout(a, 1e3 / 60)
    }
}())

window.currentTime = function () {
  return Date.now()
}

listSounds.forEach((object, index) => {
  const audioHelper = new AudioHelper()
  audioHelper.src = object.src
  listSounds[index].audio = audioHelper
  setTimeout(() => {
    listSounds[index].audio.play()
  }, 1000)
})
