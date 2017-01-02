// Global Variables
var TickerCount = 0;

// Constructor
var Ticker = function(id, alphabet, rate) {

  // set the time it takes for transition
  var rate = rate === undefined ? 100 : rate/5;

  //
  var id = id;

  var alphabet = alphabet;

  // current value of the ticker
  var string = "";

  // internal id used for to account for multiple instantiations
  var internal_id = TickerCount;
  TickerCount++;


  var initialize = function() {

    function GetNext(idx) {
      return idx == alphabet.length - 1 ? alphabet[0] : alphabet[Number(idx) + 1];
    };

    var div = document.getElementById(id);
    var parent = div, node, child, mask;
    var char, name, style;

    // split the target string into an array
    string = div.textContent.split('');

    // clean all children from target node [1]
    while(div.lastChild) div.removeChild(div.lastChild);

    // dynamically generate relevant classes for items in alphabet [2]
    for(var k in alphabet) {
      name = "stock_ticker_" + k + "_" + internal_id;
      style = document.head.appendChild(document.createElement("style"));
      style.type = "text/css";
      style.innerHTML = "." + name + ":before {  content: '" + GetNext(k) + "';position: absolute; top: 0em; left: 0em}";
    }

    // apply mask to hide overflow pseudo-elements
    mask = document.createElement("TICKER_MASK");
    parent.appendChild(mask);
    parent = mask;

    // apply relevant classes and append to the DOM
    for(var c in string) {
      child = document.createElement("TICKER");
      node = document.createTextNode(string[c]);
      child.appendChild(node);
      child.className = "stock_ticker_" + alphabet.indexOf(string[c]) + "_" + internal_id;
      child.id = "stock_ticker_id_" + c + "_" + internal_id;
      parent.appendChild(child);
    }

    // [1] === http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    // [2] === http://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply

  };

  this.update = function(target) {

    function animate(curr, num) {

      // find the matching entry in the alphabet
      var i;
      for(var item in alphabet) {
        if(alphabet[item] == curr) {
          i = Number(item);
          break;
        }
      }

      // get relevant context
      var node = document.getElementById("stock_ticker_id_" + char + "_" + internal_id);
      var c = 0;

      // draw a frame every 5ms
      var interval = setInterval( function() {
        if(c >= rate) {
          clearInterval(interval);
          var classnum = Number(i + num);
          node.className = "stock_ticker_" + classnum + "_" + internal_id;
          node.childNodes[0].nodeValue = alphabet[classnum];
          node.style.bottom = "0em";
        } else {
          var t = c / rate;
          var pos = rate / 2 > c ? 2*Math.pow(t,2) : -2*Math.pow(t-1,2) + 1;
          var classnum = Math.floor(i + pos*num);
          node.className = "stock_ticker_" + classnum + "_" + internal_id;
          node.style.bottom = classnum - i - pos*num + "em";
          node.childNodes[0].nodeValue = alphabet[classnum];
          c++;
        }
      }, 5);
    }

    /* TODO multiple length strings */
    if(target.length !== string.length) { console.log(target.length, string.length); return; }

    // handle each char in the string
    var array = target.split('');
    for(var char in array) {

      // compute Levenshtein distance for each char
      var val = document.getElementById("stock_ticker_id_" + char + "_" + internal_id).textContent;
      var distance = alphabet.indexOf(array[char]) - alphabet.indexOf(string[char]);
      if(distance !== 0) animate(string[char], distance);
    }

    // update the value of the string
    string = target.split('');

  };

  initialize();

  return this;
}
