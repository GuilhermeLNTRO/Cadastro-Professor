const express = require('express');
const mysql = require('mysql2');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'IFB'
});

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySql Connected...');
});

// Homepage
app.get('/', (req, res) => {
  res.send(`
    <h1>Menu</h1>
    <ul>
      <li><a href="/getprofessor">Listar Professor</a></li>
      <li><a href="/deleteprofessor">Apagar Professor</a></li>
      <li><a href="/addprofessor">Adicionar Professor</a></li>
    </ul>
  `);
});

// Insert professor form
app.get('/addprofessor', (req, res) => {
  res.send(`
    <h1>Adicionar Professor</h1>
    <form action="/addprofessor" method="post">
      <label>Siape:</label>
      <input type="number" name="siape" required><br><br>
      <label>Nome:</label>
      <input type="text" name="nome" required><br><br>
      <label>Idade:</label>
      <input type="number" name="idade" required><br><br>
      <label>Matéria:</label>
      <input type="text" name="materia" required><br><br>
      <input type="submit" value="Submit">
    </form>
  `);
});

// Insert professor
app.post('/addprofessor', (req, res) => {
  let query = db.query('INSERT INTO PROFESSOR (SIAPE, NOME, IDADE, MATERIA) VALUES (?, ?, ?, ?)',
    [req.body.siape, req.body.nome, req.body.idade, req.body.materia],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect('/getprofessor');
    });
});

// Delete professor form
app.get('/deleteprofessor', (req, res) => {
  res.send(`
    <h1>Apagar Professor</h1>
    <form action="/deleteprofessor" method="post">
      <label>SIAPE Professor:</label>
      <input type="text" name="siape" required><br><br>
      <input type="submit" value="Submit">
    </form>
  `);
});

// Delete professor
app.post('/deleteprofessor', (req, res) => {
  let query = db.query('DELETE FROM PROFESSOR WHERE SIAPE=?',
    [req.body.siape],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect('/getprofessor');
    });
});

// Select professors
app.get('/getprofessor', (req, res) => {
  let sql = 'SELECT * FROM PROFESSOR';
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(`
      <h1>Lista de Professores</h1>
      <ul>
        <li><a href="/addprofessor">Adicionar Professor</a></li>
        <li><a href="/deleteprofessor">Apagar Professor</a></li>
      </ul>
      <br>
      <table>
        <tr>
          <th>SIAPE</th>
          <th>Nome</th>
          <th>Idade</th>
          <th>Matéria</th>
        </tr>
        ${results.map(professor => `<tr><td>${professor.SIAPE}</td><td>${professor.NOME}</td><td>${professor.IDADE}</td><td>${professor.MATERIA}</td></tr>`).join('')}
      </table>
    `);
  });
});

app.listen('3000', () => {
  console.log('Server started on port 3000');
});
