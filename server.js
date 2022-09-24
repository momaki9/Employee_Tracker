const express = require('express');
const inquirer = require('inquirer');

// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');
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
      database: 'registrar_db'
    },
    // I think here
    console.log(`Connected to the registrar_db database.`)
   
);

db.connect(function(err) {
    if (err) throw err;
    else {
        runQuest();
    }
})


const runQuest = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "directory",
            message: "what would you like to do?",
            choices: ["View all employees", "View all departments", "View all roles", "Exit"]
        }
    ])
    .then(answer => {
        console.log(`The user selected ${answer.directory}`)
        
        if (answer.directory === "Exit") {
            console.log("He wants to exit")
            return;
        }
        if (answer.directory === "View all departments") {
            db.query('SELECT * FROM roles JOIN department ON roles.id = department.id', function(err, results) {
                console.table(results)
                console.log("ALL DEPT")
            })
        }
        if (answer.directory === "View all employees") {
            db.query('SELECT * FROM employee JOIN roles ON employee.roles_id = roles.id', function(err, results) {
                console.table(results)
                console.log("ALL EMP")
            })
        }
        if (answer.directory === "View all roles") {
            db.query('SELECT * FROM roles', function(err, results) {
                console.table(results)
                console.log("ALL ROLES")
            })
        }
        
    })
}

// Query database
// db.query('SELECT * FROM students', function (err, results) {
//     //or here
//     console.log(results);
    
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server is Live at ${PORT}`);
});