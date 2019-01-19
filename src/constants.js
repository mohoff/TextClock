/*
  Combinations:

  "es ist" genau 0
  fünf nach 0
  zehn nach 0
  viertel nach 0
  zwanzig nach 0
  fünf vor halb 1
  "es ist" halb 1
  fünf nach halb 1
  zehn nach halb 1
  viertel vor 1
  zehn vor 1
  fünf vor 1
*/

// Chunks
const chunks = [
  'fünf',
  'zehn',
  'viertel',
  'zwanzig',
  'halb',
  'nach',
  'vor',
  'genau',
  'es ist',
]

// Used combinations of chunks and colors
const combinations = [
  [8, 7], // :00 (full hour)     0
  [0, 5], // :05                    1
  [1, 5], // :10                    2
  [2, 5], // :15                    3
  [1, 6, 4], // :20                    4
  [0, 6, 4], // :25                    5
  [8, 4], // :30                    6
  [0, 5, 4], // :35                    7
  [1, 5, 4], // :40                    8
  [2, 6], // :45                    9
  [1, 6], // :50                   10
  [0, 6], // :55                   11
]

// Colors
const colors = [
  [100, 100, 100], // grey (peak @0-6am)
  [224, 224, 13], // yellow (peak @9am)
  [61, 204, 64], // green (peak @12am)
  [92, 143, 255], // blue (peak @3pm)
  [255, 61, 61], // red (peak @6pm)
]

const hours = [
  'zwölf',
  'eins',
  'zwei',
  'drei',
  'vier',
  'fünf',
  'sechs',
  'sieben',
  'acht',
  'neun',
  'zehn',
  'elf',
]

module.exports = {
  chunks,
  combinations,
  colors,
  hours,
}
