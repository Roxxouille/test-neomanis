const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3000;


const connection = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: "",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

app.get("/", (req, res) => {
  return res.send("Hello World !");
});

app.get("/movies", (req, res) => {
  connection.query(`SELECT * FROM movie`, (err, rows) => {
    if (err) throw err;
    return res.json(rows);
  });
});

app.get("/movies/top", (req, res) => {
  connection.query(
    "SELECT * FROM movie ORDER BY nbre_de_prets DESC LIMIT 100",
    (err, rows) => {
      if (err) throw err;
      return res.json(rows);
    }
  );
});

app.get("/movies/top/:year", (req, res) => {
  const year = req.params.year;

  connection.query(
    `SELECT * FROM movie WHERE annee = '${year}' ORDER BY nbre_de_prets DESC LIMIT 100`,
    (err, rows) => {
      if (err) throw err;
      if (rows.length === 0) {
        return res.status(404).json({ message: "Year not found" });
      }
      return res.json(rows);
    }
  );
});

app.get("/movie/top", (req, res) => {
  connection.query(
    "SELECT * FROM movie ORDER BY nbre_de_prets DESC LIMIT 1",
    (err, rows) => {
      if (err) throw err;
      return res.json(rows[0]);
    }
  );
});

app.get("/movie/top/:year", (req, res) => {
  const year = req.params.year;

  connection.query(
    `SELECT * FROM movie WHERE annee = '${year}' ORDER BY nbre_de_prets DESC LIMIT 1`,
    (err, rows) => {
      if (err) throw err;
      if (rows.length === 0) {
        return res.status(404).json({ message: "Year not found" });
      }
      return res.json(rows[0]);
    }
  );
});

app.get("/author/top", (req, res) => {
  connection.query(
    `SELECT (auteur) FROM movie ORDER BY nbre_de_prets DESC LIMIT 1`,
    (err, rows) => {
      if (err) throw err;
      return res.json(rows[0]);
    }
  );
});

app.get("/movie/search/:partial", (req, res) => {
  const partial = req.params.partial;
  connection.query(
    `SELECT * FROM movie WHERE titre LIKE CONCAT('%', '${partial}', '%')`,
    (err, rows) => {
      if (err) throw err;
      if (rows.length === 0) {
        return res.status(404).json({ message: "Movie not found" });
      }
      return res.json(rows);
    }
  );
});

app.listen(port, () => {
  console.log(`App started at http://localhost:${port}`);
});
