var sys = require('sys');
var http = require('http');
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
	callback(true);
}
MyApp.prototype.resourceEtag = function MyApp__resourceEtag (context, callback) {
	callback("ajksdhasjhdgajsghdjhags");
}
MyApp.prototype.resourceModified = function MyApp__resourceModified (context, callback) {
	callback(new Date());
}
MyApp.prototype.resourceExpiration = function MyApp__resourceExpiration (context, callback) {
	var exp = new Date();
	exp.setTime(exp.getTime() + 3600000);
	callback(exp);
}
MyApp.prototype.getResource = function MyApp__getResource (context, callback) {
	context.res.sendBody("This is the content");
	callback(true);
}

var server = nodemachine.createServer(8080);
server.trace = true;
server.addApp(new MyApp());
server.start();

//repl.start();

