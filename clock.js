// Kombinationen:
/*

  ES IST

  fünf nach 0
  zehn nach 0
  viertel nach 0
  zwanzig nach 0
  fünf vor halb 1
  halb 1
  fünf nach halb 1
  zehn nach halb 1
  viertel vor 1
  zehn vor 1
  fünf vor 1

  UHR

*/

// Flag to enable random positioning when page is loaded the first time
var firstLoadDone = false;

// Words needed
var words = ['f&uuml;nf', 'zehn', 'viertel', 'zwanzig', 'halb', 'nach', 'vor', 'genau', 'es ist'];
// index:         0          1        2          3        4       5       6       7        8

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

var hours = ['zw&ouml;lf', 'eins', 'zwei', 'drei', 'vier', 'f&uuml;nf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf'];
var output;
var infoGlobal;
var info = [];

function getColor(currentDate){
  var hr = currentDate.getHours();
  var min = currentDate.getMinutes();

  //alert("hr(" + hr + "), " + Math.min(4, (Math.floor(hr/3)-2)));

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
  var stepIndex = (hr%3)*12 + min/5;

  // Compute final color
  var colorNow = [];
  for(var i=0; i<3; i++){
    colorNow[i] = Math.round(colorStart[i] + stepIndex*stepSize[i]);
  }
  return 'rgb(' + colorNow[0] + ',' + colorNow[1] + ',' + colorNow[2] + ')';
}

function applyPositionForRow(numberOfRows, rowIndex, rowObj, height, width, rowHeight, rowWidth){
  var r1 = Math.random();
  var r2 = Math.random();

  var offsetTop = r1 * (height - (rowObj.getBoundingClientRect().top + (numberOfRows-rowIndex)*rowHeight));
  rowObj.style.marginTop = offsetTop + "px";
  var offsetLeft = r2 * (width-rowWidth);
  rowObj.children[0].style.paddingLeft = offsetLeft + "px";

  // DEBUG INFO part2
  info[rowIndex].innerHTML = info[rowIndex].innerHTML + "LPad: [0-" + (width-rowWidth) + "]->" + offsetLeft.toFixed(1) + "px, TMar: [0-" + (height - (rowObj.getBoundingClientRect().top + (numberOfRows-rowIndex)*rowHeight)).toFixed(1) + "]->" + offsetTop.toFixed(1) + "px";

  //console.log("maxOffsetTop: " + (height - (rowObj.getBoundingClientRect().top + (numberOfRows-rowIndex)*rowHeight)) + ", offsetTop: " + offsetTop);
  //console.log("maxOffsetLeft: " + (width-rowWidth) + ", offsetLeft: " + offsetLeft);
}

function tick(){
  var row1 = document.getElementById("row1");
  var row2 = document.getElementById("row2");
  var row3 = document.getElementById("row3");
  infoGlobal = document.getElementById("info-global");
  info[0] = document.getElementById("info-1");
  info[1] = document.getElementById("info-2");
  info[2] = document.getElementById("info-3");

  var currentDate = new Date();
  var hr = currentDate.getHours() % 12;    // [0 ... 11]
  var min = currentDate.getMinutes();      // [0 ... 59]
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
  if(min < 25){
    row3.children[0].innerHTML = hours[hr];
  } else {
    row3.children[0].innerHTML = hours[(hr+1)%12];
  }
  row3.children[0].innerHTML = row3.children[0].innerHTML + "....";

  // Change position of rows only once every 5 minutes (when text content needs
  // to be updated). Also compute position when the page is loaded the first time,
  // independent of the current time.
  if(min%5 == 0 || !firstLoadDone){
    // Determine height and width of the browser viewport.
    var height = window.innerHeight; // There is no top or bottom margin anymore
    var width = window.innerWidth - 50; // -50px because there is a 50px margin (see .css)

    // Determine height and widths of the 3 rows.
    var rowHeight = row1.clientHeight || row1.scrollHeight || row1.offsetHeight;
    var rowWidths = [];

    // Set left padding to 0 to prevent paddingLeft accumulation in each iteration
    row1.children[0].style.paddingLeft = "0px";
    row2.children[0].style.paddingLeft = "0px";
    row3.children[0].style.paddingLeft = "0px";
    rowWidths[0] = row1.children[0].clientWidth || row1.children[0].scrollWidth || row1.children[0].offsetWidth;
    rowWidths[1] = row2.children[0].clientWidth || row2.children[0].scrollWidth || row2.children[0].offsetWidth;
    rowWidths[2] = row3.children[0].clientWidth || row3.children[0].scrollWidth || row3.children[0].offsetWidth;

    // DEBUG INFO part1
    infoGlobal.innerHTML = "GLOBAL: w(" + width + "), h(" + height + ")";
    info[0].innerHTML = "ROW1: w(" + rowWidths[0] + "), h(" + rowHeight + "), ";
    info[1].innerHTML = "ROW2: w(" + rowWidths[1] + "), h(" + rowHeight + "), ";
    info[2].innerHTML = "ROW3: w(" + rowWidths[2] + "), h(" + rowHeight + "), ";

    applyPositionForRow(3, 0, row1, height, width, rowHeight, rowWidths[0]);
    applyPositionForRow(3, 1, row2, height, width, rowHeight, rowWidths[1]);
    applyPositionForRow(3, 2, row3, height, width, rowHeight, rowWidths[2]);

    //alert("height: " + height + ", width:" + width + ", rowHeight:" + rowHeight + ", rowWidths: " + rowWidths);
  }

  // Remove dots from 3rd row when minute is not at XX:X4.
  row3.children[0].innerHTML = row3.children[0].innerHTML.substr(0, row3.children[0].innerHTML.length-(4-(min%5)));

  // Apply computed color to all 3 rows.
  var rows = document.getElementsByClassName("row");
  for(var i=0; i<rows.length; i++) {
    rows[i].style.color = getColor(currentDate);
  }




  // Set information for next function call that the page was already loaded the
  // first time.
  firstLoadDone = true;
  // Call this function again after 60s.
  setTimeout(tick, 60000);
};
