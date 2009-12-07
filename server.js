var sys = require('sys');
var http = require('http');
//var repl = require('repl');
var nodemachine = require('./nodemachine');

var serverPort = 8080;

function MyApp () {
}
sys.inherits(MyApp, nodemachine.App);
MyApp.prototype.canHandleResource = function MyApp__canHandleResource (req) {
	return(true);
}

var server = nodemachine.createServer(8080);
server.trace = true;
server.addApp(new MyApp());
server.start();

//repl.start();

