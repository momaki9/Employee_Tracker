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

// see folder 11 
// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'R0JmN1mf3l',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
   
);

db.connect(function(err) {
    if (err) throw err;
    else {
        runQuest();
    }
})

// ["QC Chemist", "Item Programmer", "Software Engineer", "Content Writer"]
// function to add new employee inputted from the user into the database
// SELECT roles.title, CONCAT(first_name, ' ', last_name) AS full_name FROM employee JOIN roles ON roles.id = employee.id;
// previous code: SELECT title FROM roles
const addEmp = () => {
    db.query('SELECT roles.title, CONCAT(employee.first_name, " ", employee.last_name) AS full_name FROM employee JOIN roles ON roles.id = employee.role_id', function(err, results) {
        if (err) throw err;
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
            choices:  function () {
                const rolesArray = results.map(function (obj) {
                return obj.title;
                })
                const filteredArray = rolesArray.filter((cat, i) => rolesArray.indexOf(cat) === i)
                return filteredArray
            }
        },
        {
            type: "list",
            name: "empmanager",
            message: "Who is the employee's manager?",
            choices: function () {
                const managerArray = results.map(function (obj) {
                    return obj.full_name;
                    
                })
                const noManager = "None";
                managerArray.push(noManager)
                return managerArray
            }
        }
    ])
    .then(answer => {
        console.log(answer.empfirstname) // retunrs first name string -- should work
        console.log(answer.emplastname) // retunrs last name string -- should work
        console.log(answer.emprole) // returns role name string -- works fine
        console.log(answer.empmanager) // returns full name string
       if (answer.empmanager === "None") {
        db.query(`SELECT id FROM roles WHERE title = "${answer.emprole}"`, function(err, roleId) {
            if (err) throw err;
            const rolArray = roleId.map(function (obj) {
                return obj.id;
            })
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.empfirstname}", "${answer.emplastname}", ${rolArray}, null)`, function(err, results) {
                if (err) throw err;
                runQuest();
            console.log("THE BOSS HAS BEEN Added Successfully!")
            })
            
            
        })
        
       } else {
        db.query(`SELECT id FROM roles WHERE title = "${answer.emprole}"`, function(err, roleId) {
            if (err) throw err;
            const rolArray = roleId.map(function (obj) {
                return obj.id;
            })
       
        db.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answer.empmanager}"`, function (err, managerId) {
            if (err) throw err;
            const manId = managerId.map(function (obj) {
                return obj.id;          
        })    
            
            console.log(`this is the role id: ${rolArray}`)
        
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.empfirstname}", "${answer.emplastname}", ${rolArray}, ${manId} )`, function(err, results) {
            if (err) throw err;
            console.log("Employee Added Successfully!")   
        })
    })
})
        runQuest();
       }
    });

    
    } )};

//need function to update employee role
// example sql command: UPDATE table1 SET field1=new_value1 WHERE condition;
// OR: UPDATE table1, table2 SET field1=new_value1, field2=new_value2, ... WHERE table1.id1 = table2.id2 AND condition;
// ["Chris Grayce", "Casey Prolux", "Jurgin Galicia", "Mostafa Maki", "Christopher Lee", "John Chester"]
// ["QC Chemist", "Item Programmer", "Software Engineer", "Content Writer"]
//SELECT title FROM roles; SELECT CONCAT(first_name, " ", last_name) AS full_name FROM employee
const updateEmpRole = () => {
    db.query('SELECT roles.title, CONCAT(first_name, " ", last_name) AS full_name FROM employee JOIN roles on employee.role_id = roles.id', function(err, results) {
        if (err) throw err;
    
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Which employee's role do you want to update?",
            choices: function () {
                const employeeArray = results.map(function (obj) {
                    //might need a filter method to remove duplicates
                    return obj.full_name;
                })
                return employeeArray
            }
        },
        {
            type: "list",
            name: "role",
            message: "Which role do you want to assign the selected employee?",
            choices: function () {
                const roleArray = results.map(function (obj) {
                    //might need a filter method to remove duplicates
                    return obj.title;
                })
                const filteredArray = roleArray.filter((cat, i) => roleArray.indexOf(cat) === i)
                return filteredArray
            }
        }
    ])
    //SELECT roles.title, roles.id AS roles_id, CONCAT(first_name, " ", last_name) AS full_name, employee.id AS employee_id FROM employee JOIN roles on employee.role_id = roles.id
    .then(answer => {
        db.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answer.employee}"`, function(err, data) {
            if (err) throw err;
            const employeeId = data.map(function (obj) {
                return obj.id
            })
        db.query(`SELECT id FROM roles WHERE title = "${answer.role}"`, function(err, data) {

            const updatedRole = data.map(function (obj) {
                return obj.id
            })
        
        db.query(`UPDATE employee SET role_id = ${employeeId} WHERE id = ${updatedRole}`, function(err, results) {
            if (err) throw err;
            console.log("Employee's Role Has Been Successfully Updated!")
            console.log(results)
            
        })
    })
        runQuest();
    })    
    })
})      
}
//["Content", "ChemQC", "PRG", "SofEng"]
// function to add new role inputted from the user into the database
const addNewRole = () => {
    db.query('SELECT department_name FROM department', function(err, results) {
        if (err) throw err;
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
            choices: function () {
                const deptArray = results.map(function (obj) {
                    return obj.department_name;
                    })
                    return deptArray
            }
        }
    ])
    .then(answer => {
        db.query(`SELECT id FROM department WHERE department_name = "${answer.roledeptmnt}"`, function (err, deptId) {
            if (err) throw err;
            const deptRole = deptId.map(function (obj) {
                return obj.id
            })
        
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${answer.rolename}", "${answer.salary}", ${deptRole})`, function(err, results) {
            if (err) throw err;
            console.log("Role Added Successfully!")
            console.log(results)
            
        })
        runQuest();
    })
})
})
}

//function to add new department inputted from the user into the database
const addDeptmnt = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "dptmnt",
            message: "What is the name of the department?"
        }
    ])
    .then(answer => {
        db.query(`INSERT INTO department (department_name) VALUES ("${answer.dptmnt}")`, function(err, results) {
            if (err) throw err;
            console.log("Department Added Successfully!")           
        })
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
            db.query('SELECT id, department_name AS department FROM department', function(err, results) {
                console.log("\n")
                console.table(results)
                console.log("ALL DEPT")
            })
            runQuest();
            
        }
        if (answer.directory === "View all employees") {
            db.query('SELECT employee.id, employee.first_name AS first, employee.last_name AS last, roles.title, department.department_name AS department, roles.salary, CONCAT(e.first_name, " ", e.last_name) AS manager FROM employee INNER JOIN roles on employee.role_id = roles.id INNER JOIN department on roles.department_id = department.id LEFT JOIN employee e on e.id = employee.manager_id', function(err, results) {
                console.log("\n")
                console.table(results)
                console.log("ALL EMP")
            })
            runQuest();
        }
        if (answer.directory === "View all roles") {
            db.query('SELECT roles.id, roles.title, department.department_name AS department, roles.salary FROM roles JOIN department on roles.department_id = department.id', function(err, results) {
                console.log("\n")
                console.table(results)
                console.log("ALL ROLES")
            })
            runQuest();
        }
        
    })
}

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server is Live at ${PORT}`);
});