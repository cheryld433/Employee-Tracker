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
            "View all Departments",
            "View all Roles",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Exit"
        ]
    })
    .then(function(answer){
        console.log(" You entered:" + answer.action);
        switch(answer.action){
            case "View all Employees":
                viewEmployees();
                break;
            case "View all Departments":
                viewDepart();
                break;
            case "View all Roles":
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
            case "Exit":
                connection.end();
                break;
                default:
                    Exit();
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
            // Filter to create a new array
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
function addDept() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What is the name of the new department?",
          })
        .then(function(answer) {
        var query = "INSERT INTO department (name) VALUES ( ? )";
        connection.query(query, answer.department, function(err, res) {
            console.log(`You have added: ${(answer.department)}.`)
        })
        mainMenu();
        })
}

function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw (err);
    inquirer
        .prompt([{
            name: "title",
            type: "input",
            message: "What is the title of the new role?",
          }, 
          {
            name: "salary",
            type: "input",
            message: "What is the salary of the new role?",
          },
          {
            name: "departmentName",
            type: "list",
            message: "Which department does this role fall under?",
            choices: function() {
                let deptNameArray = [];
                res.forEach(res =>{
                    deptNameArray.push(res.name);
                })
                return deptNameArray;
            }
          }
        ])
        .then(function(answer){
            const department = answer.departmentName;
            connection.query("SELECT * FROM department", function(err, res){
                if (err) throw err;
                // Filter to create a new array
                let filterDepartment = res.filter(function(res){
                    return res.name == department;
                })
                let id = filterDepartment[0].id;
                let query= "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                let values = [answer.title, parseInt(answer.salary), id];
                connection.query(query,values, function(err, res, fields){
                    console.log(`You added: ${(values[0])}.`);
                })
            })
            mainMenu();
        })
    })

}
// // Update employee roles:
function updateEmployeeRole(){
    connection.query("SELECT * FROM employee", function(err, res){
        if(err) throw err;
        inquirer
        .prompt({
            name: "emplyeeRole",
            type: "list",
            message: " Which employee's role do you want to update?",
            choices: function(){
                employeeArray = [];
                res.forEach(res => {
                    employeeArray.push(res.last_name);
                })
                return employeeArray;
            }
        })
        .then(function(answer){
            console.log(answer);
            const name = answer.employeeName
            connection.query("SELECT * FROM role", function(err, res){
                inquirer
                .prompt({
                    name: "assignRole",
                    type: "list",
                    message: "Which role do you want to assign the selected employee?",
                    choices: function(){
                        rolesArray = [];
                        res.forEach(res => {
                            rolesArray.push(res.title)
                        })
                        return rolesArray;
                    }
                })
                .then(function(rolesAnswer){
                    const role = rolesAnswer.role;
                    console.log(rolesAnswer.role);
                    connection.query("SELECT * FROM role WHERE title = ?", [role], function(err, res){
                        if(err) throw err;
                        let roleId = [0].id;
                        let query = "UPDATE employee SET role_id ? WHERE last_name";
                        let values = [roleId, name];
                        console.log(values);

                        connection.query(query,values, function(err, res, feilds){
                            console.log("Updated employee roles.")
                        })
                    })
                    mainMenu();
                })
            })
        }) 
    })
}

function Exit() {
    connection.end();
}