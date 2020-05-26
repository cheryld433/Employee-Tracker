DROP DATABASE IF EXISTS employeeDB;
CREATE database employeeDB;

USE employeeDB;

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INTEGER (10) NULL,
    manager_id INTEGER (10) NULL,
    PRIMARY KEY(id)
);

CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR (30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NULL,
    salary DECIMAL (10,4) NULL,
    department_id INTEGER (10) NULL
    PRIMARY KEY (id)
);

SELECT * FROM employee;
SELECT * FROM department;
SELECT * FROM role;


