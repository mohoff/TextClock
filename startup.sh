#!/bin/bash
lxterminal -e bash /home/pi/lcduhr/time.sh

# Removes mouse cursor from display when idle
unclutter &

# Kill all existing process with partial name "chromium"
pkill -f chromium

# You can cancel kiosk mode with ALT+F4 or by killing the process in any way
chromium /home/pi/lcduhr/index.html --kiosk --incognito

# OPTIONAL: Start vnc server to enable remote connections with remote GUI (in Ubuntu clients you can use preinstalled tool Remmina in order to connect with vnc server)
#vncserver :1 -geometry 1280x1024 -depth 16 -pixelformat rgb565
