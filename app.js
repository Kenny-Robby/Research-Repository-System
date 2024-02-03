// const express = require('express');
// const bodyParser = require('body-parser');
// // const pool = require('./app'); 
// const app = express();
// const port = 7000;
// const mysql = require('mysql');

// // Import route handlers
// const researchRouter = require('./routes/research');


// app.set('view engine', 'pug');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// // Use the route handlers
// app.use('/research', researchRouter);



// // app.get('/', (req, res) => {
// //   res.render('index', { researchPapers });
// // });

// // app.get('/', (req, res) => {
// //   pool.query('SELECT * FROM Research', (err, results) => {
// //       if (err) {
// //           console.error('Error fetching research papers:', err);
// //           res.status(500).send('Internal Server Error');
// //       } else {
// //           res.render('index', { researchPapers: results });
// //       }
// //   });
// // });

// app.get('/login', (req, res) => {
//   res.render('login');
// });
 
// app.get('/register', (req, res) => {
//   res.render('register');
// });

// app.get('/dashboard', (req, res) => {
//   res.render('dashboard');
// });

// app.post('/login', (req, res) => {
//   // Implement login logic
//   const { username, password } = req.body;
//   // Check username and password
//   // Redirect to dashboard or show an error
//   res.redirect('/dashboard');
// });

// app.post('/register', (req, res) => {
//   // Implement registration logic
//   const { username, password, email } = req.body;
//   // Create user account
//   // Redirect to login or show an error
//   res.redirect('/login');
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });



// // Create a connection pool
// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'research',
//     multipleStatements: true
// });

// // Test the connection
// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Database connection failed: ', err.stack);
//         return;
//     }
//     console.log('Connected to database.');
//     connection.release();
// });

// module.exports = pool;


const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
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
// app.get('/', (req, res) => {
//   // Redirect to the research page or any other desired route
//   res.redirect('/research');
// });
// app.get('/research', (req, res) => {
//     res.render('research');
// });
// app.get('/research', (req, res) => {
//   // Fetch research papers from the database
//   pool.query('SELECT * FROM Research', (err, results) => {
//       if (err) {
//           console.error('Error fetching research papers:', err);
//           res.status(500).send('Internal Server Error');
//       } else {
//           // Render the index view with fetched research papers
//           res.render('research', { researchPapers: results });
//       }
//   });
// });
// Import necessary modules and configurations

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

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.post('/login', (req, res) => {
    // Implement login logic
    const { username, password } = req.body;
    // Check username and password
    // Redirect to dashboard or show an error
    res.redirect('/dashboard');
});

// app.post('/register', (req, res) => {
//     // Implement registration logic
//     const { username, password, email } = req.body;
//     // Create user account
//     // Redirect to login or show an error
//     res.redirect('/login');
// });

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = pool; // Export the pool for use in other files
