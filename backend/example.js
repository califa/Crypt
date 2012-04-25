var http = require('http');
var
  util = require('util'),
  couchdb = require('felix-couchdb'),
  client = couchdb.createClient(5984, 'localhost'),
  db = client.db('my-db');
  
	db.saveDoc('my-doc', {awesome: 'couch fun'}, function(er, ok) {
    	if (er) throw new Error(JSON.stringify(er));
    	util.puts('Saved my first doc to the couch!');
  	});

	db.getDoc('my-doc', function(er, doc) {
    	if (er) throw new Error(JSON.stringify(er));
    	util.puts('Fetched my new doc from couch:');
    	util.p(doc);
  	});


http.createServer(function (req, res) {
	var responseEnd = 'request succeeded';
	res.writeHead(200, {'Content-Type': 'text/plain', "access-control-allow-origin": "*"});
	res.end(responseEnd);

}).listen(1337, '127.0.0.1');
    
console.log('Server running at http://127.0.0.1:1337/');
