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
  database: "employeeDB"
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
        }
    })

}



// Add departments, roles, and employees:
 function addEmployee(){
     inquirer
     .prompt([
         {
             name: "employeeId",
             type: "input",
             message: "Enter Employee id number:"
         },
         {
             name: "firstName",
             type: " input",
             message: "Enter employee first name:"
         },
         {
             name: "lastName",
             type: 'input',
             message: "Enter employee last name:"
         },
         {
             name: "role_id",
             type: "input",
             message: "Enter employee role id number:"
         },
         {
             name: "manager_id",
             type: "input",
             message: "Enter Employee manager id number:"
         }
     ])
     .then (function(answer){
         connection.query("INSERT INTO employee (id, first_name, last_name, role_id, manager_id VALUES (?, ?, ?, ?, ?)",
         [answer.role_id, answer.firstName, answer.lastName, answer.role_id, answer.manager_id], function (err, res){
             if(err) throw err;
             console.log(res);
             runSearch();
         });
         
     });

 }

 function addDepart(){

 }

 function addRole(){

 }

// View departments, roles, and employees:
function viewDept(){

}
function viewRole(){

}

function viewEmployee(){

}

// Update employee roles:
function updateEmployeeRole(){

}
// BONUS....
// Update  Employee managers:
function updateEMployeeManager(){

}
// View employees by manager:
function viewManager(){

}
// Delete departments, roles, and employees:
function deleteDepart(){

}

function deleteRole(){

}
function deleteEmployee(){

}
// View the total utilized budget of a department( combined salaries of all employees in the department)
function departmentBudget(){

}

