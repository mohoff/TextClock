#!/bin/bash

# Removes mouse cursor from display when idle
unclutter &

# Kill all existing process with partial name "chromium"
pkill -f chromium

# You can cancel kiosk mode with ALT+F4 or by killing the process in any way
chromium-browser /home/pi/TextClock/index.html --kiosk --incognito
