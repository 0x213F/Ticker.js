function clock_init() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  if(hours < 10) hours = "0" + hours;
  if(minutes < 10) minutes = "0" + minutes;
  if(seconds < 10) seconds = "0" + seconds;

  var str = hours + ":" + minutes + ":" + seconds;

  document.getElementById("time").textContent = str;
}

function clock_tick() {
  if(counter === undefined) {
    clearInterval(tick);
    return;
  }

  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  if(hours < 10) hours = "0" + hours;
  if(minutes < 10) minutes = "0" + minutes;
  if(seconds < 10) seconds = "0" + seconds;

  var str = hours + ":" + minutes + ":" + seconds;

  counter.update(str);
}

clock_init();
var counter = new Ticker("time", ['0','1','2','3','4','5','6','7','8','9'], 1500);
clock_tick();
var tick = setInterval(clock_tick ,1000);
