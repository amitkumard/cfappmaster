var express = require('express');
var request = require('request');
var http = require('http');
var async = require('async')
var fs = require('fs')

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');


urls = [];


fs.readFile('metafile.json', 'utf8', function (err,data) {
	var json = JSON.parse(data);
	if (err) {
	return console.log(err);
	}
	else
	{
		for(var i=0; i<json.urls.length; i++)
		{
			//console.log("Hola");
			urls[i] = json.urls[i];
		}
	}
});

var output = [];
function httpGet(url, callback) {
  const options = {
    url :  url,
    json : true
  };
  request(options,
    function(err, res, body) {
    	var json = body;
    	output.push(json);
    	callback(err, json);
    }
  );
}

app.get('/', function(req, res){
	async.map(urls, httpGet, function (err, result){
	  if (err) return console.log(err);
	    var consolidatedResult = {};
	  	var json = [];

		for(i in output)
		{
			var x = output[i];
			for(j in x.files)
			{
				json.push(x.files[j]);
			}
		}

		consolidatedResult["files"] = json;
		res.setHeader('Content-Type', 'application/json');
		res.send(consolidatedResult);

		output = [];
		json = [];
		consolidatedResult = {};

	});
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
   console.log('Express server listening on port ' + app.get('port'));
});
