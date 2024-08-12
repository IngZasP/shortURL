const express = require('express');
const mysql = require('mysql2');
const shortid = require('shortid');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 
 
const dominioWEb = 'http://localhost:3000/';

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ZasP On: ${PORT}`));

const db = mysql.createConnection({
 
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shortUrl'
  });
  
  db.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('BD Conectada by ZasP');
  });
  
  app.get('/', (req, res) => {
    res.send('Acortador by ZasP | David Diaz Garcia');
  });
  
  app.post('/shorten', (req, res) => {
    
    const { originalUrl } = req.body;
    console.log("Link original By ZasP --> "+originalUrl);

    const shortUrl = shortid.generate();
  
    const query = `INSERT INTO urls (originalurl, shorturl) VALUES (?, ?)`;
    db.query(query, [originalUrl, shortUrl], (err, result) => {
      if (err) throw err;
      const response = dominioWEb+shortUrl;
      res.json({ response });
    });
  });
  
  app.get('/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;
    const query = `SELECT originalurl FROM urls WHERE shorturl = ?`;
  
    db.query(query, [shortUrl], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.redirect(results[0].originalurl);
      } else {
        res.status(404).send('ZasP Dice: Estas perdido?');
      }
    });
  });
  
  