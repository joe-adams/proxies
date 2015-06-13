This is a server utility for the Ember project.

staticFrontEnd.js is for serving static, compiled files.
proxyFrontEnd.js is for proxying to the Ember development server.

Both servers proxy .csv files to yahoo to get the data.

Configurations are in config.js:  

	* directory is where it will serve the built Ember files from.  (__dirname is a Node global variable that refers to the current directory. You can take that out and just use an absolute path if you want)  

	* emberPort is the port the Ember developement server uses.

	* proxyFrontEndOutgoingPort is the port you want to use for serving with proxyFrontEnd.js

	* staticFronEndOutgoingPort is the port you want to use for serving with staticFronEndOutgoingPort.js

This is a pretty standard Node app, with normal setup:  

	* You must have Node.js installed

	* Before the first use you must run "npm install" from the directory this is installed on.

	* You run static from the install directory with "node staticFrontEnd.js"

	* You run proxy form the install directory with "node proxyFrontEnd.js"

 	* You turn the server off with Cntrl+C
