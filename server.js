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
    let query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }
  
  function viewRole() {
    let query = "SELECT * FROM role";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }
  // Add ASC for ascending order
  function viewEmployees() {
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }

// Add departments, roles, and employees:
function addEmployee() {
    connection.query('SELECT * FROM role', function(err, result) {
        if (err) throw (err);
    inquirer
        .prompt([
          { 
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
          }, 
          {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "roleName",
            type: "list",
            message: "What role does the employee have?",
            choices: function() {
             rolesArray = [];
                result.forEach(result => {
                    rolesArray.push(
                        result.title
                    );
                })
                return rolesArray;
              }
          }
        ])
        .then(function(answer) {
        const role = answer.roleName;
        connection.query('SELECT * FROM role', function(err, res) {
            if (err) throw (err);
            let filteredRole = res.filter(function(res) {
                return res.title == role;
            })
        let roleId = filteredRole[0].id;
        connection.query("SELECT * FROM employee", function(err, res) {
                inquirer
                .prompt ([
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is your manager?",
                        choices: function() {
                            managersArray = []
                            res.forEach(res => {
                                managersArray.push(
                                    res.last_name)
                            })
                            return managersArray;
                        }
                    }
                ])
                .then(function(managerAnswer) {
                    const manager = managerAnswer.manager;
                connection.query('SELECT * FROM employee', function(err, res) {
                if (err) throw (err);
                let filteredManager = res.filter(function(res) {
                return res.last_name == manager;
                })
                    let managerId = filteredManager[0].id;
                    let query = "INSERT INTO employee (first_name, last_name, role.id, manager.id) VALUES (?, ?, ?, ?)";
                    let values = [answer.firstName, answer.lastName, roleId, managerId]
                    console.table(values);
                     connection.query(query, values,
                         function(err, res, fields) {
                        })
                        mainMenu();
                        })
                     })
                })
            })
        })
    })
}
function addDept(){

}

function addRole(){

}


// // Update employee roles:
function updateEmployeeRole(){

}



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