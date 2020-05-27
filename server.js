const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Dixiedog1",
  database: "employeeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id" + connection.threadId)
  mainMenu();
});

function mainMenu(){
    inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all Employees",
            "View all Employees by Department",
            "View all Employees by Role",
            "Add Department",
            "Add Role",
            "Add Employee",
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
        console.log(" You entered:" + answer.action);
        switch(answer.action){
            case "View all Employees":
                viewEmployees();
                break;
            case "View all Employees by Department":
                viewDepart();
                break;
            case "View all Employees by Role":
                viewRole();
                break;
            case "Add Department":
                addDept();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
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
                deleteDepart();
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
                default:
                    quit();
        }
    });

}

// View departments, roles, and employees:
function viewDepart() {
    // select from the db
    let query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
    // show the result to the user (console.table)
  }
  
  function viewRole() {
    // select from the db
    let query = "SELECT * FROM role";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
    // show the result to the user (console.table)
  }
  
  function viewEmployees() {
    // select from the db
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
    // show the result to the user (console.table)
  }

// Add departments, roles, and employees:
function addEmployee() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What's the first name of the employee?",
          name: "eeFirstName"
        },
        {
          type: "input",
          message: "What's the last name of the employee?",
          name: "eeLastName"
        },
        {
          type: "input",
          message: "What is the employee's role id number?",
          name: "roleID"
        },
        {
          type: "input",
          message: "What is the manager id number?",
          name: "managerID"
        }
      ])
      .then(function(answer) {
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.eeFirstName, answer.eeLastName, answer.roleID, answer.managerID], function(err, res) {
          if (err) throw err;
          console.log(res);
          mainMenu();
        });
      });
  }


// // Update employee roles:
// function updateEmployeeRole(){

// }
// // BONUS....
// // Update  Employee managers:
// function updateEMployeeManager(){

// }
// // View employees by manager:
// function viewManager(){

// }
// // Delete departments, roles, and employees:
// function deleteDepart(){

// }

// function deleteRole(){

// }
// function deleteEmployee(){

// }
// // View the total utilized budget of a department( combined salaries of all employees in the department)
// function departmentBudget(){

// }

function quit() {
    connection.end();
    process.exit();
  }