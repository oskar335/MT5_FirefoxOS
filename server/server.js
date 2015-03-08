// Developed by Michel Buffa

var fs = require("fs");
// We need to use the express framework: have a real web server that knows how to send mime types etc.
var express=require('express');
var path = require('path'); 

// Init globals variables for each module required
var app = express()
, http = require('http')
, server = http.createServer(app);

// Config
var PORT = process.env.PORT,
	TRACKS_PATH = './client/multitrack/',
	addrIP = process.env.IP;

//User validation
var auth = express.basicAuth(function(user, pass) {     
   return (user == "super" && pass == "secret");
},'Super duper secret area');

if(PORT == 8009) {
    app.use(auth);
}

// Indicate where static files are located  
/*app.configure(function () {  
	app.use(express.static(__dirname + '/client/'));  
});  */

app.use(express.static(path.resolve(__dirname, 'client')));


// launch the http server on given port
server.listen(PORT || 8081, function(){
  var addr = server.address();
  console.log("Chat server listening at localhost:" + addr.port);
});



// routing
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

// routing
app.get('/track', function (req, res) {
	function sendTracks(trackList) {
		if (!trackList)
			return res.send(404, 'No track found');
		res.writeHead(200, { 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'});
		res.write(JSON.stringify(trackList));
		res.end();
	}

	getTracks(sendTracks); 
});

// routing
app.get('/track/:id', function (req, res) {
	var id = req.params.id;
	
	function sendTrack(track) {
		if (!track)
			return res.send(404, 'Track not found with id "' + id + '"');
		
		res.writeHead(200, { 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'});
		res.write(JSON.stringify(track));
		res.end();
	}
	getTrack(id, sendTrack); 

});


function getTracks(callback) {
	getFiles(TRACKS_PATH, callback);
}


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isASoundFile(fileName) {
    if(endsWith(fileName, ".mp3")) return true;
    if(endsWith(fileName, ".ogg")) return true;
    if(endsWith(fileName, ".wav")) return true;
    return false;
}

function getTrack(id, callback) {
	//console.log("id = " + id);
	if(!id) return;

	getFiles(TRACKS_PATH + id, function(fileNames) {
		if(! fileNames) { 
			callback(null);
			return;
		}
		
		var track = {
			id: id,
			instruments: []	
		};
		fileNames.sort();
		for (var i = 0; i < fileNames.length; i++) {
			// filter files that are not sound files
			if(!isASoundFile(fileNames[i])) continue;

			var instrument = fileNames[i].match(/(.*)\.[^.]+$/, '')[1];
			track.instruments.push({
				name: instrument,
				sound: fileNames[i]
			});
		}
		callback(track);
	})
}

function getFiles(dirName, callback) {
	fs.readdir(dirName, function(error, directoryObject) {
		if(directoryObject !== undefined) {
	    	directoryObject.sort();
		}
        callback(directoryObject);
    });
}

// Accepter les requetes cross-domain
module.exports = function() {

	return function(req, res, next) {
	
		if (!req.get('Origin')) 
			return next();
			
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
		res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
		
		if ('OPTIONS' === req.method) 
			return res.send(200);
		next();
	};

}; 

/*var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
}

app.use(allowCrossDomain);*/