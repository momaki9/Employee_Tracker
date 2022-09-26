// Requiring the inquirer, mySQL2 and console.table packages for the app
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

// Creates a connection to the mySQL database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'R0JmN1mf3l',
      database: 'employee_db'
    },
    console.log(`Welcome! You are Now Connected to the employee_db DataBase!`)
   
);
// Once the application starts, run the prompt questions enclosed in the runQuest function
db.connect(function(err) {
    if (err) throw err;
    else {
        runQuest();
    }
});

// function to add new employee inputted from the user into the database
const addEmp = () => {
    console.clear();
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
       if (answer.empmanager === "None") {
        db.query(`SELECT id FROM roles WHERE title = "${answer.emprole}"`, function(err, roleId) {
            if (err) throw err;
            const rolArray = roleId.map(function (obj) {
                return obj.id;
            })
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.empfirstname}", "${answer.emplastname}", ${rolArray}, null)`, function(err, results) {
                if (err) throw err;
                runQuest();
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
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.empfirstname}", "${answer.emplastname}", ${rolArray}, ${manId} )`, function(err, results) {
            if (err) throw err;
            console.log("Employee Added Successfully!");  
            runQuest(); 
        })
    })
})}
});})};

// function to update employee role in the database
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
                return employeeArray;
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
                return filteredArray;
            }
    }])
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
            runQuest();
        })
    })})})
})}

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
                    return deptArray;
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
            runQuest();
        })
    })
})
})}

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
};
// Main function to run the start up prompt questions
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
                console.log("\n")
                runQuest();
            })
        }
        if (answer.directory === "View all employees") {
            db.query('SELECT employee.id, employee.first_name AS first, employee.last_name AS last, roles.title, department.department_name AS department, roles.salary, CONCAT(e.first_name, " ", e.last_name) AS manager FROM employee INNER JOIN roles on employee.role_id = roles.id INNER JOIN department on roles.department_id = department.id LEFT JOIN employee e on e.id = employee.manager_id', function(err, results) {
                console.log("\n")
                console.table(results)
                console.log("\n")
                runQuest();
            })
        }
        if (answer.directory === "View all roles") {
            db.query('SELECT roles.id, roles.title, department.department_name AS department, roles.salary FROM roles JOIN department on roles.department_id = department.id', function(err, results) {
                console.log("\n")
                console.table(results)
                console.log("\n")
                runQuest();
            }) 
        }
    })
}
