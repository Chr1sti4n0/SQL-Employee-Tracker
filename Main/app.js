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
        }
    )
}

function viewRoles() {
    connection.query(
        'SELECT * FROM roles', 
        function(err, results) {
            console.table(results);
        }
    )
}

function viewDepartments() {
    connection.query(
        'SELECT * FROM department', 
        function(err, results) {
            console.table(results);
        }
    )
}