var http = require('http');
var httpProxy = require('http-proxy');
var url = require('url');
var nodeStatic = require('node-static');
var config = require('./config');

console.log(config.directory);
var stat = new nodeStatic.Server(config.directory);

var yahooServer = httpProxy.createProxyServer({
    target: 'http://ichart.yahoo.com',
    secure: false
}).on('error', function() {
    console.log('it looks like the server is down.');
});


http.createServer(function(request, response) {
    console.log('hi');
    var path = url.parse(request.url).pathname;
    console.log(path);
    console.log('path: ' + path);
    if (path.indexOf('/table.csv') === 0) {
        console.log('Going to yahoo');
        //They won't give you the file if your host is wrong.
        request.headers.host = 'ichart.yahoo.com';
        yahooServer.web(request, response);
    } else {
        console.log('Going to ember');
        request.addListener('end', function() {
            stat.serve(request, response, function(e, res) {
            	//File wasn't found.  The URL was probably a route.  This feels a bit hackish, but it works.
                if (e && (e.status === 404)) { 
                    stat.serveFile('/index.html', 500, {}, request, response);
                }
            });
        }).resume();

    }

}).listen(config.staticFronEndOutgoingPort);
console.log('Static Front End Server running on port ' + config.staticFronEndOutgoingPort);
