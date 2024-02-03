// routes/research.js
const express = require('express');
const router = express.Router();
const pool = require('../app'); 

router.get('/', (req, res) => {
    pool.query('SELECT * FROM Research', (err, results) => {
        if (err) {
            console.error('Error fetching research papers:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('index', { researchPapers: results });
        }
    });
});

module.exports = router;
