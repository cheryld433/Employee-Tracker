const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Dixiedog1",
  database: ""
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch(){
    inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Add Employee:",
            "Add Department:",
            "Add Role:",
            "View Department:",
            "View Roles:",
            "View Employee:",
            "Update Employee Role:",
            "Update Employee Manager:",
            "View Employee by Manager:",
            "Delete Employee:",
            "Delete Department:",
            "Delete Role:",
            "View Department Budget:",
            "Exit"
        ]
    })
    .then(function(answer){
        
    })

}

// Switch statement:

//Add departments, roles, and employees:

// View departments, roles, and employees:

// Update employee roles:

// BONUS....
// Update  Employee managers:
// View employees by manager:
// Delete departments, roles, and employees:
// View the total utilized budget of a department( combined salaries of all employees in the department)

