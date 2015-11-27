var express = require('express');
var app = express();
var spawn = require("child_process").spawn;
var bodyParser = require('body-parser');
var fs = require('fs');
var mime = require('mime');
var player = require('chromecast-player')();
var rangeParser = require('range-parser');
var http = require('http');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); 

serveFile = function(req, res, path) {
  var stat = fs.statSync(path);
  var total = stat.size;
  var range = req.headers.range;
  var type = mime.lookup(path);

  res.setHeader('Content-Type', type);
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!range) {
    res.setHeader('Content-Length', total);
    res.statusCode = 200;
    return fs.createReadStream(path).pipe(res);
  }

  var part = rangeParser(total, range)[0];
  var chunksize = (part.end - part.start) + 1;
  var file = fs.createReadStream(path, {start: part.start, end: part.end});

  res.setHeader('Content-Range', 'bytes ' + part.start + '-' + part.end + '/' + total);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Length', chunksize);
  res.statusCode = 206;

  return file.pipe(res);
};

app.param('name', function (req, res, next, name) {
  serveFile(req, res, 'public/' + name);
})

app.get('/file/:name', function(req, res) {
});

var playerDebug = function(err, p, ctx) {
  console.log("playerDebug");
  if (err) {
    console.log(chalk.red(err));
  }

  p.on('playing', function() {
    console.log("Playing...");
  });
}

app.post("/play", function(req, res) {
  var options = {
    socketPath: '/hardware/hardware.sock',
    path: '/v1/network/default/ip'
  };

  http.get(options, function(res) {
    res.on('data', function(data) {
      var ip = data.toString();
      var appname = process.env.APP;
      var media = 'http://' + ip + '/' + appname + '/file/kitty.mp4';
      var params = {};
      params.media = {
        contentId: media,
        contentType: 'video/mp4',
        metadata: {
          title: 'Protonet FTW'
        }
      };
      params.address = req.body.ip;
      player.launch(params, playerDebug);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

