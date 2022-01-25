const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
//const logo = require('asciiart-logo');

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

//Prompt for main menu
function menuPrompt() {
    return inquirer.prompt(
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
        },
    )
        .then((reponses) => {
            if (reponses.menu === 'View All Employees') {
                return viewEmployees();
            } else if (reponses.menu === 'View All Roles') {
                return viewRoles();
            } else if (reponses.menu === 'View All Departments') {
                return viewDepartments();
            } else if (reponses.menu === 'Add Department') {
                return addDepartment();
            } else if (reponses.menu === 'Add Role') {
                return addRole();    
            } else {
                return
            }
        }
    )
};

menuPrompt();

function viewEmployees() {
    connection.query(
        'SELECT * FROM employee', 
        function(err, results) {
            console.table(results);
            menuPrompt();
        }
    )
}

function viewRoles() {
    connection.query(
        'SELECT * FROM roles', 
        function(err, results) {
            console.table(results);
            menuPrompt();
        }
    )
}

function viewDepartments() {
    connection.query(
        'SELECT * FROM department', 
        function(err, results) {
            console.table(results);
            menuPrompt();
        }
    )
}

function addDepartment() {
    return inquirer.prompt(
        [
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the department?',
            },
        ])
        .then((responses) => {
            connection.query(
                `INSERT INTO department (name) VALUES ("${responses.departmentName}")`, 
                function(err, results) {
                    console.log("Added new department to database.");
                    menuPrompt();
                }
            )
        })
}

function addRole() {
    return inquirer.prompt(
        [
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary of the role?',
                },
                {
                type: 'list',
                name: 'roleDepartment',
                message: 'Which department does the role belong to?',
                choices: ['Engineering', 'Human Resources', 'Research & Development']
                },
        ])
        .then((responses) => {
            connection.query(
                `INSERT INTO roles (title) VALUES ("${responses.roleName}")`,
                `INSERT INTO roles (salary) VALUES ("${responses.roleSalary}")`,
                `INSERT INTO roles (department_id) VALUES ("${responses.roleDepartment}")`,
                function(err, results) {
                    console.log("Added new role to database.");
                    menuPrompt();
                }
            )
        })    
}

