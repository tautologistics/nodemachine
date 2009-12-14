var sys = require('sys');
var http = require('http');
var nodemachine = require('./nodemachine');
process.mixin(GLOBAL, require("./testscenarios"));

var serverPort = 8080;
var serverHost = "localhost";

/*
function Test () {
	this._fun = function () { return(1); };
}
Test.prototype.__defineGetter__("Foo", function () { return(this._fun); });
Test.prototype.__defineSetter__("Foo", function (value) { this._fun = value; });

var test = new Test();
sys.debug(test.Foo());
test.Foo = function () { return(2); }
sys.debug(test.Foo());
*/

function TestApp (overrides) {
	this._overrides = overrides;
}
//*/
for (var key in nodemachine.App.prototype) {
	if ((key != "constructor") && ((typeof nodemachine.App.prototype[key]) == "function")) {
		TestApp.prototype[key] = (function (name, origFun) {
			return(function () {
				if (this._overrides[name] != null)
					if (arguments.length == 2)
						return(arguments[1](((typeof this._overrides[name]) != "function") ? this._overrides[name] : this._overrides[name](arguments[0])));
					else
						return(((typeof this._overrides[name]) != "function") ? this._overrides[name] : this._overrides[name](arguments[0]));
				return(origFun.apply(this, arguments));
			});
		})(key, nodemachine.App.prototype[key]);
	}
}

var server = nodemachine.createServer(serverPort);
server.trace = true;
server.start();

var testClient = http.createClient(serverPort, serverHost);

function runTest(currentTest) {
	if (currentTest >= testScenarios.length) {
		sys.puts("Done testing");
		process.exit(0);
	}

	var testScenario = testScenarios[currentTest];
//	var request = testClient[testScenario.method.toLowerCase()](testScenario.path, testScenario.headers);
	var request = testClient.request(testScenario.method.toUpperCase(), testScenario.path, testScenario.headers);
	server.clearApps();
	server.addApp(new TestApp(testScenario.appConfig));
	
	sys.puts("Running test [" + (currentTest + 1) + "] " + testScenario.name);
	
	var body = '';
	request.finish(function (response) {
		response.setBodyEncoding("utf8");
		response.addListener("body", function (chunk) {
			body += chunk;
		});
		response.addListener("complete", function () {
			if (!((testScenario.checkBody == null) || testScenario.checkBody(body)))
				sys.puts("    Bad body");
			runTest(currentTest + 1);
		});
		if (testScenario.checkStatus != response.statusCode)
			sys.puts("    Bad status. " + testScenario.checkStatus + " : " + response.statusCode);
		if (testScenario.checkStack.join(', ') != response.headers["decision-stack"])
			sys.puts("    Bad stack. " + testScenario.checkStack.join(', ') + " : " + response.headers["decision-stack"]);
		if (!((testScenario.checkHeaders == null) || testScenario.checkHeaders(response.headers)))
			sys.puts("    Bad headers");
	});
}

runTest(0);
