const path = require('path')
const dbPath = path.resolve(__dirname, 'demodb01')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbPath);

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS users (id integer primary key autoincrement, nickname char(45), email char(100), password char(16))");
});

var express = require('express');
var REST = express();

//Select
// usage: curl -X GET 'http://localhost:3030/users'
// usage: curl -X GET 'http://localhost:3030/users/:<id>' (where id = your id)
REST.get(['/users', '/users/:id'], (req, res)=>{
    let sql = `SELECT * FROM users`;
    if (req.params.id){
        sql += ` where id = ${req.params.id.slice(1)}`
    }
    db.all(sql, (err, row)=>{
        if (err) throw err;
        res.json(row);
    });
});

//Insert
// usage: curl -X POST 'http://localhost:3030/users?name=<name>&email=<mail>&password=<psw>'
REST.post(['/users', '/users/:id'], (req, res)=>{
    console.log(req.query);
    if (!req.query.nickname || !req.query.email || !req.query.password){
        res.status(500);
        res.end();
    } else {
        db.run(`INSERT INTO users (nickname, email, password) values (?, ?, ?)`, req.query.nickname, req.query.email, req.query.password,(err, row)=>{
            if (err) res.status(500);
            else res.status(202);
            res.end();
        });
    }    
});

//Update
// usage: curl -X PUT 'http://localhost:3030/users/:<id>?newpassword=<psw>'
REST.put(['/users', '/users/:id'], (req, res)=>{
    db.run("UPDATE users SET nickname = ?", req.query.nickname, (err, row)=>{
        if (err) res.status(500);
        else res.status(202);
        res.end();
});
});

//Delete
// usage: curl -X DELETE 'http://localhost:3030/users/:<id>'
REST.delete('/users/:id', (req, res)=>{
    db.run("DELETE FROM users WHERE id= ? ", req.params.id.slice(1), (err, row)=>{
        if (err) res.status(500);
        else res.status(202);
        res.end();
    });
});

REST.listen(3030);

console.log("Submit GET or POST to http://localhost:3030");