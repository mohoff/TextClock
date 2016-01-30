// Kombinationen:
/*

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

// Words needed
var words = ['fünf', 'zehn', 'viertel', 'zwanzig', 'halb', 'nach', 'vor', 'genau', 'es ist'];
// index:      0       1        2           3        4       5       6       7        8
// sometimes special chars are not rendered properly. Then, escape 'fünf' to 'f&uuml;nf'

// Colors needed
var colors = [[100,100,100], [224,224,13], [61,204,64], [72,74,212], [201,18,18]];
// color:         grey          yellow        green        blue          red
// used for:     0-6am           9am          12am         3pm           6pm

var combinations = [
  [8,7],    // :00 (volle Stunde)     0
  [0,5],    // :05                    1
  [1,5],    // :10                    2
  [2,5],    // :15                    3
  [1,6,4],  // :20                    4
  [0,6,4],  // :25                    5
  [8,4],    // :30                    6
  [0,5,4],  // :35                    7
  [1,5,4],  // :40                    8
  [2,6],    // :45                    9
  [1,6],    // :50                   10
  [0,6]     // :55                   11
  // UHR
];

var hours = ['zwölf', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf'];
// index:         0          1        2      3        4         5          6        7        8       9       10      11
// sometimes special chars are not rendered properly. Then, escape 'fünf' to 'f&uuml;nf'

// Flag to enable random positioning when page is loaded the first time
var firstLoadDone = false;
var DEBUG = true;

var width, height;
var rows, row1, row2, row3;
var hr, min;

var infoGlobal;
var info = [];

function getColor(currentDate){
  var hr = currentDate.getHours();
  var min = currentDate.getMinutes();

  var colorStartIndex = Math.min(4, (Math.floor(hr/3)-2));
  var colorStart = colors[colorStartIndex];
  var colorEnd = colors[(colorStartIndex+1)%colors.length];

  // When it's between 0:00 and 5:59 a.m., immediately return grey color.
  if(hr < 6){
    return 'rgb(' + colors[0][0] + ',' + colors[0][1] + ',' + colors[0][2] + ')';
  }

  // Determine number-based color difference between colorStart and colorEnd.
  // Also determine numeric step size of the RGB-channels in order to represent
  // a smooth color gradient between colorStart and colorEnd.
  var colorDiff = [];
  var stepSize = [];
  for(var i=0; i<3; i++){
    colorDiff[i] = colorEnd[i] - colorStart[i];
    stepSize[i] = colorDiff[i]/36; // 60 = 3h * 20 steps
  }
  // stepIndex resets every 3 hours (except during night)
  // 3h intervals = 3*12 = 36 5-minute-steps => startColor + endColor + 35 shades

  // Compute stepSize in interval [0...36]. Usually for 3h, except from 6pm-0am where it's for 6h
  var stepIndex;
  if(hr >= 18 && hr <= 23){
    stepIndex = (hr%6)*6 + min/10;
  } else {
    stepIndex = (hr%3)*12 + min/5;
  }

  // Compute final color
  var colorNow = [];
  for(var i=0; i<3; i++){
    colorNow[i] = Math.round(colorStart[i] + stepIndex*stepSize[i]);
  }
  return 'rgb(' + colorNow[0] + ',' + colorNow[1] + ',' + colorNow[2] + ')';
}

function setPositionForRow(rowIndex, numberOfRows, rowObj, rowHeight){
  // Reset margins and paddings
  rowObj.style.margin = "0px";
  rowObj.children[0].style.padding = "0px";

  // Get individual width of row at rowIndex
  rowWidth = rowObj.children[0].clientWidth || rowObj.children[0].scrollWidth || rowObj.children[0].offsetWidth;

  // Generate two distinct random numbers
  var r1 = Math.random();
  var r2 = Math.random();

  // Calculate top and left offset
  var offsetTop = r1 * (height - (rowObj.getBoundingClientRect().top + (numberOfRows-rowIndex)*rowHeight));
  var offsetLeft = r2 * (width-(rowWidth));

  if(DEBUG){
    info[rowIndex].innerHTML = "ROW" + rowIndex + ": w(" + rowWidth + "), h(" + rowHeight + "), " +
      "LPad: [0-" + (width-rowWidth) + "]->" + offsetLeft.toFixed(1) + "px, " +
      "TMar: [0-" + (height - (rowObj.getBoundingClientRect().top + (numberOfRows-rowIndex)*rowHeight)).toFixed(1) + "]->" + offsetTop.toFixed(1) + "px, " +
      "TBCR(" + rowObj.getBoundingClientRect().top.toFixed(1) + "), rowAbzug" + (rowIndex+1) + "(" + ((numberOfRows-rowIndex)*rowHeight).toFixed(1) + ")";
  }

  // Set top and left offset
  rowObj.style.marginTop = offsetTop + "px";
  rowObj.children[0].style.paddingLeft = offsetLeft + "px";
}

function setTexts(row1, row2, row3, hr, min){
  var minIndex = Math.floor(min/5);
  var numOfWords = combinations[minIndex].length;

  // Content of 1st row
  row1.children[0].innerHTML = words[combinations[minIndex][0]];
  if(numOfWords == 3){
    row1.children[0].innerHTML = row1.children[0].innerHTML + " " + words[combinations[minIndex][1]];
  }

  // Content of 2nd row
  row2.children[0].innerHTML = words[combinations[minIndex][numOfWords-1]];

  // Content of 3rd row
  if(min < 20){
    row3.children[0].innerHTML = hours[hr];
  } else {
    row3.children[0].innerHTML = hours[(hr+1)%12];
  }
  row3.children[0].innerHTML = row3.children[0].innerHTML + "....";
  // Remove dots from 3rd row when minute is not at XX:X4.
  // Dots indicate exact minute for XX:X1, XX:X2, XX:X3 and XX:X4.
  row3.children[0].innerHTML = row3.children[0].innerHTML.substr(0, row3.children[0].innerHTML.length-(4-(min%5)));
}

function setColors(currentDate){
  // Set computed color for all 3 rows.
  for(var i=0; i<rows.length; i++) {
    rows[i].style.color = getColor(currentDate);
  }
}

function tick(){
  // Init relevant variables
  // Determine height and width of the browser viewport.
  height = window.innerHeight; // There is no top or bottom margin anymore
  width = window.innerWidth - 50; // Substract (marginLeft+marginRight) of wrapper div (see #wrapper in style.css)

  //alert(window.innerWidth + ", " + document.innerWidth);

  if(!firstLoadDone){
    // Init rows 1-3 which will contain time
    rows = document.getElementsByClassName("row");
    row1 = document.getElementById("row1");
    row2 = document.getElementById("row2");
    row3 = document.getElementById("row3");
    // Init structure for debugging info
    if(DEBUG){
      infoGlobal = document.getElementById("info-global");
      info[0] = document.getElementById("info-1");
      info[1] = document.getElementById("info-2");
      info[2] = document.getElementById("info-3");
    }
  }

  if(DEBUG){
    infoGlobal.innerHTML = "GLOBAL: w(" + width + "), h(" + height + "), window.innerWidth(" + window.innerWidth + ")";
  }

  // Get current time
  var currentDate = new Date();
  hr = currentDate.getHours() % 12;    // [0 ... 11]
  min = currentDate.getMinutes();      // [0 ... 59]

  hr = 15;
  min = 38;
  setTexts(row1, row2, row3, hr, min);
  setColors(currentDate);

  // Change position of rows only once every 5 minutes (when text content needs
  // to be updated). Also compute position when the page is loaded the first time,
  // independent of the current time.
  if(min%5 == 0 || !firstLoadDone){
    // Determine height and widths of the 3 rows.
    var rowHeight = row1.clientHeight || row1.scrollHeight || row1.offsetHeight;

    setPositionForRow(0, 3, row1, rowHeight);
    setPositionForRow(1, 3, row2, rowHeight);
    setPositionForRow(2, 3, row3, rowHeight);
  }

  // Set information for next function call that the page was already loaded the
  // first time.
  firstLoadDone = true;

  // Call this function again after 60s.
  setTimeout(tick, 60000);
};
