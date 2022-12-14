const requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function */ callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
})()

const requestInterval = function (fn, delay) {
  if (
    !window.requestAnimationFrame &&
    !window.webkitRequestAnimationFrame &&
    !(
      window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame
    ) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame &&
    !window.msRequestAnimationFrame
  )
    return window.setInterval(fn, delay)

  var start = new Date().getTime(),
    handle = new Object()

  function loop() {
    var current = new Date().getTime(),
      delta = current - start

    if (delta >= delay) {
      fn.call()
      start = new Date().getTime()
    }

    handle.value = requestAnimFrame(loop)
  }

  handle.value = requestAnimFrame(loop)
  return handle
}

export default requestInterval
