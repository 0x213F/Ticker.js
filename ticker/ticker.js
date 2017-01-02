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

    function GetPrev(idx) {
      return idx == 0 ? alphabet[alphabet.length - 1] : alphabet[Number(idx) - 1];
    };

    function GetNext(idx) {
      return idx == alphabet.length - 1 ? alphabet[0] : alphabet[Number(idx) + 1];
    };

    var div = document.getElementById(id);
    var parent = div, node, child, before, after;
    var char, name, style;

    // split the target string into an array
    string = div.textContent.split('');

    // clean all children from target node [2]
    while(div.lastChild) div.removeChild(div.lastChild);

    // dynamically generate relevant classes for items in alphabet [1]
    for(var k in alphabet) {
      name = "stock_ticker_" + k + "_" + internal_id;
      style = document.head.appendChild(document.createElement("style"));
      style.type = "text/css";
      style.innerHTML = "." + name + ":before {  content: '" + GetNext(k) + "';position: absolute; top: 0em; left: 0em; }";
      //style.innerHTML += "." + name + ":after {  content: '" + GetPrev(k) + "';position: absolute; top: 2em; left: 0em; }";
    }

    // apply relevant classes and recursively build the DOM
    for(var c in string) {
      child = document.createElement("TICKER");
      node = document.createTextNode(string[c]);
      before = document.createElement("TICKER_MASK_BEFORE");
      after = document.createElement("TICKER_MASK_AFTER");
      child.appendChild(node);
      child.className = "stock_ticker_" + alphabet.indexOf(string[c]) + "_" + internal_id;
      child.id = "stock_ticker_id_" + c + "_" + internal_id;
      parent.appendChild(before);
      parent.appendChild(after);
      parent.appendChild(child);
    }

  };

  this.update = function(target) {

    function spin(idx, value) {

      function getClassNumb() {
        swit
      }

      function getClassName() {

      }

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
        var node = document.getElementById("stock_ticker_id_" + idx + "_" + internal_id);
        var c = 0;

        var interval = setInterval( function() {
          if(c >= rate) {
            clearInterval(interval);
            node.className = "stock_ticker_" + i + num + "_" + internal_id;
            node.childNodes[0].nodeValue = alphabet[i + num];
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

      var ticks = alphabet.indexOf(array[idx]) - alphabet.indexOf(string[idx]); // TODO fix
      animate(string[idx], ticks);
    }

    if(target.length !== string.length) { console.log(target.length, string.length); return; } /* TODO multiple length strings */

    //
    var array = target.split('');

    for(var char in array) {
      spin(char, document.getElementById("stock_ticker_id_" + char + "_" + internal_id).textContent);
    }

    string = target.split('');

  };

  initialize();

  return this;

}

// [1] === http://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
// [2] === http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
// [3] === http://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
