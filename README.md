# Text-Clock

Text-Clock can be used as a full screen app that runs in the browser. It displays the current time in German words.

## Features
- The wording changes every five minutes (German equivalent of "ten minutes before", "five minutes before", ...).
- Whenever the wording changes, the position on screen is also randomized (while preserving the correct order of words).
- For the intermediate 4 minutes, the exact same amount of dots is added to the last five-minute-phrase.
  Example: 11:57 would be displayed like "five minutes before twelve.."
- Depending on the daytime, the color of the text gradually changes as well (red in the morning, blue in the evening).

## Installation

> ### Special note for Raspberry Pi gen1
> The ARMv6 CPU of the first-gen Raspberry Pi isn't supported on newer chromium/firefox-esr versions.
> Therefore it is required to block the preinstalled package from upgrades. The command is as follows:
> `sudo apt-mark hold chromium`

### Install unclutter, git
`sudo apt install unclutter git -y`

### Download the TextClock application
`git clone https://github.com/mohoff/TextClock`

### Autostart TextClock on Raspberry Pi OS
Create a file at `/home/pi/.config/autostart/textclock.desktop` with the following content:
```
[Desktop Entry]
Type=Application
Name=TextClock
Exec=/home/pi/TextClock/startup.sh
StartupNotify=false
```

### Disable screen blanking on Raspberry Pi OS
Edit the file `etc/xdg/lxsessions/LXDE-pi/autostart` (the file at `etc/xdg/lxsessions/LXDE/autostart` refers to an old GUI and is ignored) as follows:
```
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash

@xset s noblank
@xset s off
@xset -dpms
```

### Enable automatic time update
`sudo timedatectl set-ntp true`

### Reboot
After everything is set up, reboot the pi with `sudo reboot`.

## More Features

- Clock text updates every 5 minutes and each minute in between is indicated with a dot at the end of the last line.
- Text color changes during daytime. Shades are computed dynamically every 5 minutes in order to display smooth gradients. Currently 5 base colors (grey, yellow, green, blue, red) are in use.
- Positions of text blocks is calculated randomly but the resulting layout is always drawn in top-to-bottom reading order.

## Screenshots

![](./screenshots/screenshot1_2016-01-23.png)

![](./screenshots/screenshot2_2016-01-24.png)
