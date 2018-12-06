var express = require('express');
var app = express();
var path = require("path");

app.use(express.static('public'))
app.use('/section', express.static('public'));
app.use('/note', express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/public/dashboard.html'));
});

app.get('/upload-note', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/upload-note.html'))
});

app.get('/note', function(req, res) {
  // console.log(req.params);
  res.sendFile(path.join(__dirname+'/public/note.html'))
});

app.get('/section', function(req, res) {
    res.sendFile(path.join(__dirname+'/public/section.html'))
});

app.get('/download-page', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/download-page.html'))
});

app.get('/upload-page', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/upload-page.html'))
});
	
app.get('/sort-page', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/sort-page.html'))
});

app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 3000!');
});

