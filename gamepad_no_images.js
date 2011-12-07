/** @license gamepad.js, See README for copyright and usage instructions.
*/
(function() {
    var getField = function() {
        return navigator.webkitGamepads || navigator.mozGamepads || navigator.gamepads;
    };

    function Item() {
        this.leftStickX = 0.0;
        this.leftStickY = 0.0;
        this.rightStickX = 0.0;
        this.rightStickY = 0.0;
        this.faceButton0 = 0.0;
        this.faceButton1 = 0.0;
        this.faceButton2 = 0.0;
        this.faceButton3 = 0.0;
        this.leftShoulder0 = 0.0;
        this.rightShoulder0 = 0.0;
        this.leftShoulder1 = 0.0;
        this.rightShoulder1 = 0.0;
        this.select = 0.0;
        this.start = 0.0;
        this.leftStickButton = 0.0;
        this.rightStickButton = 0.0;
        this.dpadUp = 0.0;
        this.dpadDown = 0.0;
        this.dpadLeft = 0.0;
        this.dpadRight = 0.0;
        this.deadZoneLeftStick = 0.25;
        this.deadZoneRightStick = 0.25;
        this.deadZoneShoulder0 = 0.0;
        this.deadZoneShoulder1 = 0.0;
        this.images = Gamepad.ImageDataUrls_Unknown;
        this.name = "Unknown";
    }

    var contains = function(lookIn, forWhat) { return lookIn.indexOf(forWhat) != -1; };
    var userAgent = navigator.userAgent;
    var isWindows = contains(userAgent, 'Windows NT');
    var isMac = contains(userAgent, 'Macintosh');
    var isChrome = contains(userAgent, 'Chrome/');
    var isFirefox = contains(userAgent, 'Firefox/');

    if (isFirefox) {
        // todo; current moz nightly does not define this, so we'll always
        // return true for .supported on that Firefox.
        navigator.mozGamepads = [];
        var mozConnectHandler = function(e) {
            navigator.mozGamepads[e.gamepad.index] = e.gamepad;
        }
        var mozDisconnectHandler = function(e) {
            navigator.mozGamepads[e.gamepad.index] = undefined;
        }
        window.addEventListener("MozGamepadConnected", mozConnectHandler);
        window.addEventListener("MozGamepadDisconnected", mozDisconnectHandler);
    }

    var ChromeWindowsXinputGamepad = function(raw, into, index) {
        into.leftStickX = raw.axes[0];
        into.leftStickY = raw.axes[1];
        into.rightStickX = raw.axes[2];
        into.rightStickY = raw.axes[3];
        into.faceButton0 = raw.buttons[0];
        into.faceButton1 = raw.buttons[1];
        into.faceButton2 = raw.buttons[2];
        into.faceButton3 = raw.buttons[3];
        into.leftShoulder0 = raw.buttons[4];
        into.rightShoulder0 = raw.buttons[5];
        into.leftShoulder1 = raw.buttons[6];
        into.rightShoulder1 = raw.buttons[7];
        into.select = raw.buttons[8];
        into.start = raw.buttons[9];
        into.leftStickButton = raw.buttons[10];
        into.rightStickButton = raw.buttons[11];
        into.dpadUp = raw.buttons[12];
        into.dpadDown = raw.buttons[13];
        into.dpadLeft = raw.buttons[14];
        into.dpadRight = raw.buttons[15];
        // From http://msdn.microsoft.com/en-us/library/windows/desktop/ee417001(v=vs.85).aspx
        into.deadZoneLeftStick = 7849.0/32767.0;
        into.deadZoneRightStick = 8689/32767.0;
        into.deadZoneShoulder0 = 0.5;
        into.deadZoneShoulder1 = 30.0/255.0;
        into.images = Gamepad.ImageDataUrls_Xbox360;
        into.name = "Xbox 360 Player " + (index + 1);
    };

    var FirefoxWindowsXbox360Controller = function(raw, into, index, deviceident) {
        // Wow, dinput is a disaster.
        into.leftStickX = raw.axes[0];
        into.leftStickY = raw.axes[1];
        into.rightStickX = raw.axes[3];
        into.rightStickY = raw.axes[4];
        into.faceButton0 = raw.buttons[0];
        into.faceButton1 = raw.buttons[1];
        into.faceButton2 = raw.buttons[2];
        into.faceButton3 = raw.buttons[3];
        into.leftShoulder0 = raw.buttons[4];
        into.rightShoulder0 = raw.buttons[5];
        into.leftShoulder1 = raw.axes[2] > 0 ? raw.axes[2] : 0;
        into.rightShoulder1 = raw.axes[2] < 0 ? -raw.axes[2] : 0;
        into.select = raw.buttons[6];
        into.start = raw.buttons[7];
        into.leftStickButton = raw.buttons[8];
        into.rightStickButton = raw.buttons[9];
        into.dpadUp = raw.axes[6] < -0.5 ? 1 : 0;
        into.dpadDown = raw.axes[6] > 0.5 ? 1 : 0;
        into.dpadLeft = raw.axes[5] < -0.5 ? 1 : 0;
        into.dpadRight = raw.axes[5] > 0.5 ? 1 : 0;
        // From http://msdn.microsoft.com/en-us/library/windows/desktop/ee417001(v=vs.85).aspx
        into.deadZoneLeftStick = 7849.0/32767.0;
        into.deadZoneRightStick = 8689/32767.0;
        into.deadZoneShoulder0 = 0.5;
        into.deadZoneShoulder1 = 30.0/255.0;
        into.images = Gamepad.ImageDataUrls_Xbox360;
        into.name = deviceident + " Player " + (index + 1);
    }

    var mapPad = function(raw, mapped) {
        if (isChrome && isWindows && contains(raw.id, 'XInput ') && contains(raw.id, 'GAMEPAD')) {
            ChromeWindowsXinputGamepad(raw, mapped, raw.index);
        } else if (isFirefox && isWindows && contains(raw.id, '45e-') && contains(raw.id, '28e-')) {
            FirefoxWindowsXbox360Controller(raw, mapped, raw.index, "Xbox 360");
        } else if (isFirefox && isWindows && contains(raw.id, '46d-') && contains(raw.id, 'c21e-')) {
            FirefoxWindowsXbox360Controller(raw, mapped, raw.index, "Logitech F510");
        } else if (isFirefox && isWindows && contains(raw.id, '46d-') && contains(raw.id, 'c21d-')) {
            FirefoxWindowsXbox360Controller(raw, mapped, raw.index, "Logitech F310");
        } else {
            mapped.name = "Unknown: " + raw.id;
            console.warn("Unrecognized pad type, not being mapped!");
            console.warn(raw);
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
