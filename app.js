var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', 4000);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/all', function (req, res) {
    res.json([{name: 'xxx'},{name:'yyy'}]);
});

app.listen(app.get('port'), function () {
    console.log('The Server is running at ' + app.get('port'));
});