
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const multer = require('multer');
const port = 7000;

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'research',
    multipleStatements: true
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log('Connected to database.');
    connection.release();
});

// Import route handlers
const researchRouter = require('./routes/research');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use the route handlers
// app.use('/research', researchRouter);


// module.exports = router;
app.get('/', (req, res) => {
  // Fetch research papers from the database
  pool.query('SELECT * FROM Research', (err, results) => {
      if (err) {
          console.error('Error fetching research papers:', err);
          res.status(500).send('Internal Server Error');
      } else {
          // Render the index view with fetched research papers
          res.render('index', { researchPapers: results });
      }
  });
});


app.get('/login', (req, res) => {
    res.render('login');
});

// Define route handler for the research page
app.get('/research', (req, res) => {
  // Get search query from request URL
  const searchQuery = req.query.search || '';

  // Query the database to fetch research data
  const query = `
      SELECT Research.ResearchName, Category.CategoryName, Publisher.PublisherName, Research.ResearchPDF
      FROM Research
      JOIN Category ON Research.CategoryID = Category.CategoryID
      JOIN Publisher ON Research.PublisherID = Publisher.PublisherID
      WHERE Research.ResearchName LIKE '%${searchQuery}%'
  `;

  // Execute the query
  pool.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching research papers:', err);
          res.status(500).send('Internal Server Error');
      } else {
          // Render the research page with fetched research papers
          res.render('research', { researchPapers: results });
      }
  });
});


app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/about', (req, res) => {
    res.render('about');
});

// app.get('/dashboard', (req, res) => {
//     res.render('dashboard');
// });

// Handle dashboard route
// app.get('/dashboard', (req, res) => {
//   // Fetch research list from the database
//   pool.query('SELECT * FROM Research', (err, results) => {
//       if (err) {
//           console.error('Error fetching research:', err);
//           res.status(500).send('Internal Server Error');
//       } else {
//           // Render dashboard page with research list
//           res.render('dashboard', { researchList: results });
//       }
//   });
// });

app.get('/dashboard', (req, res) => {
  // Get search query from request URL
  const searchQuery = req.query.search || '';

  // Query the database to fetch research data
  const query = `
      SELECT Research.ResearchName, Category.CategoryName, Publisher.PublisherName, Research.ResearchPDF
      FROM Research
      JOIN Category ON Research.CategoryID = Category.CategoryID
      JOIN Publisher ON Research.PublisherID = Publisher.PublisherID
      WHERE Research.ResearchName LIKE '%${searchQuery}%'
  `;

  // Execute the query
  pool.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching research papers:', err);
          res.status(500).send('Internal Server Error');
      } else {
          // Render the research page with fetched research papers
          res.render('dashboard', { researchList: results });
      }
  });
});



app.post('/login', (req, res) => {
    // Implement login logic
    const { username, password } = req.body;
    // Check username and password
    // Redirect to dashboard or show an error
    res.redirect('/dashboard');
});



app.post('/register', (req, res) => {
  // Extract data from the registration form
  const { username, password, email } = req.body;

  // SQL query to insert the researcher's information into the database
  const query = `
      INSERT INTO Researcher (ResearcherName, Password, Email)
      VALUES (?, ?, ?)
  `;

  // Execute the query
  pool.query(query, [username, password, email], (err, results) => {
      if (err) {
          console.error('Error registering researcher:', err);
          res.status(500).send('Error registering researcher. Please try again.');
      } else {
          // Redirect the researcher to the login page after successful registration
          res.redirect('/login');
      }
  });
});


// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname); // Use original file name
  }
});

// Init upload
const upload = multer({ storage: storage });

// app.post('/add-research', upload.single('researchPDF'), (req, res) => {
//   // Extract form data and file from req.body and req.file respectively
//   // Perform database insertion logic here
// });

// Add Research
app.post('/add-research', upload.single('researchPDF'), (req, res) => {
  const { researchName, publicationDate, category, publisher } = req.body;
  const researchPDF = req.file ? req.file.path : null; // Get file path if uploaded

  // Insert research data into database
  pool.query('INSERT INTO Research (ResearchName, ResearchPDF, PublicationDate, Category, Publisher) VALUES (?, ?, ?, ?, ?)',
      [researchName, researchPDF, publicationDate, category, publisher],
      (err, result) => {
          if (err) {
              console.error('Error adding research:', err);
              res.status(500).send('Internal Server Error');
          } else {
              res.redirect('/dashboard');
          }
      });
});

// View Research
app.get('/view-research/:id', (req, res) => {
  const researchId = req.params.id;

  // Fetch research data from database
  pool.query('SELECT * FROM Research WHERE ResearchID = ?', researchId, (err, result) => {
      if (err) {
          console.error('Error fetching research:', err);
          res.status(500).send('Internal Server Error');
      } else {
          // Render view-research page with research data
          res.render('view-research', { research: result[0] });
      }
  });
});

// Delete Research
app.get('/delete-research/:id', (req, res) => {
  const researchId = req.params.id;

  // Delete research from database
  pool.query('DELETE FROM Research WHERE ResearchID = ?', researchId, (err, result) => {
      if (err) {
          console.error('Error deleting research:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.redirect('/dashboard');
      }
  });
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = pool; // Export the pool for use in other files
