#!/usr/bin/python
# Simple script to slurp all the icons we have, convert them to data urls, and
# append to gamepad_no_images.js to create the final gamepad.js that most
# people will want to use.

import base64
import platform
import os
import sys

def main():
    result = ''
    for device in os.listdir("images"):
        cur_dir = os.path.join("images", device)
        result += "var Gamepad_ImageDataUrls_%s = {};\n" % device
        for image in os.listdir(cur_dir):
            basename, ext = os.path.splitext(image)
            if ext == '.png':
                data = base64.standard_b64encode(open(os.path.join(cur_dir, image), 'rb').read())
                result += ("Gamepad_ImageDataUrls_%s.%s = 'data:image/png;base64,%s';\n" % (device, basename, data))
    final = open("gamepad_no_images.js", "rb").read()
    open("gamepad_uncompressed.js", "wb").write(final.replace("// @IMAGEDATAURLS@\n", result))

    javaPath = 'java'
    # no idea.
    if sys.platform == 'win32' and platform.architecture()[0] == '64bit':
        javaPath = "c:\\windows\\SysWow64\\java.exe"
    ret = os.system(javaPath + " -jar closure/compiler.jar --js gamepad_uncompressed.js --js_output_file gamepad.js --compilation_level SIMPLE_OPTIMIZATIONS")
    if ret != 0:
        return ret

if __name__ == "__main__":
    sys.exit(main())
