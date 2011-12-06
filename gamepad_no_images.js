/** @preserve
 * gamepad.js
 * ----------
 *
 * Copyright 2011, Scott Graham http://h4ck3r.net/
 * Xbox 360 Icon Pack, Jeff Jenkins http://sinnix.net/downloads/?did=1
 *
 * Maps gamepad data using { UserAgent, Platform, Gamepad ID } to a canonical
 * representation.
 *
 * Check if the browser supports gamepads with Gamepad.supported, and get
 * gamepads each requestAnimationFrame via Gamepad.getPads(). Returns an array
 * of gamepads that the user has interacted with (pressed a button at least
 * once).
 *
 *
 * Raw data returned
 * -----------------
 *
 * Each item in the array contains:
 *
 * -- range [-1..1]
 * .leftStickX
 * .leftStickY
 * .rightStickX
 * .rightStickY
 *
 * -- range [0..1]
 * .faceButton0
 * .faceButton1
 * .faceButton2
 * .faceButton3
 * .leftShoulder0
 * .rightShoulder0
 * .leftShoulder1
 * .rightShoulder1
 * .select
 * .start
 * .leftStickButton
 * .rightStickButton
 * .dpadUp
 * .dpadDown
 * .dpadLeft
 * .dpadRight
 *
 * -- can be displayed to the user to identify the player+controller (e.g. "Xbox 360 #1")
 * .name
 *
 * The stick and shoulder data are deadzoned in a 2D fashion, according to
 * recommended tolerances.
 *
 * Button images
 * -------------
 *
 * .image[button_name] is the URL of an image that can be used to communicate
 * with the user. For example .image['faceButton0'] will be a picture of a
 * green "A" button if the connected device is an Xbox 360 controller. For the
 * axes, the names are 'leftStick', and 'rightStick', rather than separate
 * items for X/Y. There is also a generic 'dpad' image (no direction
 * specified).
 *
 */

(function() {
    var getField = function() {
        return navigator.webkitGamepads || navigator.mozGamepads || navigator.gamepads;
    };

    function Item() {
        this['leftStickX'] = 0.0;
        this['leftStickY'] = 0.0;
        this['rightStickX'] = 0.0;
        this['rightStickY'] = 0.0;
        this['faceButton0'] = 0.0;
        this['faceButton1'] = 0.0;
        this['faceButton2'] = 0.0;
        this['faceButton3'] = 0.0;
        this['leftShoulder0'] = 0.0;
        this['rightShoulder0'] = 0.0;
        this['leftShoulder1'] = 0.0;
        this['rightShoulder1'] = 0.0;
        this['select'] = 0.0;
        this['start'] = 0.0;
        this['leftStickButton'] = 0.0;
        this['rightStickButton'] = 0.0;
        this['dpadUp'] = 0.0;
        this['dpadDown'] = 0.0;
        this['dpadLeft'] = 0.0;
        this['dpadRight'] = 0.0;
        this.deadZoneLeftStick = 0.25;
        this.deadZoneRightStick = 0.25;
        this.deadZoneShoulder0 = 0.0;
        this.deadZoneShoulder1 = 0.0;
        this['images'] = Gamepad.ImageDataUrls_Unknown;
        this['name'] = "Unknown";
    }

    var contains = function(lookIn, forWhat) { return lookIn.indexOf(forWhat) != -1; };
    var userAgent = navigator.userAgent;
    var isWindows = contains(userAgent, 'Windows NT');
    var isMac = contains(userAgent, 'Macintosh');
    var isChrome = contains(userAgent, 'Chrome/');
    var isFirefox = contains(userAgent, 'Firefox/');

    var ChromeWindowsXinputGamepad = function(raw, into, index) {
        into['leftStickX'] = raw.axes[0];
        into['leftStickY'] = raw.axes[1];
        into['rightStickX'] = raw.axes[2];
        into['rightStickY'] = raw.axes[3];
        into['faceButton0'] = raw.buttons[0];
        into['faceButton1'] = raw.buttons[1];
        into['faceButton2'] = raw.buttons[2];
        into['faceButton3'] = raw.buttons[3];
        into['leftShoulder0'] = raw.buttons[4];
        into['rightShoulder0'] = raw.buttons[5];
        into['leftShoulder1'] = raw.buttons[6];
        into['rightShoulder1'] = raw.buttons[7];
        into['select'] = raw.buttons[8];
        into['start'] = raw.buttons[9];
        into['leftStickButton'] = raw.buttons[10];
        into['rightStickButton'] = raw.buttons[11];
        into['dpadUp'] = raw.buttons[12];
        into['dpadDown'] = raw.buttons[13];
        into['dpadLeft'] = raw.buttons[14];
        into['dpadRight'] = raw.buttons[15];
        // From http://msdn.microsoft.com/en-us/library/windows/desktop/ee417001(v=vs.85).aspx
        into.deadZoneLeftStick = 7849.0/32767.0;
        into.deadZoneRightStick = 8689/32767.0;
        into.deadZoneShoulder0 = 0.5;
        into.deadZoneShoulder1 = 30.0/255.0;
        into['images'] = Gamepad.ImageDataUrls_Xbox360;
        into['name'] = "Xbox 360 Player " + (index + 1);
    };

    var FirefoxWindowsXbox360Controller = [];

    var mapPad = function(raw, mapped) {
        if (isChrome && isWindows && contains(raw.id, 'XInput ') && contains(raw.id, 'GAMEPAD')) {
            ChromeWindowsXinputGamepad(raw, mapped, raw.index);
        } else if (isFirefox && isWindows && contains(raw.id, '45e-') && contains(raw.id, '28e-')) {
            FirefoxWindowsXbox360Controller(raw, mapped, raw.index);
        } else {
            console.warn("Unrecognized pad type, not being mapped!");
        }

        // todo; apply dead zones to mapped here
    };

    var curData = [];
    var Gamepad = {};
    window["Gamepad"] = Gamepad;
    Gamepad['getPads'] = function() {
        var result = [];
        var rawPads = getField()
        var len = rawPads.length;
        for (var i = 0; i < len; ++i) {
            var raw = rawPads[i];
            if (!raw)
                continue;
            if (curData[i] === undefined)
                curData[i] = new Item();
            mapPad(raw, curData[i]);
        }
        return curData;
    };
    Gamepad['supported'] = getField() != undefined;
})();
