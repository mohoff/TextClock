#!/bin/bash

# Pings default gateway. If it replies, assume internet connection
function has_internet () {
  echo "Checking internet connection..."
  ping -q -w 1 -c 1 `ip r | grep default | cut -d ' ' -f 3` > /dev/null && return 0 || return 1
}

# Retrieves and sets correct system time from time server
function set_time () {
  echo "Retrieving current time from time server and restarting NTP daemon..."
  sudo service ntp stop
  sudo ntpdate -s time.nist.gov
  sudo service ntp start
}

# Sets system time according to user input
function set_time_manually () {
  date=""

  read -p "Enter year (e.g. 2015): " year
  date+="${year}-"

  read -p "Enter month (e.g. 12): " month
  if [ ${#month} = 1 ]
    then
    month="0$month"
  fi
  date+="${month}-"

  read -p "Enter day (e.g. 30): " day
  if [ ${#day} = 1 ]
    then
    day="0$day"
  fi
  date+="${day} "

  read -p "Enter hours (e.g. 23): " hours
  if [ ${#hours} = 1 ]
    then
    hours="0$hours"
  fi
  date+="${hours}:"

  read -p "Enter minutes (e.g. 59): " minutes
  if [ ${#minutes} = 1 ]
    then
    minutes="0$minutes"
  fi
  date+="${minutes}:00"

  echo "The date and time you want to set is: $date"
  while true; do
    read -p "Do you confirm (yes/no)? " yn
    case $yn in
      [Yy]* ) sudo date -s "$date"; break;;
      [Nn]* ) set_time_manually; break;;  
      * ) echo "Please answer with yes or no.";;
    esac
  done
}

# Set system time
if has_internet; then
  set_time
else
  set_time_manually
fi

# Removes mouse cursor from display when idle
unclutter &

# Kill all existing process with partial name "chromium"
pkill -f chromium

# You can cancel kiosk mode with ALT+F4 or by killing the process in any way
chromium /home/pi/lcduhr/index.html --kiosk --incognito

# OPTIONAL: Start vnc server to enable remote connections with remote GUI (in Ubuntu clients you can use preinstalled tool Remmina in order to connect with vnc server)
vncserver :1 -geometry 1280x1024 -depth 16 -pixelformat rgb565


