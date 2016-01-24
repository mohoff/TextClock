#!/bin/bash

timestamp=$(date +%Y%b%d_%H-%M-%S)
# e.g. 2016Jan25_00-40-06

scrot ~/lcduhr_screenshots/$timestamp.png

echo "Siehe Anlage..." | mutt -a "~/lcduhr_screenshots/$timestamp.png" -s "Neuer Screenshot von Raspberry Pi" -- hoffmamo@gmail.com
