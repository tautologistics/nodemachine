var sys = require('sys');
var http = require('http');
var nodemachine = require('./lib/nodemachine');
var testscenarios = require("./testscenarios");

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
						return(arguments[1](arguments[0], ((typeof this._overrides[name]) != "function") ? this._overrides[name] : this._overrides[name](arguments[0])));
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

var failedTests = {};

function runTest(currentTest) {
	if (currentTest >= testscenarios.tests.length) {
		var failedCount = 0;
		var failedList = [];
		for (var key in failedTests) {
			failedCount++;
			failedList.push(key);
		}
		sys.puts("Done testing");
		sys.puts("Tests passed: " + (currentTest - failedCount));
		sys.puts("Tests failed: " + failedCount + (failedCount ? (" (" + failedList.join(', ') + ")") : ""));
		
		process.exit(failedCount ? 1 : 0);
	}

	var testScenario = testscenarios.tests[currentTest];
	var request = testClient.request(testScenario.method.toUpperCase(), testScenario.path, testScenario.headers);
	server.clearApps();
	server.addApp(new TestApp(testScenario.appConfig));
	
	sys.puts("Running test [" + (currentTest + 1) + "] " + testScenario.name);
	
	var body = '';
//	request.finish(function (response) {
	request.addListener("response", function (response) {
		response.setEncoding("utf8");
		response.addListener("data", function (chunk) {
			body += chunk;
		});
		response.addListener("end", function () {
			if (!((testScenario.checkBody == null) || testScenario.checkBody(body))) {
				failedTests[testScenario.name] = 1;
				sys.puts("    Bad body");
			}
			runTest(currentTest + 1);
		});
		if (testScenario.checkStatus != response.statusCode) {
			failedTests[testScenario.name] = 1;
			sys.puts("    Bad status. " + testScenario.checkStatus + " : " + response.statusCode);
		}
		if (testScenario.checkStack.join(', ') != response.headers["decision-stack"]) {
			failedTests[testScenario.name] = 1;
			sys.puts("    Bad stack. " + testScenario.checkStack.join(', ') + " : " + response.headers["decision-stack"]);
		}
		if (!((testScenario.checkHeaders == null) || testScenario.checkHeaders(response.headers))) {
			failedTests[testScenario.name] = 1;
			sys.puts("    Bad headers");
		}
	});
	request.end();
}

runTest(0);
