 const express = require("express");
const sqlite = require("sqlite3");
const bodyParser = require("body-parser");
const db = new sqlite.Database("myPocket");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.serialize(function() {
  db.run(
    "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname Text, email Text, password text)"
  );
  db.run("CREATE TABLE IF NOT EXISTS links (id INTEGER PRIMARY KEY AUTOINCREMENT, tags Text, url Text, userId INTEGER)")
});

app.get("/user", function(req, res) {
  db.all("SELECT * from user", (err, row) => {
    res.json(row);
  });
});

app.get("/user/:id", function(req, res) {
  const idSelected = req.params.id;

  db.get(`SELECT * from user where id = ${idSelected}`, (err, row) => {
    res.json({
      id: idSelected,
      nickname: row.nickname,
      email: row.email,
      password: row.password
    });
  });
});

app.delete("/user/:id", function(req, res) {
  const idSelected = req.params.id;
  console.log(idSelected);
  db.get(`DELETE  from user where id = ${idSelected}`, (err, row) => {
    if (err) throw err;
    res.send(`User has been successfully deleted :{"id" : ${idSelected}`);
  });
});

app.post("/user", function(req, res) {
  const data = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password
  };

  console.log(data);
  db.run(
    `INSERT INTO user (nickname,email,password) 
  VALUES('${data.nickname}',
         '${data.email}',
         '${data.password}')`,
    err => {
      if (err) throw err;
    }
  );
  res.end();
});

app.put("/user", function(req, res) {
  const data = {
    id: req.body.id,
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password
  };

  db.run(
    `UPDATE user set 
            nickname = '${data.nickname}', 
            email = '${data.email}',
            password = '${data.password}' 
            WHERE id = '${data.id}'`,
    err => {
      if (err) throw err;
    }
  );
  res.end();
});

//step 03
app.get("/links", function(req, res) {
  db.all("SELECT * from links", (err, row) => {
    res.json(row);
  });
});

app.get("/links/:id", function(req, res) {
  const idSelected = req.params.id;

  db.all(`SELECT * from links where id = ${idSelected}`, (err, row) => {
    res.json({
      id: idSelected,
      tags: row.tags,
      url: row.url,
      userId: row.userId
    });
  });
});

app.delete("/links/:id", function(req, res) {
  const idSelected = req.params.id;
  console.log(idSelected);
  db.run(`DELETE  from links where id = ${idSelected}`, (err, row) => {
    if (err) throw err;
    res.send(`Link has been successfully deleted :{"id" : ${idSelected}`);
  });
});

app.post("/links", function(req, res) {
  const data = {
    tags: req.body.tags,
    url: req.body.url,
    userId: req.body.userId
  };

  console.log(data);
  db.run(
    `INSERT INTO links (tags, url, userId) 
  VALUES('${data.tags}',
         '${data.url}',
         '${data.userId}')`,
    err => {
      if (err) throw err;
    }
  );
  res.end();
});

app.put("/links", function(req, res) {
  const data = {
    id: req.body.id,
    tags: req.body.tags,
    url: req.body.url,
    userId: req.body.userId
  };

  db.run(
    `UPDATE links set 
            tags = '${data.tags}', 
            url = '${data.url}',
            userId = '${data.userId}' 
            WHERE id = '${data.id}'`,
    err => {
      if (err) throw err;
    }
  );
  res.end();
});

app.get("/users/:userId/links", function(req, res) {
  const idSelected = req.params.userId;

  db.get(`SELECT * from links where userId = ${idSelected}`, (err, row) => {
    if (err) throw err;
    res.json({
      id: row.id,
      tags: row.tags,
      url: row.url,
      userId: row.userId
    });
  });
});

app.get("/users/:userId/links/:id", function(req, res) {
  const idSelected = req.params.id;
  const userIdSelected = req.params.userId;

  db.get(`SELECT * from links where id = ${idSelected} AND userId = ${userIdSelected}`, (err, row) => {
    if (err) throw err;
    res.json({
      id: idSelected,
      tags: row.tags,
      url: row.url,
      userId: row.userId
    });
  });
});

app.post("/login",(req, res) => {
  const data = {
    nickname: req.body.nickname,
    password: req.body.password,
  };

  db.get(`SELECT * FROM user WHERE nickname='${data.nickname}' AND password='${data.password}'`, (err, row) => {
    if(err)
      throw err;

    res.json(row);
  });
});

app.post("/register", (req,res) => {
  const data = {
    nickname: req.body.nickname,
    password: req.body.password,
  };

  db.run(`INSERT INTO user(nickname,password) VALUES('${data.nickname}','${data.password}')`, err => {
    if(err)
      throw err;
    
    res.end(`User ${data.nickname} successfully registered !`);
  });
});

app.listen(4242);