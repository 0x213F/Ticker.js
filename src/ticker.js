// used to keep track of multiple ticker instantiations
var TickerCount = 0;

// Constructor
var Ticker = function(id, alphabet, rate, easing, init, callback) {

  // set the time it takes for transition
  var rate = rate === undefined ? 500 : rate;

  // the id of where the ticker will live
  var id = id;

  // the alphabet
  var alphabet = alphabet;

  // current value of the ticker as an array of chars
  var string = [];
  var str_pos = [];

  // internal id used for to account for multiple instantiations
  var internal_id = TickerCount++;

  //
  var busy = [];
  var interupt = [];
  var param1 = [], param2 = [];
  var that = this;

  // define the transition function
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

    var it;
    var div = document.getElementById(id);
    var parent = div, node, child, mask;
    var char, name, style;

    // split the target string into an array
    string = div.textContent.split('');

    // initialize busy and interupt flags
    for(it in string) {
      busy[it] = false;
      interupt[it] = false;
    }

    // clean all children from target node [1]
    while(div.lastChild) div.removeChild(div.lastChild);

    // dynamically generate relevant classes for items in alphabet [2]
    for(it in alphabet) {
      name = "ticker_" + it + "_" + internal_id;
      style = document.head.appendChild(document.createElement("style"));
      style.type = "text/css";
      style.innerHTML = "." + name + ":before {  content: '" + GetNext(it) + "';position: absolute; top: 0em; left: 0em}";
    }

    // determine the str_pos of each char in the string
    var temp_str = alphabet.join(''); // TODO iterate through array not convert to string
    for(var it in string) {
      str_pos[it] = temp_str.indexOf(string[it]);
    }

    // apply mask to hide overflow pseudo-elements
    mask = document.createElement("TICKER_MASK");
    parent.appendChild(mask);
    parent = mask;

    // apply relevant classes and append to the DOM
    for(var it in string) {
      child = document.createElement("TICKER");
      node = document.createTextNode(string[it]);
      child.appendChild(node);
      child.className = "ticker_" + alphabet.indexOf(string[it]) + "_" + internal_id;
      child.id = "ticker_id_" + it + "_" + internal_id;
      parent.appendChild(child);
    }

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

    function animate(uhm, idx, num) {

      function draw(idx, node) {
        if(interupt[idx]) {
          busy[idx] = false;
          interupt[idx] = false;
          that.update(param1[idx], param2[idx]);
          return;
        }

        var next_time = new Date();
        var time_delta = next_time.getTime() - curr_time.getTime();

        if(time_delta >= rate) {
          var classnum = Number(uhm + num);
          node.className = "ticker_" + classnum + "_" + internal_id;
          node.childNodes[0].nodeValue = alphabet[classnum];
          node.style.bottom = "0em";
          str_pos[idx] = uhm + num;
          busy[idx] = false;
          if(typeof callback === "function") callback();
        } else {
          var t = time_delta / rate;
          var pos = transition(t, time_delta, rate);
          var classnum = Math.floor(uhm + pos*num);
          node.className = "ticker_" + classnum + "_" + internal_id;
          node.style.bottom = classnum - uhm - pos*num + "em";
          node.childNodes[0].nodeValue = alphabet[classnum];
          str_pos[idx] = uhm + pos*num;
          requestAnimationFrame(function(){draw(idx, node);});
        }
      }

      // get relevant context
      var node = document.getElementById("ticker_id_" + idx + "_" + internal_id);
      var curr_time = new Date();
      requestAnimationFrame(function() { draw(idx, node); });
    }

    /* TODO multiple length strings */
    if(target.length !== string.length) { console.log(target.length, string.length); return; }

    // handle each char in the string
    var array = target.split('');
    for(var idx in array) {

      // compute Levenshtein distance for each char
      var val = document.getElementById("ticker_id_" + idx + "_" + internal_id).textContent;
      var distance = alphabet.indexOf(array[idx]) - str_pos[idx];

      // only char if there was a change
      if(distance !== 0) {

        // "spin lock" for if an animation is already happening
        if(busy[idx]) {
          interupt[idx] = true;
          param1[idx] = target;
          param2[idx] = callback;
          return;

        // start the animation
        } else {
          busy[idx] = true;
          var i = Number(str_pos[idx]);
          animate(i, idx, distance);
        }
      }
    }

    // update the value of the string
    string = target.split('');

  };

  if(init || init === undefined) this.initialize();

  return this;
}
