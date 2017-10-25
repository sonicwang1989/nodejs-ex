//  OpenShift sample Node application
var express = require('express'),
  app = express();
var http = require('http');

Object.assign = require('object-assign')

app.engine('html', require('ejs').renderFile);

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 80,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.

  res.render('index.html');
});

app.get('/proxy.fuck', function (request, response) {
  var options = {
    hostname: 'www.google.com',
    port: 80,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36'
    }
  };
  var req = http.request(options, (res) => {
    for (var item in res.headers) {
      if (res.headers.hasOwnProperty) {
        response.append(item, res.headers[item]);
      }
    }
    response.statusCode = res.statusCode;
    res.on('data', function (trunk) {
      response.write(trunk)
    });
    res.on('end', function () {
      response.end();
    });
  });

  req.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
  });

  req.end();
});


// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
