var http = require ('http');

http.createServer(function (request, res) {

  res.writeHead(200, {'Content-Type': 'text/plain',
                      'Access-Control-Allow-Origin': "*",
                      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'});
  var params = "{\"operation\":\"read\",\"tableName\":\"LambdaTable\",\"payload\":{\"Key\":{\"Id\":\"1\"}}}";

  var options = {
    host: 'h8c6gba5x8.execute-api.us-east-1.amazonaws.com',
    path: '/prod/LambdaFunctionOverHttps',
    port: '443',
    method: 'POST'
   };

  var https = require('https');
  callback = function (response) {
    //console.log(response.statusCode);
    var str = ' ';
    response.on('data', function (chunk) {
       str += chunk;
    });

    response.on('end', function () {
      var item = JSON.parse(str);
      //console.log(item.Item.SearchString);
      //console.log(str);
      res.end(str);
    });
  }  

   try {
     var req = https.request(options, callback);
     req.write(params);
     req.end();
   } catch (e) {
     console.error(e.stack);
   } 

}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');
