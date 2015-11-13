var express = require('express');
var app = express();
var spawn = require("child_process").spawn;
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); 

app.post("/play", function(req, res) {
  // You can also pass a youtube url instead of a local file uri
  var castnow = spawn(require.resolve("castnow"), ["--address", req.body.ip, "./public/kitty.mp4"]);
  castnow.stdout.on("data", function(data) {
    console.log("stdout:", data.toString());
  });
  castnow.stderr.on("data", function(data) {
    console.log("stderr:", data.toString());
  });
  res.send("playing!");
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
