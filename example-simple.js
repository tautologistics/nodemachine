var sys = require('sys');
var http = require('http');
//var repl = require('repl');
var nodemachine = require('./lib/nodemachine');

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
MyApp.prototype.resourceExpiration = function MyApp__resourceExpiration (context, callback) {
	var exp = new Date();
	exp.setTime(exp.getTime() + 3600000);
	callback(context, exp);
}
MyApp.prototype.getResource = function MyApp__getResource (context, callback) {
	context.res.sendBody("This is the content");
	callback(context, true);
}

var server = nodemachine.createServer(8080);
server.trace = true;
server.addApp(new MyApp());
server.start();

sys.puts("Ready for requests @ http://localhost:" + serverPort + "/");

//repl.start();

