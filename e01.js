const path = require('path')
const dbPath = path.resolve(__dirname, 'demodb01')

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbPath);

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS counts (key TEXT, value INTEGER)");
    db.run("INSERT INTO counts (key, value) VALUES (?, ?)", "counter", 0);
});



var express = require('express');
var REST = express();

REST.get('/data', (req, res)=>{
    db.get("SELECT value FROM counts", (err, row)=>{
        res.json({ "count" : row.value });
    });
});

REST.post('/data', (req, res)=>{
    db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", (err, row)=>{
        if (err){
            console.err(err);
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
});


REST.listen(3000);

console.log("Submit GET or POST to http://localhost:3000/data");