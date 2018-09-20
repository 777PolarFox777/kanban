var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();

app.use(express.static(__dirname+'/source'));
app.use(express.static('dist'));

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3000',
    user     : 'root',
    password : 'password',
    database : 'kanban_database'
});

app.get('/cardsList', function (req, res) {

    connection.query('SELECT * FROM kanban_database', function(err, rows){
        if (err) throw err;
        console.log(JSON.stringify(req.body));
        rows.map(function (current, index) {

        });
        res.json(JSON.stringify({tasks: "first"}));
    });
});

app.delete('/cardsList', function (req, res) {

    res.send('Got a DELETE request');
});
app.post('/cardsList', function (req, res) {
    res.send('Got a POST requsest');
});
app.get('/', function(req, res) {
    connection.query('USE kanban_database');
    connection.query('CREATE TABLE IF NOT EXISTS tasks');
    connection.query('CREATE TABLE IF NOT EXISTS cards');
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});