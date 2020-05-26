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
            "Add Employee",
            "Add Department",
            "Add Role",
            "View Department",
            "View Role",
            "View Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View Employee by Manager",
            "Delete Employee",
            "Delete Department",
            "Delete Role",
            "View Department Budget",
            "Exit"
        ]
    })
    .then(function(answer){
        console.log(answer.action);
        switch(answer.action){
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepart();
                break;
            case "Add Role":
                addRole();
                break;
            case "View Department":
                viewDept();
                break;
            case "View Role":
                viewRole();
                break;
            case "View Employee":
                viewEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEMployeeManager();
                break;
            case "View Employee by Manager":
                viewManager();
                break;
            case "Delete Department":
                deleteManager();
                break;
            case "Delete Role":
                deleteRole();
                break;
            case "Delete Employee":
                deleteEmployee();
                break;
            case "View Department Budget":
                departmentBudget();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })

}



// Add departments, roles, and employees:

// View departments, roles, and employees:

// Update employee roles:

// BONUS....
// Update  Employee managers:
// View employees by manager:
// Delete departments, roles, and employees:
// View the total utilized budget of a department( combined salaries of all employees in the department)

