// Global Variables
var TickerCount = 0;

// Constructor
var Ticker = function(id, alphabet, rate, easing, init, callback) {

  // set the time it takes for transition
  var rate = rate === undefined ? 500 : rate;

  //
  var id = id;

  //
  var alphabet = alphabet;

  // current value of the ticker as an array of chars
  var string = [];

  // internal id used for to account for multiple instantiations
  var internal_id = TickerCount;
  TickerCount++;

  //
  var transition;
  if(typeof easing === "function") transition = easing;
  else {
    switch (easing) {
      case "linear":
        transition = function(t, time_delta, rate) { return t; };
        break;
      case "easeInOutQuad":
        transition = function(t, time_delta, rate) { return rate / 2 > time_delta ? 2*Math.pow(t,2) : -2*Math.pow(t-1,2) + 1; };
        break;
      case "easeInOutSine":
        transition = function(t, time_delta, rate) { return -0.5*Math.cos(10*t/Math.PI) + 0.5; };
        break;
      default: // "easeInOutQuad"
        transition = function(t, time_delta, rate) { return rate / 2 > time_delta ? 2*Math.pow(t,2) : -2*Math.pow(t-1,2) + 1; };
        break;
    }
  }

  this.initialize = function(callback) {

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

    // run optional callback function
    if(typeof callback === "function") callback();

    // [1] === http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    // [2] === http://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply

  };

  this.terminate = function(target) {
    var div = document.getElementById(id);
    while(div.lastChild) div.removeChild(div.lastChild);
    div.textContent = string.join('');
    return;
  }

  this.update = function(target, callback) {

    function animate(curr, num) {

      function draw() {

        var next_time = new Date();
        var time_delta = next_time.getTime() - curr_time.getTime();

        if(time_delta >= rate) {
          var classnum = Number(i + num);
          node.className = "stock_ticker_" + classnum + "_" + internal_id;
          node.childNodes[0].nodeValue = alphabet[classnum];
          node.style.bottom = "0em";
          if(typeof callback === "function") callback();
        } else {
          var t = time_delta / rate;
          var pos = transition(t, time_delta, rate);
          var classnum = Math.floor(i + pos*num);
          node.className = "stock_ticker_" + classnum + "_" + internal_id;
          node.style.bottom = classnum - i - pos*num + "em";
          node.childNodes[0].nodeValue = alphabet[classnum];
          requestAnimationFrame(draw);
        }
      }

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

      // begin animation
      var curr_time = new Date();
      requestAnimationFrame(draw);
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

  if(init || init === undefined) this.initialize(callback);

  return this;
}
