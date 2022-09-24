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

//need function to add employee
const addEmp = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "empfirstname",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "emplastname",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "emprole",
            message: "What is the employee's role",
            choices: ["QC Chemist", "Item Programmer", "Software Engineer", "Content Writer"]
        },
        {
            type: "input",
            name: "empmanager",
            message: "Who is the employee's manager?"
        }
    ])
    .then(answer => {
        console.log(answer)
        runQuest();
    })
}
//need function to update employee role
const updateEmpRole = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Which employee's role do you want to update?",
            choices: ["Chris Grayce", "Casey Prolux", "Jurgin Galicia", "Mostafa Maki", "Christopher Lee", "John Chester"]
        },
        {
            type: "list",
            name: "role",
            message: "Which role do you want to assign the selected employee?",
            choices: ["QC Chemist", "Item Programmer", "Software Engineer", "Content Writer"]
        }
    ])
    .then(answer => {
        console.log(answer)
        runQuest();
    })
}
//need function to add role
const addNewRole = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "rolename",
            message: "What is the name of the role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "roledeptmnt",
            message: "Which department does the role belong to",
            choices: ["Content", "ChemQC", "PRG", "SofEng"]
        }
    ])
    .then(answer => {
        console.log(answer)
        runQuest();
    })
}
//need function to add department
const addDeptmnt = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "dptmnt",
            message: "What is the name of the department?"
        }
    ])
    .then(answer => {
        console.log(answer)
        runQuest();
    })
}

const runQuest = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "directory",
            message: "what would you like to do?",
            choices: ["View all employees", "Add Employee", "Update Employee Role", "View all roles", "Add Role", "View all departments", "Add Department", "Exit"]
        }
    ])
    .then(answer => {
        console.log(`The user selected ${answer.directory}`)
        
        if (answer.directory === "Exit") {
            console.log("He wants to exit")
            return;
        }
        if (answer.directory === "Add Employee") {
            addEmp();
        }
        if (answer.directory === "Add Role") {
            addNewRole();
        }
        if (answer.directory === "Update Employee Role") {
            updateEmpRole();
        }
        if (answer.directory === "Add Department") {
            addDeptmnt();
        }
        if (answer.directory === "View all departments") {
            db.query('SELECT * FROM roles JOIN department ON roles.id = department.id', function(err, results) {
                console.table(results)
                console.log("ALL DEPT")
            })
            runQuest();
        }
        if (answer.directory === "View all employees") {
            db.query('SELECT * FROM employee JOIN roles ON employee.roles_id = roles.id', function(err, results) {
                console.table(results)
                console.log("ALL EMP")
            })
            runQuest();
        }
        if (answer.directory === "View all roles") {
            db.query('SELECT * FROM roles', function(err, results) {
                console.table(results)
                console.log("ALL ROLES")
            })
            runQuest();
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