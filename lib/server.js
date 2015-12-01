module.exports = function(options) {
  var express = require('express');
  var cors = require('cors');
  var app = express();

  app.use(cors());

  var server = app.listen(options.port, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at %s:%d', host, port);
  });
  return app;
}