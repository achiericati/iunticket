import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import path from 'path';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(join(__dirname, '../build')));
app.get('/', (req, res) => {
  console.log("ENTRA QUI")
  res.sendFile(join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 5000


const connection = mysql.createConnection({
  host: '9z6n6e.stackhero-network.com',
  user: 'root',
  port: 3306,
  password: '6z6P1Dadytt24aFQkxjvgljQW4G4Ydgm',
  database: 'root'
});
connection.connect((err) => {
  if (err) {
    console.error('Errore durante la connessione al database:', err);
  } else {
    console.log('Connessione al database MySQL riuscita!');
  }
});

const allowedOrigins = ['https://iunticket-fdba432ee24a.herokuapp.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/api/match', (req, res) => {
  const sql = `SELECT partita.ID, partita.partita, partita.data, COUNT(ticket.partitaID) AS bigliettiDisponibili, MIN(ticket.prezzo) AS prezzoMin FROM partita LEFT JOIN ticket ON partita.ID = ticket.partitaID GROUP BY partita.ID;`;
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Errore nella query:', error);
      res.status(500).send('Errore nel server.');
    } else {
      console.log('API OK: ', results);
      res.json(results);
    }
  });
});

app.get('/api/tickets', (req, res) => {
  const partitaID = req.query.matchID;
  const sql = 'SELECT * FROM ticket WHERE partitaID = ?';
  connection.query(sql, [partitaID], (error, results, fields) => {
    if (error) {
      console.error('Errore nella query:', error);
      res.status(500).send('Errore nel server.');
    } else {
      res.json(results);
    }
  });
});

  app.get('/api/infoUser', (req, res) => {
    const userName = req.query.userName;
    const sql = 'SELECT * FROM user WHERE username = ?';
    connection.query(sql, [userName], (error, results, fields) => {
    if (error) {
      console.error('Errore nella query:', error);
      res.status(500).send('Errore nel server.');
    } else {
      res.json(results);
    }
  });
  });

  app.get('/api/login', (req, res) => {
    const userName = req.query.userName;
    const pwd = req.query.password;
    const sql = 'SELECT * FROM user WHERE username = ? and password = ?';
    connection.query(sql, [userName, pwd], (error, results, fields) => {
    if (error) {
      console.error('Errore nella query:', error);
      res.status(500).send('Errore nel server.');
    } else {
      if (results.length > 0) res.json(results);
      else res.status(401).send('Username o password sbagliati.');
    }
    });
  });

  app.post('/api/register', (req, res) => {
    const userName = req.body.userName;
    const sql = 'SELECT * FROM user WHERE username = ?';
    connection.query(sql, [userName], (error, results, fields) => {
    if (error) {
      res.status(500).send('Errore nel server.');
    } else {
      if (results.length > 0) {
        res.status(400).send('Username già esistente.');
        return
      } 
      else {
        const pwd = req.body.password;
        const nome = req.body.nome || ''
        const cognome = req.body.cognome || ''
        const instagram = req.body.instagram || ''
        const cellulare = req.body.cellulare || ''
        const email = req.body.email || ''
        const created = req.body.created;

        const sql = 'INSERT INTO user (username, nome, cognome, mail, instagram, cellulare, password, created_date) VALUES (?,?,?,?,?,?,?,?)';
        connection.query(sql, [userName, nome, cognome, email, instagram, cellulare, pwd, created], (error, results) => {
        if (error) {
          console.log(error)
          res.status(500).send('Errore nel server.');
        } else {
          const sql = 'SELECT * FROM user WHERE username = ?';
          connection.query(sql, [userName], (error, results, fields) => {
          if (error) {
            console.error('Errore nella query:', error);
            res.status(500).send('Errore nel server.');
          } else {
            if (results.length > 0) res.json(results);
            else res.status(401).send('Username o password sbagliati.');
          }
          });
        }
        });
      } 
    }
    });
  });

  app.post('/api/editUser', (req, res) => {
    const userName = req.body.userName;
    const pwd = req.body.password;
    const nome = req.body.nome || ''
    const cognome = req.body.cognome || ''
    const instagram = req.body.instagram || ''
    const cellulare = req.body.cellulare || ''
    const email = req.body.email || ''

    const sql = 'UPDATE user set password = ?, nome = ?, cognome = ?, mail = ?, instagram = ?, cellulare = ? WHERE username = ?';
    connection.query(sql, [pwd, nome, cognome, email, instagram, cellulare, userName], (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).send('Errore nel server.');
    } else {
      const sql = 'SELECT * FROM user WHERE username = ?';
      connection.query(sql, [userName], (error, results, fields) => {
      if (error) {
        console.error('Errore nella query:', error);
        res.status(500).send('Errore nel server.');
      } else {
        res.json(results);
      }
      });
    }
    });
  });

  app.post('/api/tickets', (req, res) => {
    const userName = req.body.userName;
    const partitaID = req.body.partitaID;
    const anello = req.body.anello;
    const settore = req.body.settore;
    const fila = req.body.fila;
    const posti = req.body.posti
    const necessariaTdt = req.body.necessariaTdt
    const prezzo = req.body.prezzo || null

    const sql = 'INSERT INTO ticket (partitaID, user, anello, settore, fila, posti, necessariaTdt, prezzo) VALUES (?,?,?,?,?,?,?,?)';
        connection.query(sql, [partitaID, userName, anello, settore, fila, posti, necessariaTdt, prezzo], (error, results) => {
        if (error) {
          console.log(error)
          res.status(500).send('Errore nel server.');
        } else {
          const sql = 'SELECT * FROM ticket WHERE id = LAST_INSERT_ID()';
          connection.query(sql, [], (error, results, fields) => {
          if (error) {
            res.status(500).send('Errore nel server.');
          } else {
            res.json(results);
          }
          });
        }
        });
  });

  app.post('/api/deleteTickets', (req, res) => {
    const ticketID = req.body.ticketID;
    const sql = 'DELETE FROM ticket WHERE id = ?';
        connection.query(sql, [ticketID], (error, results) => {
        if (error) {
          console.log(error)
          res.status(500).send('Errore nel server.');
        } else {
          res.json(results);
        }
        });
  });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
