var sys = require("sys");
var http = require("http");

function v3b13 (context) {
	context.app.serviceAvailable(context, v3b13_callback)
}
function v3b13_callback (context, result) {
	HandleDecision(context, result, true, v3b12, 503);
}

function v3b12 (context) {
	HandleDecision(context, (context.app.getKnownMethods().indexOf(context.req.method.toUpperCase()) > -1), true, v3b11, 501);
}

function v3b11 (context) {
	context.app.uriTooLong(context, v3b11_callback);
}
function v3b11_callback (context, result) {
	HandleDecision(context, result, false, v3b10, 414);
}

function v3b10 (context) {
	if (context.app.getAllowedMethods().indexOf(context.req.method.toUpperCase()) < 0) {
		context.res.setHeader("Allow", context.app.getAllowedMethods(context.req).join(", "));
		HandleDecision(context, true, true, 405, 405);
	} else
		HandleDecision(context, true, true, v3b9, v3b9);
}

function v3b9 (context) {
	context.app.malformedRequest(context, v3b9_callback);
}
function v3b9_callback (context, result) {
	HandleDecision(context, result, false, v3b8, 400);
}

function v3b8 (context) {
	context.app.isAuthorized(context, v3b8_callback);
}
function v3b8_callback (context, result) {
	if (!result) {
		context.res.setHeader("WWW-Authenticate", context.app.getAuthenticationHeader(context.req));
		HandleDecision(context, true, true, 401, 401);
	} else
		HandleDecision(context, true, true, v3b7, v3b7);
}

function v3b7 (context) {
	context.app.isForbidden(context, v3b7_callback);
}
function v3b7_callback (context, result) {
	HandleDecision(context, result, false, v3b6, 403);
}

function v3b6 (context) {
	context.app.validContentHeaders(context, v3b6_callback);
}
function v3b6_callback (context, result) {
	HandleDecision(context, result, true, v3b5, 501);
}

function v3b5 (context) {
	var types = context.app.contentTypesAccepted();
	var matched = ((context.req.headers["content-type"] == null) || (types.length == 0));
	for (var i = 0; !matched && i < types.length; i++)
		matched = ((types[i] == "*/*") || (context.req.headers["content-type"] == types[i]));
	HandleDecision(context, matched, true, v3b4, 415);
}

function v3b4 (context) {
	context.app.validEntityLength(context, v3b4_callback);
}
function v3b4_callback (context, result) {
	HandleDecision(context, result, true, v3b3, 413);
}

function v3b3 (context) {
	if (context.req.method == "OPTIONS") {
		var headers = context.app.getOptions();
		for (var key in headers)
			context.res.setHeader(key, headers[key]);
		HandleDecision(context, true, true, 200, 200);
	} else
		HandleDecision(context, true, true, v3c3, v3c3);
}

function v3c3 (context) {
	HandleDecision(context, context.req.headers["accept"], null, v3d4, v3c4);
}

function v3c4 (context) {
	var accepted = context.req.headers["accept"].split(/,\s*/);
	var provided = context.app.contentTypesProvided();
	var match = (provided.length == 0);
	if (match)
		context.state['accept'] = accepted[0];
	//TODO: sort using q values
	while (!match && accepted.length) {
		var accept = accepted.shift().split(/\s*;\s*/)[0].toLowerCase();
		match = ((accept == "*/*") || (provided.indexOf(accept) > -1));
		if (match)
			context.state['accept'] = accept;
	}
	HandleDecision(context, match, true, v3d4, 406);
}

function v3d4 (context) {
	HandleDecision(context, context.req.headers["accept-language"], null, v3e5, v3d5);
}

function v3d5 (context) {
	var accepted = context.req.headers["accept-language"].split(/,\s*/);
	var provided = context.app.languagesProvided();
	var match = (provided.length == 0);
	if (match)
		context.state['accept-language'] = accepted[0];
	//TODO: sort using q values
	while (!match && accepted.length) {
		var accept = accepted.shift().split(/\s*;\s*/)[0].toLowerCase();
		match = ((accept == "*") || (provided.indexOf(accept) > -1));
		if (match)
			context.state['accept-language'] = accept;
	}
	HandleDecision(context, match, true, v3e5, 406);
}

function v3e5 (context) {
	HandleDecision(context, context.req.headers["accept-charset"], null, v3f6, v3e6);
}

function v3e6 (context) {
	var accepted = context.req.headers["accept-charset"].split(/,\s*/);
	var provided = context.app.charsetsProvided();
	var match = (provided.length == 0);
	if (match)
		context.state['accept-charset'] = accepted[0];
	//TODO: sort using q values
	while (!match && accepted.length) {
		var accept = accepted.shift().split(/\s*;\s*/)[0].toLowerCase();
		match = ((accept == "*") || (provided.indexOf(accept) > -1));
		if (match)
			context.state['accept-charset'] = accept;
	}
	HandleDecision(context, match, true, v3f6, 406);
}

function v3f6 (context) {
	HandleDecision(context, context.req.headers["accept-encoding"], null, v3g7, v3f7);
}

function v3f7 (context) {
	var accepted = context.req.headers["accept-encoding"].split(/,\s*/);
	var provided = context.app.encodingsProvided();
	var match = (provided.length == 0);
	if (match)
		context.state['accept-encoding'] = accepted[0];
	//TODO: sort using q values
	while (!match && accepted.length) {
		var accept = accepted.shift().split(/\s*;\s*/)[0].toLowerCase();
		match = ((accept == "*") || (provided.indexOf(accept) > -1));
		if (match)
			context.state['accept-encoding'] = accept;
	}
	HandleDecision(context, match, true, v3g7, 406);
}

function v3g7 (context) {
	var variances = context.app.getVariances().splice(0);
	if (context.app.contentTypesProvided().length)
		variances.push("Accept");
	if (context.app.languagesProvided().length)
		variances.push("Accept-language");
	if (context.app.charsetsProvided().length)
		variances.push("Accept-charset");
	if (context.app.encodingsProvided().length)
		variances.push("Accept-encoding");
	if (variances.length)
		context.res.setHeader("Vary", variances.join(", "));

	context.app.resourceExists(context, v3g7_callback);
}
function v3g7_callback (context, result) {
	HandleDecision(context, result, true, v3g8, v3h7);
}

function v3g8 (context) {
	HandleDecision(context, context.req.headers["if-match"], null, v3h10, v3g9);
}

function v3g9 (context) {
	HandleDecision(context, context.req.headers["if-match"], "*", v3h10, v3g11);
}

function v3g11 (context) {
	context.app.resourceEtag(context, v3g11_callback);
}
function v3g11_callback (context, result) {
	HandleDecision(context,
		(context.req.headers["if-match"].replace("\"", "") == result),
		true, v3h10, 412);
}

function v3h7 (context) {
	HandleDecision(context, context.req.headers["if-match"], "*", 412, v3i7);
}

function v3i7 (context) {
	HandleDecision(context, (context.req.method == "PUT"), true, v3i4, v3k7);
}

function v3i4 (context) {
	context.app.movedPermanently(context, v3i4_callback);
}
function v3i4_callback (context, result) {
	if (result) {
		context.setHeader("Location", result);
		HandleDecision(context, true, true, 301, 301);
	} else
		HandleDecision(context, true, true, v3p3, v3p3);
}

function v3k7 (context) {
	context.app.previouslyExisted(context, v3k7_callback);
}
function v3k7_callback (context, result) {
	HandleDecision(context, result, true, v3k5, v3l7);
}

function v3k5 (context) {
	context.app.movedPermanently(context, v3k5_callback);
}
function v3k5_callback (context, result) {
	if (result) {
		context.setHeader("Location", result);
		HandleDecision(context, true, true, 301, 301);
	} else
		HandleDecision(context, true, true, v3l5, v3l5);
}

function v3l5 (context) {
	context.app.movedTemporarily(context, v3l5_callback);
}
function v3l5_callback (context, result) {
	if (result) {
		context.setHeader("Location", result);
		HandleDecision(context, true, true, 307, 307);
	} else
		HandleDecision(context, true, true, v3m5, v3m5);
}

function v3l7 (context) {
	HandleDecision(context, (context.req.method == "POST"), true, v3m7, 404);
}

function v3m5 (context) {
	HandleDecision(context, (context.req.method == "POST"), true, v3n5, 410);
}

function v3m7 (context) {
	context.app.allowMissingPost(context, v3m7_callback);
}
function v3m7_callback (context, result) {
	HandleDecision(context, result, true, v3n11, 404);
}

function v3n5 (context) {
	context.app.allowMissingPost(context, v3n5_callback);
}
function v3n5_callback (context, result) {
	HandleDecision(context, result, true, v3n11, 410);
}

function v3h10 (context) {
	HandleDecision(context, context.req.headers["if-unmodified-since"], null, v3i12, v3h11);
}

function v3h11 (context) {
	HandleDecision(context, (Date.parse(context.req.headers["if-unmodified-since"]) > 0), true, v3h12, v3i12);
}

function v3h12 (context) {
	context.app.resourceModified(context, v3h12_callback);
}
function v3h12_callback (context, result) {
	HandleDecision(context,
		(result > Date.parse(context.req.headers["if-unmodified-since"])),
		true, 412, v3i12);
}

function v3i12 (context) {
	HandleDecision(context, context.req.headers["if-none-match"], null, v3l13, v3i13);
}

function v3i13 (context) {
	HandleDecision(context, context.req.headers["if-none-match"], "*", v3j18, v3k13);
}

function v3j18 (context) {
	HandleDecision(context,
		((context.req.method == "GET") || (context.req.method == "HEAD")),
		true, 304, 412);
}

function v3k13 (context) {
	context.app.resourceEtag(context, v3k13_callback);
}
function v3k13_callback (context, result) {
	HandleDecision(context,
		(context.req.headers["if-none-match"].replace("\"", "") == result),
		true, v3j18, v3l13);
}

function v3l13 (context) {
	HandleDecision(context, context.req.headers["if-modified-since"], null, v3m16, v3l14);
}

function v3l14 (context) {
	HandleDecision(context, (Date.parse(context.req.headers["if-modified-since"]) > 0), true, v3l15, v3m16);
}

function v3l15 (context) {
	HandleDecision(context,	(Date.parse(context.req.headers["if-modified-since"]) > new Date()), true, v3m16, v3l17);
}

function v3l17 (context) {
	context.app.resourceModified(context, v3l17_callback);
}
function v3l17_callback (context, result) {
	HandleDecision(context,
		(result > Date.parse(context.req.headers["if-modified-since"])),
		true, v3m16, 304);
}

function v3m16 (context) {
	HandleDecision(context, (context.req.method == "DELETE"), true, v3m20, v3n16);
}

function v3m20 (context) {
	context.app.deleteResource(context, v3m20_callback);
}
function v3m20_callback (context, result) {
	HandleDecision(context, result, true, v3m20b, 500);
}

function v3m20b (context) {
	context.app.deleteComplete(context, v3m20b_callback);
}
function v3m20b_callback (context, result) {
	HandleDecision(context, result, true, v3o20, 202);
}

function v3n16 (context) {
	HandleDecision(context, (context.req.method == "POST"), true, v3n11, v3o16);
}

function v3n11 (context) {
	context.app.postIsCreate(context, v3n11_callback);
}
function v3n11_callback (context, result) {
	if (result) {
		context.app.createPath(context, v3n11b_callback);
	} else {
		context.app.processPost(context, v3n11d_callback);
	}
}
function v3n11b_callback (context, result) {
	if (result) {
		//TODO: will this work or do we need to wrap the request?
		context.req.path = result;
		context.app.acceptContent(context, v3n11c_callback);
	} else
		HandleDecision(context, true, true, 500, 500);
}
function v3n11c_callback (context, result) {
	if (result) {
		//TODO: encode_body_if_set()
		HandleDecision(context, (context.res.getHeader("Location") != null), true, 303, v3p11);
	} else
		HandleDecision(context, true, true, 500, 500);
}
function v3n11d_callback (context, result) {
	if (result) {
		//TODO: encode_body_if_set()
		HandleDecision(context, (context.res.getHeader("Location") != null), true, 303, v3p11);
	} else
		HandleDecision(context, true, true, 500, 500);
}

function v3p11 (context) {
	HandleDecision(context, (context.res.getHeader("Location") != null), true, 201, v3o20);
}

function v3o16 (context) {
	HandleDecision(context, (context.req.method == "PUT"), true, v3o14, v3o18);
}

function v3o14 (context) {
	context.app.isConflict(context, function v3o14_callback (context, result) {
		if (!result) {
			context.app.acceptContent(context, v3o14b_callback);
		} else
			HandleDecision(context, true, true, 409, 409);
	});
}
function v3o14b_callback (context, result) {
	//TODO: if (result) encode_body_if_set()
	HandleDecision(context, result, true, v3p11, 500);
}

function v3o18 (context) {
	if (context.req.method == "GET" || context.req.method == "HEAD") {
		if (context.state["accept"])
			context.res.setHeader("Content-Type", context.state["accept"]);
		context.app.resourceEtag(context, v3o18_callback);
	} else
		context.app.multipleChoices(context, v3o18b_callback);
}
function v3o18_callback (context, result) {
	if (result)
		context.res.setHeader("ETag", result)
	context.app.resourceExpiration(context, v3o18c_callback);
}
function v3o18b_callback (context, result) {
	HandleDecision(context, result, true, 300, 200);
}
function v3o18c_callback (context, result) {
	if (result)
		context.res.setHeader("Expires", result.toUTCString());
	context.app.resourceModified(context, v3o18d_callback);
}
function v3o18d_callback (context, result) {
	if (result)
		context.res.setHeader("Last-Modified", result.toUTCString());
	if (context.req.method == "GET")
		context.app.getResource(context, v3o18e_callback);
}
function v3o18e_callback (context, result) {
	context.app.multipleChoices(context, v3o18f_callback);
}
function v3o18f_callback (context, result) {
	//TODO: encode_body_if_set()
	HandleDecision(context, result, true, 300, 200);
}

function v3o20 (context) {
	context.app.responseEntityExists(context, v3o20_callback);
}
function v3o20_callback (context, result) {
	HandleDecision(context, result, true, v3o18, 204);
}

function v3p3 (context) {
	context.app.isConflict(context, v3p3_callback);
}
function v3p3_callback (context, result) {
	if (!result) {
		context.app.acceptContent(context, v3p3b_callback);
	} else
		HandleDecision(context, true, true, 409, 409);
}
function v3p3b_callback (context, result) {
	//TODO: if (result) encode_body_if_set()
	HandleDecision(context, result, true, v3p11, 500);
}

function HandleDecision (context, result, expected, match, nomatch) {
	var which = (result == expected) ? match : nomatch;
	if ((typeof which) == "function") {
		if (context.trace)
			context.stack.push(which.name);
		which(context);
	} else if (which == parseInt(which)) {
		//TODO: allow message to be included with status results
		context.res.status = which;
		if (context.trace)
			context.res.setHeader("Decision-Stack", context.stack.join(", "));
		//TODO: implement isStreamable() to defer res.finish();
		context.app.completeResponse(context, HandleDecision_callback);
	} else
		throw new Exception("Unhandled result type for HandleDecision()");
}
function HandleDecision_callback (context, result) {
	context.res.finish();
}

function HandleRequest (server, req, res, trace) {
	var app = server.mapApp(req.uri.path);
	var context = new Context(app, req, res, trace);
	context.res.bufferResponse = app.bufferResponse(context);
	HandleDecision(context, true, true, v3b13, v3b13);
}

function Server (port, host, trace) {
	var self = this;
	this.trace = !!trace;
	this._port = port;
	this._host = host;
	this._httpServer = http.createServer(function (req, res) { HandleRequest(self, req, new Response(res), self.trace); });
	this._apps = [];
	this._defApp = new DefaultApp();
}

Server.prototype.start = function Server__start () {
	this._httpServer.listen(this._port, this._host);
}

Server.prototype.stop = function Server__stop () {
	this._httpServer.close();
}

Server.prototype.addApp = function Server__addApp (app) {
	this._apps.push(app);
}

Server.prototype.clearApps = function Server__clearApps () {
	this._apps = [];
}

Server.prototype.mapApp = function Server__mapApp (context) {
	for (var i = 0; i < this._apps.length; i++)
		if (this._apps[i].canHandleResource(context.req))
			return(this._apps[i]);
	sys.debug("Using default app");
	return(this._defApp);
}

function Context (app, req, res, trace) {
	this.trace = !!trace;
	this.stack = [];
	this.app = app;
	this.req = req;
	this.res = res;
	this.state = {};
}

function Response (res) {
	this._res = res;
	this._status = 200
	this._headers = {};
	this._headersSent = false;
	this._bufferResponse = true;
	this._buffer = [];
}

Response.prototype.__defineGetter__("realResponse", function Response__getRealResponse () { return(this._res); });

Response.prototype.__defineGetter__("status", function Response__getStatus () { return(this._status); });
Response.prototype.__defineSetter__("status", function Response__setStatus (value) { if (value == parseInt(value)) { this._status = value; } });

Response.prototype.__defineGetter__("bufferResponse", function Response__getBufferResponse () { return(this._bufferResponse); });
Response.prototype.__defineSetter__("bufferResponse", function Response__setBufferResponse (value) { this._bufferResponse = !!value; });

Response.prototype.sendHeader = function Response__sendHeader (statusCode, headers) {
	return(this._res.sendHeader(statusCode, headers));
}

Response.prototype.sendBody = function Response__sendBody (chunk, encoding) {
	if (this._bufferResponse)
		this._buffer.push([chunk, encoding]);
	else {
		this.flushBody();
		this._res.sendBody(chunk, encoding); //TODO: apply encoding method here
	}
}

Response.prototype.sendHeaders = function Response__sendHeaders () {
	if (this._headersSent)
		return;
	this._res.sendHeader(this._status, this._headers);
	this._headersSent = true;
}

Response.prototype.flushBody = function Response__flushBody () {
	this.sendHeaders();
	this._buffer.forEach(function (element, index, array) {
		this._res.sendBody(element[0], element[1]); //TODO: apply encoding method here
	}, this);
}

Response.prototype.finish = function Response__finish () {
	this.flushBody();
	return(this._res.finish());
}

Response.prototype.setHeader = function Response__setHeader (name, value) {
	if (this._headersSent)
		throw new Exception("Attempt to modify headers after headers sent to client");
	this._headers[name] = value;
}

Response.prototype.getHeader = function Response__getHeader (name) {
	return(this._headers[name]);
}

Response.prototype.delHeader = function Response__delHeader (name) {
	return(delete this._headers[name]);
}

function App () {
}

App.knownMethods = ["GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT", "OPTIONS"]; //TODO: fix Node.js strictness on methods
App.allowedMethods = ["GET", "HEAD"];

App.prototype.canHandleResource = function App__canHandleResource (context) {
	return(false);
}

App.prototype.serviceAvailable = function App__serviceAvailable (context, callback) {
	callback(context, true);
}

App.prototype.getKnownMethods = function App__getKnownMethods (context) {
	return(App.knownMethods);
}

App.prototype.uriTooLong = function App__uriTooLong (context, callback) {
	callback(context, false);
}

App.prototype.getAllowedMethods = function App__getAllowedMethods (context) {
	return(App.allowedMethods);
}

App.prototype.malformedRequest = function App__malformedRequest (context, callback) { //TODO: fix Node.js bail on malformed requests
	callback(context, false);
}

App.prototype.isAuthorized = function App__isAuthorized (context, callback) {
	callback(context, true)
}

App.prototype.isForbidden = function App__isForbidden (context, callback) {
	callback(context, false);
}

App.prototype.getAuthenticationHeader = function App__getAuthenticationHeader (context) {
	return("Basic realm=\"NodeMachine\"");
}

App.prototype.validContentHeaders = function App__validContentHeaders (context, callback) {
	callback(context, true);
}

App.prototype.validEntityLength = function App__validEntityLength (context, callback) {
	callback(context, true);
}

App.prototype.getOptions = function App__getOptions (context) {
	return({});
}

App.prototype.contentTypesAccepted = function App__contentTypesAccepted (context) {
	return([]);
}

App.prototype.contentTypesProvided = function App__contentTypesProvided (context) {
	return([]);
}

App.prototype.languagesProvided = function App__languagesProvided (context) {
	return([]);
}

App.prototype.charsetsProvided = function App__charsetsProvided (context) {
	return([]);
}

App.prototype.encodingsProvided = function App__encodingsProvided (context) {
	return([]);
}

App.prototype.getVariances = function App__getVariances (context) {
	return([]);
}

App.prototype.resourceExists = function App__resourceExists (context, callback) {
	callback(context, true);
}

App.prototype.resourceEtag = function App__resourceEtag (context, callback) {
	callback(context, null);
}

App.prototype.resourceModified = function App__resourceModified (context, callback) {
	callback(context, null);
}

App.prototype.resourceExpiration = function App__resourceExpiration (context, callback) {
	callback(context, null);
}

App.prototype.movedPermanently = function App__movedPermanently (context, callback) {
	callback(context, false);
}

App.prototype.movedTemporarily = function App__movedTemporarily (context, callback) {
	callback(context, false);
}

App.prototype.previouslyExisted = function App__previouslyExisted (context, callback) {
	callback(context, false);
}

App.prototype.allowMissingPost = function App__allowMissingPost (context, callback) {
	callback(context, false);
}

App.prototype.deleteResource = function App__deleteResource (context, callback) { //Deletion of resource occurs here
	callback(context, false);
}

App.prototype.deleteComplete = function App__deleteComplete (context, callback) {
	callback(context, true);
}

App.prototype.responseEntityExists = function App__responseEntityExists (context, callback) {
	callback(context, false);
}

App.prototype.isConflict = function App__isConflict (context, callback) {
	callback(context, false);
}

App.prototype.postIsCreate = function App__postIsCreate (context, callback) {
	callback(context, false);
}

App.prototype.createPath = function App__createPath (context, callback) {
	callback(context, null);
}

App.prototype.acceptContent = function App__acceptContent (context, callback) { //Handling of post data occurs here (and, perhaps, write body)
	callback(context, false);
}

App.prototype.processPost = function App__processPost (context, callback) { //Handling of post data occurs here (and, perhaps, write body)
	callback(context, false);
}

App.prototype.getResource = function App__getResource (context, callback) { //Sending of contenet for GET may occur here
	callback(context, false);
}

App.prototype.multipleChoices = function App__multipleChoices (context, callback) {
	callback(context, false);
}

App.prototype.completeResponse = function App__completeResponse (context, callback) { //Sending of content for GET/POST may occur here
	callback(context, true);
}

App.prototype.bufferResponse = function App__bufferResponse (context, callback) {
	return(true);
}

function DefaultApp () {
}
sys.inherits(DefaultApp, App);
DefaultApp.prototype.serviceAvailable = function DefaultApp__serviceAvailable (context, callback) {
	callback(context, false);
}
DefaultApp.prototype.canHandleResource = function DefaultApp__canHandleResource (context) {
	return(true);
}

exports.createServer = function createServer (port, host) {
	return(new Server(port, host));
}

exports.App = App;

exports.Context = Context;
