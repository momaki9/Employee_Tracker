const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// see folder 11 under mySQL
// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'R0JmN1mf3l',
      database: 'classlist_db'
    },
    // I think here
    console.log(`Connected to the classlist_db database.`)
);

// Query database
db.query('SELECT * FROM students', function (err, results) {
    //or here
    console.log(results);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server is Live at ${PORT}`);
});