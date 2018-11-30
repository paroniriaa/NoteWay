var express = require('express');
var app = express();
var path    = require("path");

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/public/dashboard.html'));
});

app.get('/upload-note', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/upload-note.html'))
})

app.get('/note', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/note.html'))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});