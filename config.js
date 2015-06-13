//I make this a node module rather than a pure json file so we have freedom to write comments and compute properties.
module.exports={directory:__dirname+'/dist',
	emberPort:4200,
	proxyFrontEndOutgoingPort:5000,
	staticFronEndOutgoingPort:5001
};