gamepad.js
----------

Gamepad/Joystick APIs across operating systems, APIs, manufacturers, and
browsers are extremely inconsistent. In order to provide a more functional API
on top of the platform data, gamepad.js tries to know about all devices and map
them into a nice standard gamepad style.

Additionally, it provides images of the buttons for help/explanatory text. So,
rather than saying something generic like "Press Button 2", you can provide a
picture of that button on the gamepad the player is using.


Quick start
-----------

Add
    
    <script src=".../gamepad.js" type="text/javascript"></script>

to your html.

Check if the browser supports gamepads via `Gamepad.supported`. If
that's true, get gamepad data each `window.requestAnimationFrame` via
`Gamepad.getStates()`. `getStates` returns an array of gamepads that the
user has interacted with (pressed a button at least once). Data
available on each gamepad detailed below.


Per-gamepad data
----------------

Each item in the array contains:

Axes, in the range [-1..1]:

    .leftStickX
    .leftStickY
    .rightStickX
    .rightStickY

Buttons, in the range [0..1]:

    .faceButton0
    .faceButton1
    .faceButton2
    .faceButton3
    .leftShoulder0
    .rightShoulder0
    .leftShoulder1
    .rightShoulder1
    .select
    .start
    .leftStickButton
    .rightStickButton
    .dpadUp
    .dpadDown
    .dpadLeft
    .dpadRight

User identifier, which can be displayed to the user to identify the
player+controller (e.g. "Xbox 360 #1")

    .name

The stick and shoulder data are dead-zoned in a 2D fashion, according to
recommended tolerances.

There are also additional access points for getting data:
`Gamepad.getState(index)` which retrieves only a particular gamepad, and
`Gamepad.getPreviousStates()` and `Gamepad.getPreviousState(index)`,
which retrieve the state of the gamepad(s) from the previous frame.
These can be useful for edge-triggered transitions (i.e. button-went-up
as opposed to button-is-up).


Button images
-------------

`.image[button_name]` is the URL of an image that can be used to
communicate with the user. For example `.image['faceButton0']` will be a
picture of a green "A" button if the connected device is an Xbox 360
controller.

For the axes, the names are `leftStick`, and `rightStick`, rather than
separate items for X/Y. There is also a generic `dpad` image (with no
direction specified).


Authors
-------

Scott Graham (@h4kr, http://h4ck3r.net/)

Xbox 360 Icon Pack by Jeff Jenkins (@sinnix, http://sinnix.net/downloads/?did=1)
