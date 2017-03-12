var express = require('express');
var request = require('request');
var http = require('http');
var async = require('async')

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');


const urls = ["http://liftcfapp1.mybluemix.net/metafile.json",
		 	"http://liftcfapp2.mybluemix.net/metafile.json",
		 	"http://liftcfapp3.mybluemix.net/metafile.json"];


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
			for(j in x.FILES)
			{
				json.push(x.FILES[j]);
			}
		}

		consolidatedResult["FILES"] = json;
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
