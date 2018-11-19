const path = require('path')
const dbPath = path.resolve(__dirname, 'demodb02')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbPath);

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS links (id integer primary key autoincrement, tags text, url text, userId integer)");
});

var express = require('express');
var REST = express();

//Select
// usage: curl -X GET 'http://localhost:3131/links'
// usage: curl -X GET 'http://localhost:3131/links/:<id>' (where id = your id)
REST.get(['/links', '/links/:id'], (req, res)=>{
    let sql = `SELECT * FROM links`;
    if (req.params.id){
        sql += ` where id = ${req.params.id.slice(1)}`
    }
    db.all(sql, (err, row)=>{
        if (err) throw err;
        res.json(row);
    });
});

//Insert
// usage: curl -X POST 'http://localhost:3131/links?name=<name>&url=<mail>&user=<psw>'
REST.post(['/links', '/links/:id'], (req, res)=>{
    console.log(req.query);
    if (!req.query.tags || !req.query.url || !req.query.user){
        res.status(500);
        res.end();
    } else {
        db.run(`INSERT INTO links (tags, url, userId) values (?, ?, ?)`, req.query.tags, req.query.url, req.query.user,(err, row)=>{
            if (err) res.status(500);
            else res.status(202);
            res.end();
        });
    }    
});

//Update
// usage: curl -X PUT 'http://localhost:3131/links/:<id>?newuser=<psw>'
REST.put(['/links', '/links/:id'], (req, res)=>{
    db.run("UPDATE links SET tags = ?", req.query.tags, (err, row)=>{
        if (err) res.status(500);
        else res.status(202);
        res.end();
});
});

//Delete
// usage: curl -X DELETE 'http://localhost:3131/links/:<id>'
REST.delete('/links/:id', (req, res)=>{
    db.run("DELETE FROM links WHERE id= ? ", req.params.id.slice(1), (err, row)=>{
        if (err) res.status(500);
        else res.status(202);
        res.end();
    });
});

REST.listen(3030);

console.log("Submit GET or POST to http://localhost:3131");


