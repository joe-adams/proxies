var http = require('http');
var httpProxy = require('http-proxy');
var url = require('url');
var config=require('./config.js');

var emberServer=httpProxy.createProxyServer({
            target: 'http://localhost:'+config.emberPort,
            secure: false
        }).on('error',function(){
        	//The app shuts down if you don't handle the error.
        	console.log('it looks like the server is down.');
        });



var yahooServer=httpProxy.createProxyServer({
            target: 'http://ichart.yahoo.com',
            secure: false
        }).on('error',function(){
            //I guess this server shouldn't really be down.
        	console.log('it looks like the server is down.');
        });


http.createServer(function(request,response){
	var path = url.parse(request.url).pathname;
	console.log('path: '+path);
	if (path.indexOf('/table.csv')===0){
		console.log('Going to yahoo');
		//They won't give you the file if your host is wrong.
        request.headers.host='ichart.yahoo.com';
		yahooServer.web(request, response);
	} else{
		console.log('Going to ember');
		emberServer.web(request, response);
	}

}).listen(config.proxyFrontEndOutgoingPort);
console.log('Proxy Front End Server running on port '+config.proxyFrontEndOutgoingPort);