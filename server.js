const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
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

  function viewEmployees() {
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }

function addEmployee() {

    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;

        inquirer.prompt([

            {
                type: "input",
                name: "firstname",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the employee's last name?"
            },
            {
                name: "choice",
                type: "list",
                choices: function () {
                    let choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].title);
                    }

                    return choiceArray;
                },
                message: "What is the employee's role?"
            }

        ]).then(function (res) {
            for (let i = 0; i < results.length; i++) {
                if (results[i].title === res.choice) {
                    res.role_id = results[i].id;
                }
            }
            let query = "INSERT INTO employee SET ?"
            const VALUES = {
                first_name: res.firstname,
                last_name: res.lastname,
                role_id: res.role_id
            }
            connection.query(query, VALUES, function (err) {
                if (err) throw err;
                console.log("Employee successfully added!");
            });
            mainMenu();
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
        let query = "INSERT INTO department (name) VALUES ( ? )";
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
                res.forEach(res => {
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
function updateEmployeeRole() {
    let roleQuery = "SELECT * FROM role;";
    let departmentQuery = "SELECT * FROM department;";

    connection.query(roleQuery, function (err, res) {
        connection.query(departmentQuery, function (err, departments) {

            if (err) throw err;
            inquirer.prompt([

                {
                    name: "newRole",
                    type: "list",
                    choices: function () {
                        let arrayOfChoices = [];
                        for (let i = 0; i < res.length; i++) {
                            arrayOfChoices.push(res[i].title);
                        }

                        return arrayOfChoices;
                    },
                    message: "Which Role would you like to update?"
                },
                {
                    name: "newSalary",
                    type: "input",
                    message: "What is the new salary for this role?"

                },
                {
                    name: "choice",
                    type: "list",
                    choices: function () {
                        let arrayOfChoices = [];
                        for (var i = 0; i < departments.length; i++) {
                            arrayOfChoices.push(departments[i].name);
                        }
                        return arrayOfChoices;
                    },
                    message: "Which department this role belongs to?"
                },
            ]).then(function (result) {

                for (let i = 0; i < departments.length; i++) {
                    if (departments[i].name === result.choice) {
                        result.department_id = departments[i].id;
                    }
                }
                let query = "UPDATE role SET title=?,salary= ? WHERE department_id= ?"
                const VALUES = [

                    { title: result.newRole },
                    { salary: result.newSalary },
                    { department_id: result.department_id }
                ]
                let query1 = connection.query(query, VALUES, function (err) {
                    if (err) throw err;
                    console.table("Role Successfuly Updated!");
                    mainMenu();
                });

            })
        })
    })
}
function Exit() {
    connection.end();
}