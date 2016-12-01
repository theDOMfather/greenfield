var http = require ('http');
var path = require ('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var port = process.env.PORT || 8000; 


app.use('/', express.static(path.join(__dirname, '../client')));
app.use('/modules', express.static(path.join(__dirname, '../node_modules')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res) {
	res.write('hello');
	res.end();
});



app.listen(port); 
console.log('Listing to ....' + port ); 


