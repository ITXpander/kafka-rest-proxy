/*jslint node: true */
'use strict';

var restify = require('restify');
var path = require('path');
var routes = require(path.join(__dirname, '/app/routes/'));

var server = restify.createServer({
  name: 'node-kafka-proxy'
});

server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.pre(restify.pre.sanitizePath());
server.use(
  function crossOrigin(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    return next();
  }
);

server.on('uncaughtException', function (req, res, route, err) {
  log.info('******* Begin Error *******\n%s\n*******\n%s\n******* End Error *******', route, err.stack);
  if (!res.headersSent) {
    return res.send(500, {ok: false});
  }
  res.write('\n');
  res.end();
});

// init routes
routes(server);

// default route
server.get('/', function (req, res, next) {
  res.send('node-kafka-proxy');
  return next();
});

var port = process.env.PORT || 8080;
server.listen(port, function(err) {
    if (err)
        console.error(err)
    else
        console.log('%s listening at %s', server.name, server.url);
});
