var sys = require('sys');
var http = require('http');
var url = require('url');
//var repl = require('repl');
var nodemachine = require('./nodemachine');

var serverPort = 8080;

function MyApp () {
}
sys.inherits(MyApp, nodemachine.App);
MyApp.prototype.canHandleResource = function MyApp__canHandleResource (context) {
	return(true);
}
MyApp.prototype.resourceExists = function MyApp__resourceExists (context, callback) {
	callback(context, true);
}
MyApp.prototype.resourceEtag = function MyApp__resourceEtag (context, callback) {
	callback(context, "ajksdhasjhdgajsghdjhags");
}
MyApp.prototype.resourceModified = function MyApp__resourceModified (context, callback) {
	callback(context, new Date());
}
MyApp.prototype.contentTypesProvided = function MyApp__contentTypesProvided (context) {
	return(["text/plain"]);
}
MyApp.prototype.resourceExpiration = function MyApp__resourceExpiration (context, callback) {
	var exp = new Date();
	exp.setTime(exp.getTime() + 3600000);
	callback(context, exp);
}
MyApp.prototype.getResource = function MyApp__getResource (context, callback) {
	callback(context, true);
}
MyApp.prototype.completeResponse = function MyApp__completeResponse (context, callback) {
	context.req.uri = url.parse(context.req.url);
	var limit = parseInt(context.req.uri.pathname.replace('/', ''));
	function sendLoop (context, limit) {
		context.res.sendBody("Ping: " + limit + "\n");
		if (limit <= 0)
			callback(context, true);
		else
			setTimeout(function () {
				sendLoop(context, limit - 1);
			}, 1000);
	}
	sendLoop(context, limit);
}
MyApp.prototype.bufferResponse = function MyApp__bufferResponse (context, callback) {
	return(false);
}

var server = nodemachine.createServer(8080);
server.trace = true;
server.addApp(new MyApp());
server.start();

sys.puts("Ready for requests @ http://localhost:" + serverPort + "/");

//repl.start();

