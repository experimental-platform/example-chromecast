var express = require('express');
var app = express();
var spawn = require("child_process").spawn;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.post("/play", function(req, res) {
  // Also supports youtube urls
  spawn(require.resolve("castnow"), ["./public/kitty.mp4"]);
  res.send("playing!");
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
