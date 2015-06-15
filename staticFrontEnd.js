var http = require('http');
var httpProxy = require('http-proxy');
var url = require('url');
var nodeStatic = require('node-static');
var config = require('./config');
var fs = require('fs');
var path = require('path');


console.log(config.directory);
var stat = new nodeStatic.Server(config.directory);

var yahooServer = httpProxy.createProxyServer({
    target: 'http://ichart.yahoo.com',
    secure: false
}).on('error', function() {
    console.log('it looks like the server is down.');
});

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

var actualDirectories=getDirectories(config.directory);
console.log('found directories: '+JSON.stringify(actualDirectories));
var matchesDirectory=function(path){
    return actualDirectories.some(function(directory){
        return path.indexOf('/'+directory)===0;
    });
}

http.createServer(function(request, response) {
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
            if (matchesDirectory(path)){
                console.log('serving requested file');
                stat.serve(request, response);
            }else{
                console.log('serving index.html');
                stat.serveFile('/index.html', 500, {}, request, response);
            }
        }).resume();

    }

}).listen(config.staticFronEndOutgoingPort);
console.log('Static Front End Server running on port ' + config.staticFronEndOutgoingPort);
