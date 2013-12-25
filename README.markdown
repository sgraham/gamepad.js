gamepad.js
----------

DEPRECATED

Just use the browser API directly (they do remapping now). Call
`navigator.getGamepads()` (or `navigator.webkitGetGamepads()` in Chrome)
inside a `requestAnimationFrame` loop.

See https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html
